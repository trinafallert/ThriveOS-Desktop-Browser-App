import { NextRequest, NextResponse } from 'next/server'

/**
 * Lifebud AI Chat API
 *
 * This route bridges the in-app chat widget to your AI backend.
 * It supports two modes:
 *
 * 1. TELEGRAM MODE (recommended for session continuity)
 *    Set TELEGRAM_BOT_TOKEN + OPENCLAW_TELEGRAM_CHAT_ID (or look it up per user).
 *    Messages go through Telegram Bot API → your OpenClaw bot → back via webhook.
 *    This keeps the same session as the user's Telegram bot conversation.
 *
 * 2. OPENCLAW WEBHOOK MODE
 *    Set OPENCLAW_WEBHOOK_URL to your OpenClaw gateway endpoint.
 *    Note: each new request may start a fresh session depending on your OpenClaw config.
 *
 * 3. DIRECT AI MODE (fallback / dev)
 *    If neither env var is set, uses a basic Claude/OpenAI response.
 *
 * Required env vars (add to .env.local):
 *   TELEGRAM_BOT_TOKEN=your_bot_token          ← from BotFather
 *   OPENCLAW_WEBHOOK_URL=https://...            ← your OpenClaw gateway URL
 *   OPENCLAW_API_KEY=your_api_key              ← if OpenClaw requires auth
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const OPENCLAW_WEBHOOK_URL = process.env.OPENCLAW_WEBHOOK_URL
const OPENCLAW_API_KEY = process.env.OPENCLAW_API_KEY

// ─── Telegram mode ─────────────────────────────────────────────────────────
//
// To make sessions continuous with Telegram:
// 1. User links their Telegram account in app settings (sends /start to your bot)
// 2. Bot stores their chat_id mapped to their ThriveOS user_id in your DB
// 3. We fetch that chat_id here to send/receive through the same conversation
//
// For now this uses OPENCLAW_TELEGRAM_CHAT_ID as a global dev fallback.
// In production, look up the chat_id from Supabase by userId.

async function sendViaTelegram(chatId: string, message: string): Promise<string> {
  if (!TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN not set')

  // Send message to the user's Telegram conversation with the bot
  // (this appears in Telegram as if they sent it themselves)
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  })

  // In production: wait for bot's reply via webhook stored in your DB.
  // For now, return a placeholder — wire up a webhook receiver at /api/telegram-webhook
  // to capture bot replies and store them, then poll/stream them here.
  return '(Reply via Telegram — see the Telegram app or connect a webhook receiver)'
}

// ─── OpenClaw webhook mode ─────────────────────────────────────────────────

async function sendViaOpenClaw(message: string, userId: string): Promise<string> {
  if (!OPENCLAW_WEBHOOK_URL) throw new Error('OPENCLAW_WEBHOOK_URL not set')

  const res = await fetch(OPENCLAW_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(OPENCLAW_API_KEY ? { 'Authorization': `Bearer ${OPENCLAW_API_KEY}` } : {}),
    },
    body: JSON.stringify({ message, userId, source: 'thriveos-web' }),
  })

  if (!res.ok) throw new Error(`OpenClaw error: ${res.status}`)
  const data = await res.json()

  // OpenClaw typically returns { reply: "..." } or { message: "..." } or { text: "..." }
  return data.reply ?? data.message ?? data.text ?? data.response ?? JSON.stringify(data)
}

// ─── Fallback: smart canned responses for dev/demo ─────────────────────────

function devReply(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('goal')) return "Let's work on your goals! Head to the Goals section to track progress, or tell me more about what you're trying to achieve and I'll help you break it down."
  if (lower.includes('habit')) return "Consistency is everything! Your habit streak is looking good. Want tips on building a new habit or sticking to an existing one?"
  if (lower.includes('business') || lower.includes('idea')) return "Love it — let's think through this. What's the core problem your business solves, and who's the person it helps most?"
  if (lower.includes('mood') || lower.includes('feeling')) return "Your emotional check-ins matter. How are you actually feeling today — beyond the surface level?"
  if (lower.includes('match') || lower.includes('people')) return "Life Match is on its way! Your profile is saved and our AI is already keeping an eye out for aligned connections. I'll let you know as soon as we have matches for you."
  if (lower.includes('journal')) return "Journaling is one of the most powerful things you can do. What would you like to reflect on today?"
  if (lower.includes('fitness') || lower.includes('workout')) return "Moving your body is non-negotiable. How's your streak looking? Want me to help design a simple weekly movement plan?"
  return "I'm here to help with goals, habits, business, life — whatever's on your mind. Tell me more and let's figure it out together! 🌟"
}

// ─── Route handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { message, userId, telegramChatId } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 })
    }

    let reply: string

    if (TELEGRAM_BOT_TOKEN && telegramChatId) {
      // Telegram mode: routes through user's Telegram conversation → same session
      reply = await sendViaTelegram(telegramChatId, message)
    } else if (OPENCLAW_WEBHOOK_URL) {
      // OpenClaw webhook mode
      reply = await sendViaOpenClaw(message, userId ?? 'anonymous')
    } else {
      // Dev mode: smart canned responses
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800)) // simulate latency
      reply = devReply(message)
    }

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[lifebud-chat]', err)
    return NextResponse.json(
      { reply: "I'm having trouble connecting right now. Try again in a moment!" },
      { status: 200 } // Return 200 so the UI shows the message gracefully
    )
  }
}

// ─── Telegram webhook receiver ─────────────────────────────────────────────
//
// When your OpenClaw/Telegram bot replies, Telegram sends a POST to your webhook URL.
// Set your bot's webhook to: https://your-domain.com/api/lifebud-chat/telegram-webhook
// Then store bot replies in Supabase and stream them to the chat widget.
//
// Register your webhook:
//   curl "https://api.telegram.org/bot{TOKEN}/setWebhook?url=https://your-domain.com/api/telegram-webhook"

export async function GET() {
  return NextResponse.json({
    status: 'Lifebud Chat API is running',
    mode: TELEGRAM_BOT_TOKEN
      ? 'telegram'
      : OPENCLAW_WEBHOOK_URL
      ? 'openclaw'
      : 'dev',
    docs: 'Set TELEGRAM_BOT_TOKEN + OPENCLAW_WEBHOOK_URL in .env.local to connect your bot',
  })
}
