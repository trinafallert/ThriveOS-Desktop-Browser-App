'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/user-context'
import { Sparkles, ArrowRight, ChevronRight, Check, X, Tag, Download, Infinity } from 'lucide-react'

const TOTAL_STEPS = 9

// Chip component
function Chip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
        selected
          ? 'bg-thrive-purple text-white border-thrive-purple shadow-thrive'
          : 'bg-white text-gray-600 border-gray-200 hover:border-thrive-purple hover:text-thrive-purple'
      }`}
    >
      {label}
    </button>
  )
}

// Progress bar
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className="bg-gradient-to-r from-thrive-purple to-thrive-blue h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${((step) / total) * 100}%` }}
      />
    </div>
  )
}

// Text area input
function StyledTextarea({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-thrive-purple focus:ring-2 focus:ring-thrive-purple/10 outline-none text-sm text-gray-700 placeholder:text-gray-400 resize-none transition-all"
    />
  )
}

// Text input
function StyledInput({
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-thrive-purple focus:ring-2 focus:ring-thrive-purple/10 outline-none text-sm text-gray-700 placeholder:text-gray-400 transition-all"
    />
  )
}

function toggleItem(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, updateUser, completeOnboarding } = useUser()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingDone, setLoadingDone] = useState(false)
  const [localData, setLocalData] = useState({ ...user })
  // Pricing step state
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoOpen, setPromoOpen] = useState(false)
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase()
    if (code === 'FRIENDS') {
      setPromoApplied(true)
      setPromoError('')
      setSelectedPlan('friends_unlimited')
    } else {
      setPromoError('Invalid code. Try FRIENDS for 2 weeks free!')
      setPromoApplied(false)
    }
  }

  useEffect(() => {
    if (user.onboardingComplete) {
      router.replace('/dashboard')
    }
  }, [user.onboardingComplete, router])

  const update = (key: string, value: unknown) => {
    setLocalData(prev => ({ ...prev, [key]: value }))
    updateUser({ [key]: value } as Parameters<typeof updateUser>[0])
  }

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1)
  }

  const back = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const skip = () => next()

  const finish = () => {
    setLoading(true)
    setTimeout(() => setLoadingDone(true), 3000)
    setTimeout(() => {
      completeOnboarding()
      router.push('/dashboard')
    }, 5000)
  }

  // ─── STEP 0: Welcome + Name ───────────────────────────────────────────────
  const Step0 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-thrive-purple to-thrive-blue flex items-center justify-center shadow-thrive">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to ThriveOS</h1>
        <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
          Let&apos;s take 2 minutes to personalize your AI system — so we can tailor your dashboard,
          recommend tools that actually fit your life, and help you build the business and life
          you&apos;re dreaming of.
        </p>
      </div>
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">What should we call you?</label>
        <StyledInput
          placeholder="Your first name..."
          value={localData.name}
          onChange={v => update('name', v)}
        />
      </div>
      <button
        onClick={next}
        disabled={!localData.name.trim()}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-thrive-purple to-thrive-blue text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-thrive"
      >
        Let&apos;s do this <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )

  // ─── STEP 1: Vision ───────────────────────────────────────────────────────
  const Step1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-thrive-purple uppercase tracking-widest">Step 1 — Vision</span>
        <h2 className="text-2xl font-bold text-gray-900">Let&apos;s design your dream life ✨</h2>
        <p className="text-sm text-gray-500">
          We&apos;re asking this so our AI can help you build toward what actually matters to you — not just fill your calendar.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            If you had unlimited time, money, and freedom — what would your life look like? Where would you be? What would you do each day?
          </label>
          <StyledTextarea
            placeholder="I'd be living between NYC and Bali, running a creative agency, spending mornings writing..."
            value={localData.dreamLife}
            onChange={v => update('dreamLife', v)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            What excites you most right now? Any new visions, ideas, or paths you&apos;re exploring?
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Building a business', 'Traveling more', 'Creative projects', 'Financial freedom',
              'Health & fitness', 'Deep relationships', 'Learning new skills', 'Making an impact',
              'Passive income', 'Starting fresh', 'Scaling up', 'Personal growth',
            ].map(item => (
              <Chip
                key={item}
                label={item}
                selected={localData.excitements.includes(item)}
                onClick={() => update('excitements', toggleItem(localData.excitements, item))}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            If everything worked out perfectly this year, what would your life look like? (We&apos;ll use AI to help get you there!)
          </label>
          <StyledTextarea
            placeholder="I'd have hit $10K/month, moved to a new city, launched my course..."
            value={localData.perfectYear}
            onChange={v => update('perfectYear', v)}
          />
        </div>
      </div>
    </div>
  )

  // ─── STEP 2: Current Reality ──────────────────────────────────────────────
  const Step2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-thrive-purple uppercase tracking-widest">Step 2 — Current Reality</span>
        <h2 className="text-2xl font-bold text-gray-900">Where are you right now? 📍</h2>
        <p className="text-sm text-gray-500">
          Honest answers help our AI meet you exactly where you are — no judgment, just support.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            How do you currently spend most of your time? (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Working a 9-5', 'Running my own business', 'Freelancing / consulting',
              'Student', 'Building something new on the side', 'In between — figuring it out',
              'Stay-at-home parent', 'Just quit everything to start fresh', 'Multiple income streams',
            ].map(item => (
              <Chip
                key={item}
                label={item}
                selected={localData.currentSituation.includes(item)}
                onClick={() => update('currentSituation', toggleItem(localData.currentSituation, item))}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            What feels messy, overwhelming, or stuck right now?
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Time management', 'Staying consistent', 'Making enough money', 'Finding direction',
              'Too many ideas', 'Procrastination', 'Mindset / self-doubt', 'Building a team',
              'Marketing / getting clients', 'Work-life balance', 'Staying motivated', 'Organization',
            ].map(item => (
              <Chip
                key={item}
                label={item}
                selected={localData.messy.includes(item)}
                onClick={() => update('messy', toggleItem(localData.messy, item))}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            What do you wish you had help with every day?
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Prioritizing tasks', 'Staying accountable', 'Content creation', 'Revenue tracking',
              'Habit building', 'Planning my week', 'Journaling / reflection', 'Managing my business',
              'Personal health', 'Mindset coaching', 'Networking / outreach',
            ].map(item => (
              <Chip
                key={item}
                label={item}
                selected={localData.dailyHelpWish.includes(item)}
                onClick={() => update('dailyHelpWish', toggleItem(localData.dailyHelpWish, item))}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ─── STEP 3: Goals ────────────────────────────────────────────────────────
  const Step3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-thrive-purple uppercase tracking-widest">Step 3 — Goals</span>
        <h2 className="text-2xl font-bold text-gray-900">Let&apos;s map your direction 🎯</h2>
        <p className="text-sm text-gray-500">
          Dream big — you have an expert AI team coming. We&apos;ll use these to auto-build your dashboard.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Top 3 Life Goals</label>
          {[0, 1, 2].map(i => (
            <StyledInput
              key={i}
              placeholder={`Life goal ${i + 1}...`}
              value={localData.lifeGoals[i] || ''}
              onChange={v => {
                const goals = [...localData.lifeGoals]
                goals[i] = v
                update('lifeGoals', goals)
              }}
            />
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Top 3 Business / Money Goals</label>
          {[0, 1, 2].map(i => (
            <StyledInput
              key={i}
              placeholder={`Business goal ${i + 1}...`}
              value={localData.bizGoals[i] || ''}
              onChange={v => {
                const goals = [...localData.bizGoals]
                goals[i] = v
                update('bizGoals', goals)
              }}
            />
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Any current projects or ideas you&apos;re working on?</label>
          <StyledTextarea
            placeholder="Starting a podcast, building a Shopify store, launching a coaching program..."
            value={localData.currentProjects}
            onChange={v => update('currentProjects', v)}
          />
        </div>

        <div className="p-4 rounded-2xl bg-thrive-purple-soft border border-thrive-purple/10 space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            💎 What kind of life do you NOT want? (This one&apos;s powerful.)
          </label>
          <StyledTextarea
            placeholder="I never want to be stuck at a desk doing work I hate, or feel like I'm living for the weekend..."
            value={localData.notWantedLife}
            onChange={v => update('notWantedLife', v)}
          />
        </div>
      </div>
    </div>
  )

  // ─── STEP 4: Work Style ───────────────────────────────────────────────────
  const Step4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-thrive-purple uppercase tracking-widest">Step 4 — Work Style</span>
        <h2 className="text-2xl font-bold text-gray-900">How do you operate best? ⚡</h2>
        <p className="text-sm text-gray-500">
          This is what makes your AI actually feel personal — so it can show up how you need it to.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Your natural work style:</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Fast + action-focused', emoji: '⚡', desc: 'Ship first, refine later' },
              { label: 'Calm + thoughtful', emoji: '🧘', desc: 'Intentional and deliberate' },
              { label: 'Structured + organized', emoji: '📋', desc: 'Systems and checklists' },
              { label: 'Chaotic + creative', emoji: '🎨', desc: 'Vibes-based, non-linear' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => update('workStyle', item.label)}
                className={`p-4 rounded-2xl border text-left transition-all duration-150 ${
                  localData.workStyle === item.label
                    ? 'bg-thrive-purple-soft border-thrive-purple text-thrive-purple'
                    : 'bg-white border-gray-200 hover:border-thrive-purple/40'
                }`}
              >
                <div className="text-xl mb-1">{item.emoji}</div>
                <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">When are you most productive?</label>
          <div className="flex flex-wrap gap-2">
            {['Early morning (5–8am)', 'Morning (8–11am)', 'Midday', 'Afternoon', 'Evening', 'Night owl (10pm+)'].map(item => (
              <Chip
                key={item}
                label={item}
                selected={localData.productiveTime === item}
                onClick={() => update('productiveTime', item)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">What parts of work do you actually enjoy?</label>
          <div className="flex flex-wrap gap-2">
            {[
              'Envisioning & strategy', 'Building & creating', 'Managing teams', 'Behind the scenes',
              'Selling & pitching', 'Writing & content', 'Numbers & analytics', 'Design & aesthetics',
              'Coaching & teaching', 'Problem solving', 'Networking',
            ].map(item => (
              <Chip
                key={item}
                label={item}
                selected={localData.workEnjoyments.includes(item)}
                onClick={() => update('workEnjoyments', toggleItem(localData.workEnjoyments, item))}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">How do you prefer your AI to help?</label>
          <div className="flex flex-wrap gap-2">
            {['Send me reminders', 'Make smart suggestions', 'Full automation please', 'Just show me the data'].map(item => (
              <Chip
                key={item}
                label={item}
                selected={localData.aiPreference === item}
                onClick={() => update('aiPreference', item)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ─── STEP 5: AI Personality ───────────────────────────────────────────────
  const Step5 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-thrive-purple uppercase tracking-widest">Step 5 — Your AI</span>
        <h2 className="text-2xl font-bold text-gray-900">How should your AI show up? 🤖</h2>
        <p className="text-sm text-gray-500">
          Pick the vibe. You can always change it later.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          {
            id: 'Strategic CEO',
            emoji: '🧠',
            label: 'Strategic CEO',
            desc: 'Big picture thinking, data-driven, always 3 steps ahead. Talks business.',
            gradient: 'from-blue-500 to-thrive-purple',
          },
          {
            id: 'Supportive Bestie',
            emoji: '💖',
            label: 'Supportive Bestie',
            desc: 'Warm, encouraging, celebrates your wins and lifts you up on hard days.',
            gradient: 'from-thrive-pink to-rose-400',
          },
          {
            id: 'Fast Execution Machine',
            emoji: '⚡',
            label: 'Fast Execution Machine',
            desc: 'No fluff. Direct. Focuses on output and getting things shipped fast.',
            gradient: 'from-thrive-teal to-emerald-400',
          },
          {
            id: 'Strict Accountability Coach',
            emoji: '🎯',
            label: 'Accountability Coach',
            desc: 'Holds you to your word. Firm but fair. Won&apos;t let you off the hook.',
            gradient: 'from-thrive-gold to-orange-400',
          },
        ].map(p => (
          <button
            key={p.id}
            onClick={() => update('aiPersonality', p.id)}
            className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 group ${
              localData.aiPersonality === p.id
                ? 'border-thrive-purple shadow-thrive bg-thrive-purple-soft'
                : 'border-gray-200 bg-white hover:border-thrive-purple/40 hover:shadow-md'
            }`}
          >
            {localData.aiPersonality === p.id && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-thrive-purple flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-lg mb-3`}>
              {p.emoji}
            </div>
            <div className="text-sm font-bold text-gray-900 mb-1">{p.label}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{p.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )

  // ─── STEP 6: Connect ──────────────────────────────────────────────────────
  const Step6 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-thrive-purple uppercase tracking-widest">Step 6 — Connect (Optional)</span>
        <h2 className="text-2xl font-bold text-gray-900">Let&apos;s plug into your world 🌐</h2>
        <p className="text-sm text-gray-500">
          Totally optional — but if you share your links, we can understand your brand, past experience,
          and strengths so your AI can make posts, write copy, and coach you like a true business partner.
          You can always add these later!
        </p>
      </div>

      <div className="space-y-3">
        {[
          { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/yourname', emoji: '💼' },
          { key: 'website', label: 'Website / portfolio', placeholder: 'yoursite.com', emoji: '🌍' },
          { key: 'instagram', label: 'Instagram', placeholder: '@yourhandle', emoji: '📸' },
        ].map(field => (
          <div key={field.key} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-lg shrink-0">
              {field.emoji}
            </div>
            <StyledInput
              placeholder={field.placeholder}
              value={(localData as unknown as Record<string, string>)[field.key] ?? ''}
              onChange={v => update(field.key, v)}
            />
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-thrive-blue-soft border border-thrive-blue/10">
        <p className="text-xs text-gray-600 leading-relaxed">
          🔒 <strong>Your data is yours.</strong> We never sell or share your personal info.
          Links are used only to personalize your ThriveOS experience.
        </p>
      </div>
    </div>
  )

  // ─── STEP 7: Pricing ──────────────────────────────────────────────────────
  const Step7 = () => {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 'Free',
        priceNote: 'no card needed',
        emoji: '🆓',
        tagline: 'Explore the full platform',
        highlight: false,
        gradient: 'from-gray-400 to-gray-500',
        border: 'border-gray-200',
        bg: 'bg-gray-50',
        features: [
          'Full dashboard — Lifebud, Bizbox, goals, habits',
          'Life Match profile & questionnaire',
          'Basic AI chat (demo responses)',
          'Free download of the desktop app',
          'No credit card needed',
        ],
        cta: 'Start Free',
        ctaStyle: 'bg-gray-800 hover:bg-gray-700 text-white',
      },
      {
        id: 'starter',
        name: 'Starter',
        price: '$49',
        priceNote: '/month',
        emoji: '🌱',
        tagline: 'Get your AI bot active',
        highlight: false,
        gradient: 'from-teal-400 to-blue-500',
        border: 'border-teal-200',
        bg: 'bg-teal-50/30',
        features: [
          '500 AI messages / month',
          'Your own Lifebud AI bot',
          'Telegram bot link included',
          'Goals, habits & biz coaching',
          'Works on web + desktop',
        ],
        cta: 'Get Starter',
        ctaStyle: 'bg-gradient-to-r from-teal-400 to-blue-500 hover:opacity-90 text-white',
      },
      {
        id: 'growth',
        name: 'Growth',
        price: '$79',
        priceNote: '/month',
        emoji: '🚀',
        tagline: 'For serious builders',
        highlight: true,
        gradient: 'from-thrive-pink via-violet-500 to-thrive-blue',
        border: 'border-violet-400',
        bg: 'bg-violet-50/40',
        features: [
          '2,000 AI messages / month',
          'Dedicated Lifebud AI bot',
          'Telegram bot link included',
          'Priority response speed',
          'Full context — life + business',
          'Works on web + desktop',
        ],
        cta: 'Get Growth',
        ctaStyle: 'bg-gradient-to-r from-thrive-pink via-violet-500 to-thrive-blue hover:opacity-90 text-white',
      },
      {
        id: 'unlimited',
        name: 'Unlimited',
        price: '$149',
        priceNote: '/month',
        emoji: '♾️',
        tagline: 'No limits, full power',
        highlight: false,
        gradient: 'from-thrive-gold via-thrive-pink to-violet-600',
        border: 'border-yellow-300',
        bg: 'bg-yellow-50/30',
        features: [
          'Unlimited AI messages',
          'Dedicated bot, fastest speed',
          'Telegram bot link included',
          'Early access to new features',
          'Works on web + desktop',
        ],
        cta: 'Go Unlimited',
        ctaStyle: 'bg-gradient-to-r from-thrive-gold via-thrive-pink to-violet-600 hover:opacity-90 text-white',
      },
    ]

    return (
      <div className="space-y-5 animate-fade-in">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-thrive-purple uppercase tracking-widest">Almost there!</span>
          <h2 className="text-2xl font-bold text-gray-900">Choose your plan ✨</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Start free and explore — or activate your Lifebud AI bot now and hit the ground running.
          </p>
        </div>

        {/* Promo applied banner */}
        {promoApplied && (
          <div className="flex items-center gap-3 p-3.5 bg-green-50 border border-green-200 rounded-2xl">
            <span className="text-xl">🎉</span>
            <div>
              <p className="text-sm font-bold text-green-800">FRIENDS code applied!</p>
              <p className="text-xs text-green-700">2 weeks of Unlimited — free. Then just $39/mo forever.</p>
            </div>
          </div>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-2 gap-3">
          {plans.map(plan => {
            const isSelected = selectedPlan === plan.id || (promoApplied && plan.id === 'unlimited')
            return (
              <button
                key={plan.id}
                onClick={() => { if (!promoApplied) setSelectedPlan(plan.id) }}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? `${plan.border} ${plan.bg} shadow-md ring-2 ring-violet-400/30`
                    : `border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm`
                }`}
              >
                {plan.highlight && !promoApplied && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-thrive-pink to-violet-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                    Most Popular
                  </div>
                )}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="text-xl mb-1.5">{plan.emoji}</div>
                <div className="flex items-baseline gap-1 mb-0.5">
                  <span className="text-lg font-extrabold text-gray-900">
                    {promoApplied && plan.id === 'unlimited' ? 'FREE' : plan.price}
                  </span>
                  {!(promoApplied && plan.id === 'unlimited') && (
                    <span className="text-xs text-gray-400">{plan.priceNote}</span>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-800">{plan.name}</p>
                <p className="text-[11px] text-gray-500 mb-2.5 leading-snug">{plan.tagline}</p>
                <ul className="space-y-1.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                      <Check className="w-3 h-3 text-violet-400 shrink-0 mt-0.5" />
                      {f === 'Unlimited AI messages' && promoApplied
                        ? <span><strong>2 weeks free</strong>, then $39/mo</span>
                        : f}
                    </li>
                  ))}
                </ul>
                {plan.id === 'free' && (
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
                    <Download className="w-3 h-3" />
                    Includes free desktop app download
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Promo code — small & subtle */}
        <div className="text-center">
          {!promoOpen ? (
            <button
              onClick={() => setPromoOpen(true)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5 mx-auto"
            >
              <Tag className="w-3 h-3" />
              Have a promo code?
            </button>
          ) : (
            <div className="flex items-center gap-2 max-w-xs mx-auto">
              <input
                type="text"
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value); setPromoError('') }}
                onKeyDown={e => e.key === 'Enter' && applyPromo()}
                placeholder="Enter code..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 uppercase"
                autoFocus
              />
              <button
                onClick={applyPromo}
                className="px-3 py-2 bg-violet-500 text-white text-xs font-semibold rounded-xl hover:bg-violet-600 transition-colors"
              >
                Apply
              </button>
            </div>
          )}
          {promoError && (
            <p className="text-xs text-red-500 mt-1.5">{promoError}</p>
          )}
        </div>

        {/* CTA for selected plan */}
        {selectedPlan && (
          <button
            onClick={() => setStep(s => s + 1)}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
              plans.find(p => p.id === selectedPlan)?.ctaStyle ??
              'bg-gradient-to-r from-thrive-pink to-violet-500 text-white hover:opacity-90'
            }`}
          >
            {promoApplied
              ? <><span className="text-base">🎉</span> Claim 2 Weeks Free Unlimited</>
              : <>{plans.find(p => p.id === selectedPlan)?.cta ?? 'Continue'} <ChevronRight className="w-4 h-4" /></>
            }
          </button>
        )}

        <p className="text-center text-[11px] text-gray-400">
          No credit card required for free plan · Cancel anytime · Secure payment via Stripe
        </p>
      </div>
    )
  }

  // ─── STEP 8: Loading / Reward ─────────────────────────────────────────────
  const Step8 = () => (
    <div className="space-y-8 animate-fade-in text-center">
      {!loadingDone ? (
        <>
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-thrive-purple to-thrive-blue flex items-center justify-center shadow-thrive animate-pulse-soft">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your AI is setting things up...</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Personalizing your dashboard, mapping your goals, and building your custom AI system.
            </p>
          </div>

          <div className="space-y-3 text-left max-w-xs mx-auto">
            {[
              'Analyzing your vision & goals...',
              'Building your personalized dashboard...',
              'Configuring your AI assistant...',
              'Creating your first tasks & insights...',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full bg-thrive-purple-soft border border-thrive-purple/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-thrive-purple animate-pulse" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-thrive-teal to-emerald-400 flex items-center justify-center shadow-thrive">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Your personalized AI system is ready ✨</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Welcome, {localData.name}! ThriveOS is fully configured for you.
              Here&apos;s a peek at what&apos;s unlocked when you&apos;re ready to go Pro:
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            {[
              { label: 'AI Business Flows', icon: '⚡', locked: true },
              { label: 'Team Matching', icon: '🤝', locked: true },
              { label: 'Smart Automations', icon: '🤖', locked: true },
              { label: 'Revenue Forecasting', icon: '📈', locked: true },
              { label: 'AI Content Studio', icon: '✍️', locked: true },
              { label: 'Advanced Analytics', icon: '📊', locked: true },
            ].map(f => (
              <div key={f.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100 relative">
                <div className="text-lg mb-1">{f.icon}</div>
                <div className="text-xs font-semibold text-gray-500">{f.label}</div>
                {f.locked && (
                  <div className="absolute inset-0 rounded-xl bg-white/60 flex items-center justify-center">
                    <span className="text-xs text-gray-400 font-medium">🔒 Pro</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400">Taking you to your dashboard now...</p>
        </>
      )}
    </div>
  )

  const steps = [
    { component: <Step0 />, label: 'Welcome', canSkip: false, isLast: false },
    { component: <Step1 />, label: 'Vision', canSkip: true, isLast: false },
    { component: <Step2 />, label: 'Reality', canSkip: true, isLast: false },
    { component: <Step3 />, label: 'Goals', canSkip: true, isLast: false },
    { component: <Step4 />, label: 'Work Style', canSkip: true, isLast: false },
    { component: <Step5 />, label: 'AI', canSkip: true, isLast: false },
    { component: <Step6 />, label: 'Connect', canSkip: true, isLast: false },
    { component: <Step7 />, label: 'Plan', canSkip: false, isLast: false },
    { component: <Step8 />, label: 'Loading', canSkip: false, isLast: true },
  ]

  const currentStep = steps[step]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-thrive-purple-soft flex items-center justify-center p-4">
      <div className={`w-full ${step === 7 ? 'max-w-2xl' : 'max-w-xl'}`}>
        {/* Header */}
        {step > 0 && step < TOTAL_STEPS - 1 && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Step {step} of {TOTAL_STEPS - 2}</span>
              <button onClick={back} className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                ← Back
              </button>
            </div>
            <ProgressBar step={step} total={TOTAL_STEPS - 2} />
            <div className="flex gap-1">
              {['Vision', 'Reality', 'Goals', 'Work Style', 'AI', 'Connect', 'Plan'].map((label, i) => (
                <div
                  key={label}
                  className={`flex-1 h-1 rounded-full transition-all ${
                    i + 1 < step ? 'bg-thrive-purple' : i + 1 === step ? 'bg-thrive-purple/40' : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {currentStep.component}

          {/* Navigation (except step 0 which has its own CTA, step 7 pricing has its own CTA, and step 8 loading) */}
          {step > 0 && step < TOTAL_STEPS - 1 && step !== 7 && (
            <div className="mt-8 flex items-center gap-3">
              {currentStep.canSkip && (
                <button
                  onClick={skip}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Skip
                </button>
              )}
              <button
                onClick={step === TOTAL_STEPS - 2 ? finish : next}
                className="ml-auto flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-thrive-purple to-thrive-blue text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-thrive"
              >
                {step === TOTAL_STEPS - 2 ? 'Build my ThriveOS' : 'Continue'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < TOTAL_STEPS - 1 && (
          <p className="text-center text-xs text-gray-400 mt-4">
            You can update any of this later in your settings ✨
          </p>
        )}
      </div>
    </div>
  )
}
