'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useUser } from '@/lib/user-context'
import { BotPricingModal, UpgradeBanner } from '@/components/chat/BotPricingModal'
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  Sparkles,
  Maximize2,
  Minimize2,
  Loader2,
  Settings2,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={cn('flex gap-2 mb-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-thrive-pink to-violet-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={cn('max-w-[80%]', isUser ? 'items-end' : 'items-start', 'flex flex-col gap-0.5')}>
        <div
          className={cn(
            'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-gradient-to-br from-violet-500 to-thrive-pink text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
          )}
        >
          {msg.content}
        </div>
        <span className="text-[10px] text-gray-400 px-1">{formatTime(msg.timestamp)}</span>
      </div>
    </div>
  )
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-2 mb-3 items-end">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-thrive-pink to-violet-500 flex items-center justify-center shrink-0 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-gray-100 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LifebudChat() {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hey ${user?.name?.split(' ')[0] ?? 'there'}! 👋 I'm your Lifebud AI. I can help with your goals, habits, business ideas — anything. What's on your mind?`,
      timestamp: new Date(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const [showPricing, setShowPricing] = useState(false)
  // In production, derive hasBotActive from the user's subscription from Supabase
  // For now: true if OPENCLAW_WEBHOOK_URL or TELEGRAM_BOT_TOKEN env is set (always true in dev mode)
  const hasBotActive = true  // replace with subscription check once Supabase is live

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setUnread(0)
    }
  }, [messages, open])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150)
      setUnread(0)
    }
  }, [open])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/lifebud-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userId: user?.name ?? 'anonymous' }),
      })

      const data = await res.json()
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply ?? 'I didn\'t quite catch that — try again!',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, reply])
      if (!open) setUnread(n => n + 1)
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Oops, something went wrong. Check your connection and try again.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, user, open])

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  // Panel dimensions
  const panelH = expanded ? 'h-[600px]' : 'h-[420px]'
  const panelW = expanded ? 'w-[420px]' : 'w-[340px]'

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div
          className={cn(
            'flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200',
            panelW, panelH
          )}
          style={{ boxShadow: '0 8px 40px rgba(139,92,246,0.15), 0 2px 8px rgba(0,0,0,0.08)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-thrive-pink via-violet-500 to-thrive-blue shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight">Lifebud AI</p>
              <p className="text-[10px] text-white/70 leading-tight">Your personal + business assistant</p>
            </div>
            <div className="flex items-center gap-1">
              <a
                href="/dashboard/settings"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Bot settings"
              >
                <Settings2 className="w-3.5 h-3.5 text-white" />
              </a>
              <button
                onClick={() => setExpanded(e => !e)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                title={expanded ? 'Shrink' : 'Expand'}
              >
                {expanded
                  ? <Minimize2 className="w-3.5 h-3.5 text-white" />
                  : <Maximize2 className="w-3.5 h-3.5 text-white" />
                }
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronDown className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Upgrade banner — shown when no bot is active */}
          {!hasBotActive && (
            <UpgradeBanner onUpgrade={() => setShowPricing(true)} />
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200">
            {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
              {[
                'Help me with my goals 🎯',
                'Review my habits 🔥',
                'Business idea check 💡',
              ].map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus() }}
                  className="shrink-0 text-xs bg-violet-50 hover:bg-violet-100 text-violet-600 border border-violet-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="px-4 py-3 border-t border-gray-100 shrink-0">
            <div className="flex items-end gap-2 bg-gray-50 rounded-2xl px-3 py-2 border border-gray-200 focus-within:border-violet-400 focus-within:bg-white transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything…"
                rows={1}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 resize-none outline-none leading-relaxed max-h-28"
                style={{ fieldSizing: 'content' } as React.CSSProperties}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all mb-0.5',
                  input.trim() && !loading
                    ? 'bg-gradient-to-br from-violet-500 to-thrive-pink text-white shadow-sm hover:opacity-90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                )}
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />
                }
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              Powered by Lifebud AI · Press Enter to send
            </p>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95',
          open
            ? 'bg-gradient-to-br from-gray-700 to-gray-900'
            : 'bg-gradient-to-br from-thrive-pink via-violet-500 to-thrive-blue'
        )}
        style={{ boxShadow: open ? undefined : '0 4px 20px rgba(139,92,246,0.4)' }}
        aria-label={open ? 'Close Lifebud chat' : 'Open Lifebud chat'}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7 text-white" />
            {/* Unread badge */}
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
            {/* Online pulse */}
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
          </>
        )}
      </button>

      {/* Pricing modal */}
      <BotPricingModal
        open={showPricing}
        onClose={() => setShowPricing(false)}
        onBYOT={() => { setShowPricing(false); window.location.href = '/dashboard/settings' }}
        onSelectPlan={() => setShowPricing(false)}
      />
    </div>
  )
}
