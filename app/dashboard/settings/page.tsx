'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BotPricingModal } from '@/components/chat/BotPricingModal'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import {
  Bot,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  MessageSquare,
  CreditCard,
  Zap,
  Infinity,
  Settings,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Subscription {
  plan: 'free' | 'starter' | 'growth' | 'unlimited' | 'byot'
  status: string
  credits_used: number
  credits_limit: number | null
  bot_username: string | null
  bot_display_name: string | null
  telegram_start_link: string | null
  current_period_end: string | null
}

interface BotCreds {
  telegram_bot_token: string
  telegram_chat_id: string
  telegram_linked: boolean
  openclaw_webhook_url: string
  openclaw_api_key: string
}

const PLAN_META: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  free:      { label: 'Free',      color: 'text-gray-600',    bg: 'bg-gray-100',           emoji: '🆓' },
  starter:   { label: 'Starter',   color: 'text-teal-700',    bg: 'bg-teal-50',            emoji: '🌱' },
  growth:    { label: 'Growth',    color: 'text-violet-700',  bg: 'bg-violet-50',           emoji: '🚀' },
  unlimited: { label: 'Unlimited', color: 'text-yellow-700',  bg: 'bg-yellow-50',           emoji: '♾️' },
  byot:      { label: 'Custom Bot',color: 'text-blue-700',    bg: 'bg-blue-50',             emoji: '🤖' },
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'bot' | 'account'>('bot')
  const [showPricing, setShowPricing] = useState(false)
  const [showBYOT, setShowBYOT] = useState(false)
  const [sub, setSub] = useState<Subscription | null>(null)
  const [creds, setCreds] = useState<BotCreds>({
    telegram_bot_token: '',
    telegram_chat_id: '',
    telegram_linked: false,
    openclaw_webhook_url: '',
    openclaw_api_key: '',
  })
  const [showToken, setShowToken] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load subscription
  useEffect(() => {
    if (!user || !supabase) return
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setSub(data) })
    supabase.from('bot_credentials').select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data) setCreds({
          telegram_bot_token: data.telegram_bot_token ?? '',
          telegram_chat_id: data.telegram_chat_id ?? '',
          telegram_linked: data.telegram_linked ?? false,
          openclaw_webhook_url: data.openclaw_webhook_url ?? '',
          openclaw_api_key: data.openclaw_api_key ?? '',
        })
      })
  }, [user])

  const saveCreds = async () => {
    if (!user || !supabase) return
    setSaving(true)
    await supabase.from('bot_credentials').upsert({
      user_id: user.id,
      telegram_bot_token: creds.telegram_bot_token || null,
      telegram_chat_id: creds.telegram_chat_id || null,
      openclaw_webhook_url: creds.openclaw_webhook_url || null,
      openclaw_api_key: creds.openclaw_api_key || null,
      updated_at: new Date().toISOString(),
    })
    // Update plan to byot if they entered credentials
    if (creds.telegram_bot_token || creds.openclaw_webhook_url) {
      await supabase.from('subscriptions').upsert({ user_id: user.id, plan: 'byot', status: 'active' })
      setSub(s => s ? { ...s, plan: 'byot' } : s)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const copyLink = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const plan = sub?.plan ?? 'free'
  const planMeta = PLAN_META[plan] ?? PLAN_META.free
  const creditsLeft = sub?.credits_limit != null ? Math.max(0, sub.credits_limit - (sub.credits_used ?? 0)) : null

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Settings" subtitle="Manage your account and Lifebud AI" />
      <main className="flex-1 p-8 max-w-3xl">

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit mb-8">
          {(['bot', 'account'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              {tab === 'bot' ? 'Lifebud AI' : 'Account'}
            </button>
          ))}
        </div>

        {/* ── Bot tab ──────────────────────────────────────────── */}
        {activeTab === 'bot' && (
          <div className="space-y-6">

            {/* Current plan card */}
            <Card className={cn('border-2', plan === 'free' ? 'border-gray-200' : 'border-violet-200')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-2xl', planMeta.bg)}>
                      {planMeta.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">Lifebud AI — {planMeta.label}</p>
                        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', planMeta.bg, planMeta.color)}>
                          {sub?.status ?? 'active'}
                        </span>
                      </div>
                      {plan === 'free' && (
                        <p className="text-sm text-gray-500 mt-0.5">No bot connected yet</p>
                      )}
                      {plan === 'byot' && (
                        <p className="text-sm text-gray-500 mt-0.5">Using your own bot credentials</p>
                      )}
                      {['starter', 'growth', 'unlimited'].includes(plan) && sub?.bot_username && (
                        <p className="text-sm text-gray-500 mt-0.5">@{sub.bot_username}</p>
                      )}
                    </div>
                  </div>

                  {plan !== 'free' && plan !== 'byot' && (
                    <Button variant="outline" size="sm" className="text-xs shrink-0">
                      <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                      Manage billing
                    </Button>
                  )}
                  {plan === 'free' && (
                    <Button
                      size="sm"
                      onClick={() => setShowPricing(true)}
                      className="bg-gradient-to-r from-thrive-pink to-violet-500 text-white hover:opacity-90 text-xs shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Get a bot
                    </Button>
                  )}
                </div>

                {/* Credit bar */}
                {sub?.credits_limit != null && plan !== 'free' && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>AI messages used this month</span>
                      <span className="font-semibold text-gray-700">{sub.credits_used} / {sub.credits_limit}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-400 to-thrive-pink rounded-full transition-all"
                        style={{ width: `${Math.min(100, (sub.credits_used / sub.credits_limit) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {creditsLeft} messages remaining · resets {sub.current_period_end
                        ? new Date(sub.current_period_end).toLocaleDateString()
                        : 'next month'}
                    </p>
                  </div>
                )}
                {plan === 'unlimited' && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 px-4 py-2.5 rounded-xl">
                    <Infinity className="w-4 h-4" />
                    <span className="font-medium">Unlimited messages — no caps, ever</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assigned bot / Telegram link */}
            {['starter', 'growth', 'unlimited'].includes(plan) && sub?.telegram_start_link && (
              <Card className="border-violet-100 bg-violet-50/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-violet-500" />
                    <CardTitle className="text-sm">Your Lifebud Bot on Telegram</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Your dedicated bot is ready. Open it in Telegram and send <code className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-xs font-mono">/start</code> to begin. Your conversations here and in Telegram are in sync — same session, same history.
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={sub.telegram_start_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#26A5E4] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.69 7.96c-.12.58-.45.72-.91.45l-2.52-1.86-1.22 1.17c-.13.13-.24.24-.5.24l.18-2.55 4.64-4.19c.2-.18-.04-.28-.31-.1L7.9 14.45 5.42 13.7c-.56-.17-.57-.56.12-.83l9.39-3.62c.47-.17.88.11.71.55z"/>
                      </svg>
                      Open in Telegram
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => copyLink(sub.telegram_start_link!)}
                      className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                    >
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy link'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upgrade options (if not on top plan) */}
            {plan !== 'unlimited' && (
              <div className="flex gap-3">
                {plan === 'free' && (
                  <button
                    onClick={() => setShowBYOT(true)}
                    className="flex-1 flex items-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all text-sm font-medium"
                  >
                    <Bot className="w-4 h-4" />
                    Connect your own bot (free)
                  </button>
                )}
                <button
                  onClick={() => setShowPricing(true)}
                  className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-all text-sm font-semibold"
                >
                  <Zap className="w-4 h-4" />
                  {plan === 'free' ? 'Choose a plan' : 'Upgrade plan'}
                </button>
              </div>
            )}

            {/* BYOT / custom credentials section */}
            {(plan === 'byot' || showBYOT) && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <CardTitle className="text-sm">Your Bot Credentials</CardTitle>
                    <Badge variant="secondary" className="text-xs">BYOT</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Enter your OpenClaw webhook URL or Telegram bot token. ThriveOS will route your chat messages through your own bot, keeping the same session as Telegram.
                  </p>

                  {/* Telegram section */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Telegram Bot</p>

                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Bot Token <span className="text-gray-400">(from BotFather)</span></label>
                      <div className="relative">
                        <input
                          type={showToken ? 'text' : 'password'}
                          value={creds.telegram_bot_token}
                          onChange={e => setCreds(c => ({ ...c, telegram_bot_token: e.target.value }))}
                          placeholder="1234567890:ABCdefGhIJKlmNoPQRsTUVwxyz"
                          className="w-full pr-10 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken(t => !t)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                        Your Chat ID with the bot
                        <span className="text-gray-400 font-normal ml-1">(send /start to your bot, then check @userinfobot)</span>
                      </label>
                      <input
                        type="text"
                        value={creds.telegram_chat_id}
                        onChange={e => setCreds(c => ({ ...c, telegram_chat_id: e.target.value }))}
                        placeholder="123456789"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 font-mono"
                      />
                    </div>

                    {creds.telegram_linked && (
                      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3.5 py-2.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" />
                        Telegram session linked — same conversation on both platforms
                      </div>
                    )}
                  </div>

                  {/* OpenClaw section */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">OpenClaw Gateway</p>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Webhook URL</label>
                      <input
                        type="url"
                        value={creds.openclaw_webhook_url}
                        onChange={e => setCreds(c => ({ ...c, openclaw_webhook_url: e.target.value }))}
                        placeholder="https://gateway.openclaw.ai/v1/chat"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">API Key <span className="text-gray-400">(if required)</span></label>
                      <div className="relative">
                        <input
                          type={showKey ? 'text' : 'password'}
                          value={creds.openclaw_api_key}
                          onChange={e => setCreds(c => ({ ...c, openclaw_api_key: e.target.value }))}
                          placeholder="oc_key_..."
                          className="w-full pr-10 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(k => !k)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <p className="text-xs text-gray-500">Credentials are encrypted and stored securely. We never share or use them outside your account.</p>
                  </div>

                  <Button
                    onClick={saveCreds}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-violet-500 to-thrive-pink text-white hover:opacity-90"
                  >
                    {saving ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Saving…</>
                    ) : saved ? (
                      <><CheckCircle2 className="w-4 h-4 mr-2 text-green-300" />Saved!</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" />Save credentials</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── Account tab ──────────────────────────────────────── */}
        {activeTab === 'account' && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" />
                <CardTitle>Account</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Email</label>
                <p className="text-sm text-gray-800 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                  {user?.email ?? '—'}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Display name</label>
                <p className="text-sm text-gray-800 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                  {(user?.user_metadata?.name as string) ?? '—'}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Login works across both the web app and desktop app — same account, same data, everywhere. Make sure both apps use the same Supabase project.
              </p>
            </CardContent>
          </Card>
        )}

      </main>

      <BotPricingModal
        open={showPricing}
        onClose={() => setShowPricing(false)}
        onBYOT={() => { setShowPricing(false); setShowBYOT(true); setActiveTab('bot') }}
        onSelectPlan={(plan) => {
          // TODO: redirect to Stripe checkout
          console.log('Selected plan:', plan)
          setShowPricing(false)
        }}
      />
    </div>
  )
}
