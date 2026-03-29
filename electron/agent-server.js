/**
 * ThriveOS local agent server — runs on port 3747.
 * Handles AI chat requests from the BrowserOS extension and proxies to Claude.
 *
 * Implements the Vercel AI SDK streaming format so the extension's
 * useChat() hook works without modification.
 */

'use strict'

const http = require('http')
const { app } = require('electron')
const path = require('path')

const PORT = 3747

let apiKey = null
let server = null

// ─── Vercel AI SDK streaming format helpers ───────────────────────────────────

function encodeChunk(type, value) {
  // AI SDK data stream format: "<type>:<json>\n"
  return `${type}:${JSON.stringify(value)}\n`
}

// ─── Simple in-memory conversation storage ────────────────────────────────────

const conversations = new Map()

// ─── Request parsing ──────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()))
      } catch (e) {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

// ─── CORS headers ─────────────────────────────────────────────────────────────

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

// ─── Chat endpoint ────────────────────────────────────────────────────────────

async function handleChat(req, res) {
  if (!apiKey) {
    res.writeHead(503, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'No API key configured. Please add your Anthropic API key in ThriveOS Settings → AI Settings.' }))
    return
  }

  let body
  try {
    body = await readBody(req)
  } catch {
    res.writeHead(400)
    res.end('Bad request')
    return
  }

  // The extension sends { messages: UIMessage[], ... extra context }
  const messages = (body.messages || [])
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role,
      content: m.parts
        ? m.parts.filter((p) => p.type === 'text').map((p) => p.text).join('')
        : (typeof m.content === 'string' ? m.content : ''),
    }))
    .filter((m) => m.content.trim())

  if (!messages.length) {
    res.writeHead(400)
    res.end('No messages')
    return
  }

  // Start streaming response in AI SDK format
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Vercel-AI-Data-Stream': 'v1',
    'Transfer-Encoding': 'chunked',
  })

  try {
    const Anthropic = require('@anthropic-ai/sdk')
    const anthropic = new Anthropic.default({ apiKey })

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 8192,
      system: 'You are ThriveOS Assistant, a helpful AI assistant built into the ThriveOS browser. You help users with tasks, answer questions, and assist with productivity across the Home dashboard, Bizbox (business tools), and Lifebud (health and wellbeing) sections.',
      messages,
    })

    let inputTokens = 0
    let outputTokens = 0
    const messageId = `msg_${Date.now()}`

    // Send initial stream start
    res.write(encodeChunk('f', { messageId }))

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(encodeChunk('0', chunk.delta.text))
      } else if (chunk.type === 'message_delta' && chunk.usage) {
        outputTokens = chunk.usage.output_tokens
      } else if (chunk.type === 'message_start' && chunk.message.usage) {
        inputTokens = chunk.message.usage.input_tokens
      }
    }

    // Send finish chunk
    res.write(encodeChunk('d', {
      finishReason: 'stop',
      usage: { promptTokens: inputTokens, completionTokens: outputTokens },
    }))
    res.end()
  } catch (err) {
    const msg = err?.message || 'Unknown error'
    // If the stream already started, send error in stream format
    res.write(encodeChunk('3', msg))
    res.end()
  }
}

// ─── Settings endpoints ────────────────────────────────────────────────────────

function handleGetSettings(res) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ hasApiKey: !!apiKey }))
}

async function handleSetApiKey(req, res) {
  let body
  try {
    body = await readBody(req)
  } catch {
    res.writeHead(400)
    res.end()
    return
  }
  if (body.apiKey) {
    apiKey = body.apiKey
    // Persist to electron-store if available
    try {
      const Store = require('electron-store')
      const store = new Store()
      store.set('anthropicApiKey', apiKey)
    } catch {}
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ ok: true }))
}

// ─── Health check ─────────────────────────────────────────────────────────────

function handleHealth(res) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ status: 'ok', version: '1.0.0', provider: 'anthropic' }))
}

// ─── Router ───────────────────────────────────────────────────────────────────

function createServer() {
  // Load persisted API key
  try {
    const Store = require('electron-store')
    const store = new Store()
    apiKey = store.get('anthropicApiKey') || null
  } catch {}

  // Also check environment variable as fallback
  if (!apiKey && process.env.ANTHROPIC_API_KEY) {
    apiKey = process.env.ANTHROPIC_API_KEY
  }

  server = http.createServer(async (req, res) => {
    setCors(res)

    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }

    const url = new URL(req.url, `http://127.0.0.1:${PORT}`)

    if (url.pathname === '/api/chat' && req.method === 'POST') {
      await handleChat(req, res)
    } else if (url.pathname === '/health' && req.method === 'GET') {
      handleHealth(res)
    } else if (url.pathname === '/api/settings' && req.method === 'GET') {
      handleGetSettings(res)
    } else if (url.pathname === '/api/settings/api-key' && req.method === 'POST') {
      await handleSetApiKey(req, res)
    } else {
      res.writeHead(404)
      res.end()
    }
  })

  server.listen(PORT, '127.0.0.1', () => {
    console.log(`[ThriveOS agent] Listening on http://127.0.0.1:${PORT}`)
  })

  server.on('error', (err) => {
    console.error('[ThriveOS agent] Server error:', err.message)
  })

  return server
}

function stopServer() {
  if (server) {
    server.close()
    server = null
  }
}

function setApiKey(key) {
  apiKey = key
}

module.exports = { createServer, stopServer, setApiKey }
