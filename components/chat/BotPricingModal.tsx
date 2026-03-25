'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { X, Check, Sparkles, Zap, Infinity, Bot, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type PlanId = 'starter' | 'growth' | 'unlimited' | 'byot'

interface Plan {
  id: PlanId
  name: string
  price: string
  priceNote: string
  emoji: string
  tagline: string
  credits: string
  features: string[]
  cta: string
  highlight?: boolean
  gradient: string
  badgeColor: string
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    priceNote: '/month',
    emoji: '🌱',
    tagline: 'Perfect to get started',
    credits: '500 AI messages / mo',
    features: [
      '500 AI messages per month',
      'Pre-made Lifebud bot assigned to you',
      'Telegram bot link to start chatting',
      'Works on web + desktop app',
      'Goals, habits & business coaching',
    ],
    cta: 'Get Starter',
    gradient: 'from-teal-400 to-thrive-blue',
    badgeColor: 'bg-teal-50 text-teal-600 border-teal-200',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$79',
    priceNote: '/month',
    emoji: '🚀',
    tagline: 'For active builders',
    credits: '2,000 AI messages / mo',
    features: [
      '2,000 AI messages per month',
      'Pre-made Lifebud bot assigned to you',
      'Telegram bot link to start chatting',
      'Priority response speed',
      'Full Lifebud context (goals, habits, biz)',
      'Works on web + desktop app',
    ],
    cta: 'Get Growth',
    highlight: true,
    gradient: 'from-thrive-pink via-violet-500 to-thrive-blue',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: '$149',
    priceNote: '/month',
    emoji: '♾️',
    tagline: 'No limits, full power',
    credits: 'Unlimited messages',
    features: [
      'Unlimited AI messages',
      'Dedicated Lifebud bot just for you',
      'Telegram bot link to start chatting',
      'Fastest response speed',
      'Full Lifebud context always on',
      'Works on web + desktop app',
      'Early access to new features',
    ],
    cta: 'Go Unlimited',
    gradient: 'from-thrive-gold via-thrive-pink to-violet-600',
    badgeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
]

interface Props {
  open: boolean
  onClose: () => void
  onSelectPlan?: (plan: PlanId) => void
  onBYOT?: () => void
}

export function BotPricingModal({ open, onClose, onSelectPlan, onBYOT }: Props) {
  const [loading, setLoading] = useState<PlanId | null>(null)

  const handleSelect = async (plan: PlanId) => {
    setLoading(plan)
    // TODO: create Stripe checkout session
    // const res = await fetch('/api/bot-subscription/checkout', {
    //   method: 'POST', body: JSON.stringify({ plan })
    // })
    // const { url } = await res.json()
    // window.location.href = url
    onSelectPlan?.(plan)
    setLoading(null)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          <div className="text-center pr-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-thrive-pink to-violet-500 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">Activate Your Lifebud AI</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Get a dedicated AI assistant that knows your goals, habits, and business — always available on web and desktop.
            </p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* Plans */}
          <div className="grid sm:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl border-2 p-5 flex flex-col transition-all',
                  plan.highlight
                    ? 'border-violet-500 bg-violet-50/30 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-thrive-pink to-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className="mb-4">
                  <span className="text-2xl">{plan.emoji}</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-400">{plan.priceNote}</span>
                  </div>
                  <p className="font-bold text-gray-800 mt-0.5">{plan.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{plan.tagline}</p>
                </div>

                <div className={cn('text-xs font-semibold px-2.5 py-1.5 rounded-xl border mb-4 text-center', plan.badgeColor)}>
                  {plan.id === 'unlimited'
                    ? <span className="flex items-center justify-center gap-1"><Infinity className="w-3.5 h-3.5" /> Unlimited</span>
                    : plan.credits}
                </div>

                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelect(plan.id)}
                  disabled={loading === plan.id}
                  className={cn(
                    'w-full text-sm font-semibold text-white rounded-xl h-10',
                    `bg-gradient-to-r ${plan.gradient} hover:opacity-90`
                  )}
                >
                  {loading === plan.id ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing…
                    </span>
                  ) : plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 border-t border-gray-100" />
          </div>

          {/* BYOT */}
          <div className="border border-gray-200 rounded-2xl p-5 flex items-start gap-4 hover:border-gray-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Bring Your Own Bot (Free)</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Already have an OpenClaw bot or Telegram bot token? Connect it here and use it with ThriveOS at no cost.
              </p>
            </div>
            <button
              onClick={onBYOT}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 border border-violet-200 bg-violet-50 px-3 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-colors"
            >
              Connect bot
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Trust line */}
          <p className="text-center text-xs text-gray-400">
            Secure payment via Stripe · Cancel anytime · Plans auto-renew monthly
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Compact upgrade banner (used inside chat panel) ────────

export function UpgradeBanner({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="mx-4 mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-thrive-pink-soft via-violet-50 to-thrive-blue-soft border border-violet-200">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-thrive-pink to-violet-500 flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-900 leading-tight">Activate your Lifebud AI bot</p>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
            Get a dedicated AI that knows your whole life. From $49/mo or connect your own.
          </p>
        </div>
      </div>
      <button
        onClick={onUpgrade}
        className="mt-2.5 w-full text-xs font-semibold bg-gradient-to-r from-thrive-pink via-violet-500 to-thrive-blue text-white py-2 rounded-xl hover:opacity-90 transition-opacity"
      >
        Choose a plan ✨
      </button>
    </div>
  )
}
