'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  Heart,
  Users,
  Briefcase,
  Mic,
  UserCheck,
  CalendarDays,
  UserPlus,
  GraduationCap,
  Brain,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Check,
  Bell,
  ArrowRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type MatchGoal =
  | 'friends'
  | 'partner'
  | 'collaboration'
  | 'podcast'
  | 'work-with'
  | 'events'
  | 'employees'
  | 'coaches'
  | 'therapist'
  | 'investors'

interface LifeMatchData {
  goals: MatchGoal[]
  coreValues: string[]
  customValues: string
  personalityTraits: string[]
  // Conditional — personal
  socialStyle: string
  ageRange: string
  relationshipStatus: string
  // Conditional — professional
  industries: string[]
  collaborationStyle: string
  lookingForInCollab: string[]
  // Conditional — support
  supportAreas: string[]
  // Meta
  wantNotifications: boolean
  completedAt: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MATCH_GOALS: { id: MatchGoal; label: string; emoji: string; desc: string; icon: React.ElementType; color: string; bg: string }[] = [
  { id: 'friends', label: 'Friends', emoji: '💛', desc: 'Find your people', icon: Users, color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200' },
  { id: 'partner', label: 'Partner / Dating', emoji: '💕', desc: 'Romantic connection', icon: Heart, color: 'text-thrive-pink', bg: 'bg-thrive-pink-soft border-thrive-pink/30' },
  { id: 'collaboration', label: 'Business Collab', emoji: '🤝', desc: 'Build something together', icon: Briefcase, color: 'text-thrive-blue', bg: 'bg-thrive-blue-soft border-thrive-blue/30' },
  { id: 'podcast', label: 'Podcast Guests', emoji: '🎙️', desc: 'Perfect interview guests', icon: Mic, color: 'text-thrive-purple', bg: 'bg-thrive-purple-soft border-thrive-purple/30' },
  { id: 'work-with', label: 'People to Work With', emoji: '🚀', desc: 'Aligned team members', icon: UserCheck, color: 'text-thrive-teal', bg: 'bg-thrive-teal-light border-thrive-teal/30' },
  { id: 'events', label: 'Events & Communities', emoji: '📅', desc: 'Groups that get you', icon: CalendarDays, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' },
  { id: 'employees', label: 'Employees / Freelancers', emoji: '👥', desc: 'Build your dream team', icon: UserPlus, color: 'text-thrive-blue', bg: 'bg-thrive-blue-soft border-thrive-blue/30' },
  { id: 'coaches', label: 'Coaches & Mentors', emoji: '🌱', desc: 'Level up with guidance', icon: GraduationCap, color: 'text-thrive-teal', bg: 'bg-thrive-teal-light border-thrive-teal/30' },
  { id: 'therapist', label: 'Therapist / Counselor', emoji: '🧠', desc: 'Support for your journey', icon: Brain, color: 'text-thrive-purple', bg: 'bg-thrive-purple-soft border-thrive-purple/30' },
  { id: 'investors', label: 'Investors', emoji: '💰', desc: 'Fund your vision', icon: DollarSign, color: 'text-thrive-gold', bg: 'bg-thrive-gold-light border-thrive-gold/30' },
]

const CORE_VALUES = [
  { id: 'intelligence', label: 'Intelligence / Depth', emoji: '🧠' },
  { id: 'efficiency', label: 'Efficiency / Gets things done', emoji: '⚡' },
  { id: 'positivity', label: 'Positivity / Optimism', emoji: '☀️' },
  { id: 'high-energy', label: 'High Energy / Ambitious', emoji: '🔥' },
  { id: 'humor', label: 'Humor / Lightheartedness', emoji: '😄' },
  { id: 'creativity', label: 'Creativity / Innovation', emoji: '🎨' },
  { id: 'loyalty', label: 'Loyalty / Trustworthiness', emoji: '🤝' },
  { id: 'authenticity', label: 'Authenticity / Realness', emoji: '💎' },
  { id: 'spirituality', label: 'Spirituality / Mindfulness', emoji: '🌿' },
  { id: 'adventure', label: 'Adventure / Spontaneity', emoji: '🌍' },
  { id: 'structure', label: 'Structure / Discipline', emoji: '📐' },
  { id: 'compassion', label: 'Compassion / Empathy', emoji: '💗' },
  { id: 'independence', label: 'Independence / Self-reliance', emoji: '🦅' },
  { id: 'family', label: 'Family / Community-oriented', emoji: '🏡' },
]

const PERSONALITY_TRAITS = [
  { id: 'introvert', label: 'More introverted', emoji: '🤫' },
  { id: 'extrovert', label: 'More extroverted', emoji: '🎉' },
  { id: 'thinker', label: 'Analytical / Big thinker', emoji: '💭' },
  { id: 'doer', label: 'Action-oriented / Doer', emoji: '🏃' },
  { id: 'dreamer', label: 'Visionary / Dreamer', emoji: '✨' },
  { id: 'grounded', label: 'Grounded / Practical', emoji: '🌱' },
  { id: 'social', label: 'Loves social settings', emoji: '👥' },
  { id: 'quiet', label: 'Prefers quiet connections', emoji: '☕' },
  { id: 'curious', label: 'Endlessly curious', emoji: '🔍' },
  { id: 'driven', label: 'Driven / Always building', emoji: '🚀' },
]

const SOCIAL_STYLES = [
  { id: 'small-gatherings', label: 'Small gatherings over big parties', emoji: '☕' },
  { id: 'adventures', label: 'Outdoor adventures & experiences', emoji: '🏔️' },
  { id: 'creative', label: 'Creative activities & projects', emoji: '🎨' },
  { id: 'deep-conversations', label: 'Deep conversations & big ideas', emoji: '💬' },
  { id: 'going-out', label: 'Going out & exploring the city', emoji: '🌆' },
  { id: 'staying-in', label: 'Cozy nights in', emoji: '🛋️' },
  { id: 'fitness', label: 'Fitness & wellness activities', emoji: '🧘' },
  { id: 'networking', label: 'Events & networking', emoji: '🤝' },
]

const INDUSTRIES = [
  '✍️ Content / Media', '🛍️ E-commerce', '💻 Tech / SaaS', '🎵 Music / Entertainment',
  '📚 Books / Publishing', '🌿 Wellness / Health', '💄 Beauty / Fashion',
  '🏠 Real Estate', '💰 Finance / Investing', '🎓 Education / Coaching',
  '🍕 Food & Hospitality', '🎬 Film / Video', '⚖️ Law / Consulting', '🌍 Non-profit',
]

const COLLAB_STYLES = [
  { id: 'visionary', label: 'I bring the vision', emoji: '💡' },
  { id: 'builder', label: 'I build & execute', emoji: '🔨' },
  { id: 'connector', label: 'I connect & grow networks', emoji: '🌐' },
  { id: 'creator', label: 'I create the content', emoji: '✍️' },
  { id: 'strategist', label: 'I strategize & plan', emoji: '🧩' },
  { id: 'operator', label: 'I run operations & systems', emoji: '⚙️' },
]

const SUPPORT_AREAS = [
  '🏋️ Health & fitness', '💸 Finances & wealth', '💼 Business growth',
  '❤️ Relationships', '🧠 Mental health & anxiety', '🎯 Life direction & purpose',
  '⚡ Productivity & habits', '✨ Confidence & mindset', '🌿 Spirituality & meaning',
  '💔 Healing & trauma', '🚀 Career transitions', '📚 Learning new skills',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isPersonal(goals: MatchGoal[]) {
  return goals.includes('friends') || goals.includes('partner')
}
function isBusiness(goals: MatchGoal[]) {
  return goals.some(g => ['collaboration', 'podcast', 'work-with', 'events', 'employees', 'investors'].includes(g))
}
function isSupport(goals: MatchGoal[]) {
  return goals.includes('coaches') || goals.includes('therapist')
}

function getSteps(goals: MatchGoal[]) {
  const steps = ['goals', 'values', 'personality']
  if (isPersonal(goals)) steps.push('personal')
  if (isBusiness(goals)) steps.push('professional')
  if (isSupport(goals)) steps.push('support')
  steps.push('done')
  return steps
}

// ─── Multi-select chip ────────────────────────────────────────────────────────

function Chip({
  selected,
  onClick,
  children,
  disabled,
  className,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-medium transition-all select-none',
        selected
          ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm'
          : disabled
          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
          : 'border-gray-200 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50/50',
        className
      )}
    >
      {selected && <Check className="w-3.5 h-3.5 shrink-0 text-violet-500" />}
      {children}
    </button>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            i < current ? 'bg-violet-500' : i === current ? 'bg-violet-300' : 'bg-gray-100',
            i === current ? 'flex-[2]' : 'flex-1'
          )}
        />
      ))}
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepHeading({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div className="mb-7">
      <span className="text-4xl mb-3 block">{emoji}</span>
      <h2 className="text-xl font-bold text-gray-900 mb-1.5">{title}</h2>
      <p className="text-sm text-gray-500 leading-relaxed">{subtitle}</p>
    </div>
  )
}

// ─── Intro screen ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  const features = [
    { emoji: '💛', label: 'Genuine friendships' },
    { emoji: '💕', label: 'Romantic partners' },
    { emoji: '🤝', label: 'Business collaborators' },
    { emoji: '🎙️', label: 'Podcast guests' },
    { emoji: '🧠', label: 'Coaches & therapists' },
    { emoji: '💰', label: 'Investors & mentors' },
    { emoji: '🚀', label: 'Dream team members' },
    { emoji: '📅', label: 'Events & communities' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-thrive-pink via-violet-500 to-thrive-blue mx-auto mb-5 flex items-center justify-center shadow-thrive">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Life Match ✨
        </h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-md mx-auto">
          AI-powered matching that connects you with the right people — personally and professionally — based on exactly who you are and where you're going.
        </p>
      </div>

      {/* What it matches */}
      <div className="bg-gradient-to-br from-thrive-pink-soft via-white to-thrive-purple-soft border border-thrive-pink/20 rounded-3xl p-6 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-thrive-pink mb-4">Life Match connects you with</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {features.map(f => (
            <div key={f.label} className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-gray-100 text-center">
              <span className="text-2xl">{f.emoji}</span>
              <span className="text-xs font-medium text-gray-700 leading-tight">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-3 mb-8">
        {[
          { step: '1', title: 'Tell us what you\'re looking for', desc: 'Friends, a partner, collaborators, coaches — pick what\'s active for you right now.' },
          { step: '2', title: 'Share your values & vibe', desc: 'A short questionnaire so our AI understands who you are and who you genuinely click with.' },
          { step: '3', title: 'We start looking', desc: 'AI will be on the lookout and notify you as we roll out matches. Your profile stays private until you say so.' },
        ].map(s => (
          <div key={s.step} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-thrive-pink flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
              {s.step}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{s.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={onStart}
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-thrive-pink via-violet-500 to-thrive-blue text-white hover:opacity-90 rounded-2xl shadow-thrive"
      >
        Start My Questionnaire
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <p className="text-center text-xs text-gray-400 mt-3">Takes about 3–5 minutes · Your info is private</p>
    </motion.div>
  )
}

// ─── Step 1: Goals ────────────────────────────────────────────────────────────

function StepGoals({ data, onChange }: { data: LifeMatchData; onChange: (d: Partial<LifeMatchData>) => void }) {
  const toggle = (id: MatchGoal) => {
    onChange({ goals: data.goals.includes(id) ? data.goals.filter(g => g !== id) : [...data.goals, id] })
  }

  return (
    <div>
      <StepHeading
        emoji="🎯"
        title="What are you open to?"
        subtitle="Select everything that's active for you right now. You can always update this later."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MATCH_GOALS.map(goal => {
          const selected = data.goals.includes(goal.id)
          const Icon = goal.icon
          return (
            <button
              key={goal.id}
              onClick={() => toggle(goal.id)}
              className={cn(
                'flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all',
                selected
                  ? 'border-violet-500 bg-violet-50 shadow-sm'
                  : 'border-gray-100 bg-white hover:border-violet-200 hover:bg-gray-50'
              )}
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', goal.bg.split(' ')[0])}>
                <span className="text-xl">{goal.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold', selected ? 'text-violet-700' : 'text-gray-800')}>{goal.label}</p>
                <p className="text-xs text-gray-400">{goal.desc}</p>
              </div>
              <div className={cn(
                'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
                selected ? 'bg-violet-500 border-violet-500' : 'border-gray-300'
              )}>
                {selected && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 2: Core values ──────────────────────────────────────────────────────

function StepValues({ data, onChange }: { data: LifeMatchData; onChange: (d: Partial<LifeMatchData>) => void }) {
  const MAX = 5
  const toggle = (id: string) => {
    const selected = data.coreValues.includes(id)
    if (!selected && data.coreValues.length >= MAX) return
    onChange({ coreValues: selected ? data.coreValues.filter(v => v !== id) : [...data.coreValues, id] })
  }

  return (
    <div>
      <StepHeading
        emoji="💎"
        title="What matters most to you in the people around you?"
        subtitle={`Pick up to ${MAX} core values you want in the people you meet. This is what our AI uses to find your best matches.`}
      />
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">Select up to 5</p>
        <span className={cn(
          'text-xs font-bold px-2.5 py-1 rounded-full',
          data.coreValues.length === MAX ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500'
        )}>
          {data.coreValues.length} / {MAX}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {CORE_VALUES.map(v => (
          <Chip
            key={v.id}
            selected={data.coreValues.includes(v.id)}
            onClick={() => toggle(v.id)}
            disabled={!data.coreValues.includes(v.id) && data.coreValues.length >= MAX}
          >
            <span>{v.emoji}</span>
            {v.label}
          </Chip>
        ))}
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
          Anything else that matters to you? <span className="font-normal text-gray-400 normal-case">(optional)</span>
        </label>
        <textarea
          value={data.customValues}
          onChange={e => onChange({ customValues: e.target.value })}
          placeholder="e.g. 'I care deeply about people who are growth-oriented and not afraid to be vulnerable…'"
          rows={3}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none leading-relaxed"
        />
      </div>
    </div>
  )
}

// ─── Step 3: Personality ──────────────────────────────────────────────────────

function StepPersonality({ data, onChange }: { data: LifeMatchData; onChange: (d: Partial<LifeMatchData>) => void }) {
  const MAX = 4
  const toggle = (id: string) => {
    const selected = data.personalityTraits.includes(id)
    if (!selected && data.personalityTraits.length >= MAX) return
    onChange({ personalityTraits: selected ? data.personalityTraits.filter(t => t !== id) : [...data.personalityTraits, id] })
  }

  return (
    <div>
      <StepHeading
        emoji="✨"
        title="How would you describe yourself?"
        subtitle="Pick up to 4 that feel most like you. This helps us match you with compatible people — not just people who are the same, but people who complement you well."
      />
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">Select up to 4</p>
        <span className={cn(
          'text-xs font-bold px-2.5 py-1 rounded-full',
          data.personalityTraits.length === MAX ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500'
        )}>
          {data.personalityTraits.length} / {MAX}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PERSONALITY_TRAITS.map(t => (
          <Chip
            key={t.id}
            selected={data.personalityTraits.includes(t.id)}
            onClick={() => toggle(t.id)}
            disabled={!data.personalityTraits.includes(t.id) && data.personalityTraits.length >= MAX}
          >
            <span>{t.emoji}</span>
            {t.label}
          </Chip>
        ))}
      </div>
    </div>
  )
}

// ─── Step: Personal (friends / dating) ───────────────────────────────────────

function StepPersonal({ data, onChange }: { data: LifeMatchData; onChange: (d: Partial<LifeMatchData>) => void }) {
  const wantsDating = data.goals.includes('partner')

  const toggleSocial = (id: string) => {
    const has = data.socialStyle.split(',').filter(Boolean).includes(id)
    const current = data.socialStyle.split(',').filter(Boolean)
    const next = has ? current.filter(s => s !== id) : [...current, id]
    onChange({ socialStyle: next.join(',') })
  }

  const selectedSocial = data.socialStyle.split(',').filter(Boolean)

  return (
    <div>
      <StepHeading
        emoji="💛"
        title="Your social style"
        subtitle="Help us understand how you like to spend time and connect with people."
      />

      <p className="text-sm font-semibold text-gray-700 mb-3">How do you love spending time with people?</p>
      <div className="flex flex-wrap gap-2 mb-7">
        {SOCIAL_STYLES.map(s => (
          <Chip key={s.id} selected={selectedSocial.includes(s.id)} onClick={() => toggleSocial(s.id)}>
            <span>{s.emoji}</span>
            {s.label}
          </Chip>
        ))}
      </div>

      {wantsDating && (
        <>
          <p className="text-sm font-semibold text-gray-700 mb-3">Where are you right now? <span className="text-gray-400 font-normal">(for dating matching)</span></p>
          <div className="flex flex-wrap gap-2 mb-7">
            {[
              { id: 'single', label: 'Single & ready', emoji: '🙋' },
              { id: 'open', label: 'Open to see what happens', emoji: '🌀' },
              { id: 'healing', label: 'Healing & growing first', emoji: '🌱' },
              { id: 'casually-dating', label: 'Casually dating', emoji: '😊' },
            ].map(s => (
              <Chip key={s.id} selected={data.relationshipStatus === s.id} onClick={() => onChange({ relationshipStatus: s.id })}>
                <span>{s.emoji}</span>
                {s.label}
              </Chip>
            ))}
          </div>

          <p className="text-sm font-semibold text-gray-700 mb-3">Age range you're open to</p>
          <div className="flex flex-wrap gap-2">
            {['18–25', '25–35', '35–45', '45–55', '55+', 'Open to any age'].map(r => (
              <Chip key={r} selected={data.ageRange === r} onClick={() => onChange({ ageRange: r })}>
                {r}
              </Chip>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Step: Professional ───────────────────────────────────────────────────────

function StepProfessional({ data, onChange }: { data: LifeMatchData; onChange: (d: Partial<LifeMatchData>) => void }) {
  const toggleIndustry = (id: string) => {
    const has = data.industries.includes(id)
    onChange({ industries: has ? data.industries.filter(i => i !== id) : [...data.industries, id] })
  }

  const toggleLooking = (id: string) => {
    const has = data.lookingForInCollab.includes(id)
    onChange({ lookingForInCollab: has ? data.lookingForInCollab.filter(l => l !== id) : [...data.lookingForInCollab, id] })
  }

  return (
    <div>
      <StepHeading
        emoji="🚀"
        title="Your professional world"
        subtitle="Tell us about your work so we can match you with people in the right space."
      />

      <p className="text-sm font-semibold text-gray-700 mb-3">What industries or niches are you in? <span className="text-gray-400 font-normal">(pick all that apply)</span></p>
      <div className="flex flex-wrap gap-2 mb-7">
        {INDUSTRIES.map(ind => (
          <Chip key={ind} selected={data.industries.includes(ind)} onClick={() => toggleIndustry(ind)}>
            {ind}
          </Chip>
        ))}
      </div>

      <p className="text-sm font-semibold text-gray-700 mb-3">What do you bring to a collaboration?</p>
      <div className="flex flex-wrap gap-2 mb-7">
        {COLLAB_STYLES.map(s => (
          <Chip key={s.id} selected={data.collaborationStyle === s.id} onClick={() => onChange({ collaborationStyle: s.id })}>
            <span>{s.emoji}</span>
            {s.label}
          </Chip>
        ))}
      </div>

      <p className="text-sm font-semibold text-gray-700 mb-3">What are you looking for in the people you work with?</p>
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'complementary', label: 'Someone who complements my skills', emoji: '🧩' },
          { id: 'similar', label: 'Someone with similar strengths', emoji: '🪞' },
          { id: 'audience', label: 'Overlapping audiences', emoji: '📣' },
          { id: 'accountability', label: 'Accountability & momentum', emoji: '⚡' },
          { id: 'long-term', label: 'Long-term partnership', emoji: '🤝' },
          { id: 'project-based', label: 'Project-based only', emoji: '📌' },
          { id: 'challenge', label: 'Someone who challenges me', emoji: '🔥' },
        ].map(s => (
          <Chip key={s.id} selected={data.lookingForInCollab.includes(s.id)} onClick={() => toggleLooking(s.id)}>
            <span>{s.emoji}</span>
            {s.label}
          </Chip>
        ))}
      </div>
    </div>
  )
}

// ─── Step: Support ────────────────────────────────────────────────────────────

function StepSupport({ data, onChange }: { data: LifeMatchData; onChange: (d: Partial<LifeMatchData>) => void }) {
  const toggle = (id: string) => {
    const has = data.supportAreas.includes(id)
    onChange({ supportAreas: has ? data.supportAreas.filter(a => a !== id) : [...data.supportAreas, id] })
  }

  return (
    <div>
      <StepHeading
        emoji="🌱"
        title="What areas do you want support in?"
        subtitle="This helps us match you with the right coaches, therapists, and mentors — people who specialize in exactly what you're working on."
      />
      <div className="flex flex-wrap gap-2">
        {SUPPORT_AREAS.map(area => (
          <Chip key={area} selected={data.supportAreas.includes(area)} onClick={() => toggle(area)}>
            {area}
          </Chip>
        ))}
      </div>
    </div>
  )
}

// ─── Done screen ──────────────────────────────────────────────────────────────

function DoneScreen({ data, onChange }: { data: LifeMatchData; onChange: (d: Partial<LifeMatchData>) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-lg mx-auto"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-thrive-pink to-violet-500 mx-auto mb-5 flex items-center justify-center shadow-thrive">
        <Check className="w-10 h-10 text-white" />
      </div>

      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Your profile is saved! 🎉</h2>
      <p className="text-gray-500 leading-relaxed mb-8">
        We've stored everything. Life Match will use your answers to find people who genuinely align with you — personally and professionally.
      </p>

      {/* Coming soon notice */}
      <div className="bg-gradient-to-br from-thrive-purple-soft to-thrive-pink-soft border border-thrive-purple/20 rounded-3xl p-6 mb-6 text-left">
        <div className="flex items-start gap-3">
          <span className="text-2xl">✨</span>
          <div>
            <p className="font-bold text-gray-900 mb-1">Matchmaking is coming soon</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Very soon you'll be able to see your actual matches right here — people our AI has found that align with your values, goals, and vibe. We'll notify you the moment it's live.
            </p>
          </div>
        </div>
      </div>

      {/* Notification opt-in */}
      <div className="border border-gray-200 rounded-2xl p-5 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-1">Want us to start looking now?</p>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Our AI will be on the lookout for matches based on your profile. We'll notify you when we have someone for you to connect with.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onChange({ wantNotifications: true })}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
              data.wantNotifications
                ? 'border-violet-500 bg-violet-50 text-violet-700'
                : 'border-gray-200 text-gray-700 hover:border-violet-300'
            )}
          >
            {data.wantNotifications ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            {data.wantNotifications ? 'Yes, notify me!' : 'Yes, start looking'}
          </button>
          <button
            onClick={() => onChange({ wantNotifications: false })}
            className={cn(
              'flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all',
              !data.wantNotifications
                ? 'border-gray-400 bg-gray-50 text-gray-600'
                : 'border-gray-200 text-gray-400 hover:border-gray-300'
            )}
          >
            Not yet
          </button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">What you're looking for</p>
        <div className="flex flex-wrap gap-2">
          {data.goals.map(g => {
            const meta = MATCH_GOALS.find(m => m.id === g)
            return meta ? (
              <span key={g} className="flex items-center gap-1.5 text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full">
                {meta.emoji} {meta.label}
              </span>
            ) : null
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const emptyData: LifeMatchData = {
  goals: [],
  coreValues: [],
  customValues: '',
  personalityTraits: [],
  socialStyle: '',
  ageRange: '',
  relationshipStatus: '',
  industries: [],
  collaborationStyle: '',
  lookingForInCollab: [],
  supportAreas: [],
  wantNotifications: true,
  completedAt: '',
}

export default function LifeMatchPage() {
  const [screen, setScreen] = useState<'intro' | 'questionnaire' | 'done'>('intro')
  const [data, setData] = useState<LifeMatchData>(emptyData)
  const [stepIndex, setStepIndex] = useState(0)

  const steps = getSteps(data.goals)
  // While still on 'goals' step, build with full step count for progress bar purposes
  const allSteps = getSteps(data.goals)

  const currentStep = allSteps[stepIndex]
  const isLast = stepIndex === allSteps.length - 1

  const update = (updates: Partial<LifeMatchData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const canAdvance = () => {
    if (currentStep === 'goals') return data.goals.length > 0
    if (currentStep === 'values') return data.coreValues.length > 0
    return true
  }

  const handleNext = () => {
    if (currentStep === 'done') {
      // save and mark complete
      const finalData = { ...data, completedAt: new Date().toISOString() }
      setData(finalData)
      try { localStorage.setItem('thriveos_lifematch', JSON.stringify(finalData)) } catch {}
      setScreen('done')
      return
    }
    setStepIndex(i => i + 1)
  }

  const handleBack = () => {
    if (stepIndex === 0) { setScreen('intro'); return }
    setStepIndex(i => i - 1)
  }

  if (screen === 'done') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Life Match" subtitle="Your matchmaking profile" />
        <main className="flex-1 p-8 flex items-center justify-center">
          <DoneScreen data={data} onChange={update} />
        </main>
      </div>
    )
  }

  if (screen === 'intro') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Life Match" subtitle="AI-powered people matching" />
        <main className="flex-1 p-8">
          <IntroScreen onStart={() => { setScreen('questionnaire'); setStepIndex(0) }} />
        </main>
      </div>
    )
  }

  // Questionnaire
  const stepLabels: Record<string, string> = {
    goals: 'What I\'m looking for',
    values: 'My core values',
    personality: 'My personality',
    personal: 'My social style',
    professional: 'My professional world',
    support: 'Support I want',
    done: 'Done',
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Life Match" subtitle="AI-powered people matching" />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">

          {/* Progress */}
          <StepProgress current={stepIndex} total={allSteps.length} />

          {/* Step label */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Step {stepIndex + 1} of {allSteps.length} · {stepLabels[currentStep] ?? ''}
            </span>
            <span className="text-xs text-violet-500 font-medium bg-violet-50 px-2.5 py-1 rounded-full">
              ✨ This helps our AI find your perfect matches
            </span>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 'goals' && <StepGoals data={data} onChange={update} />}
              {currentStep === 'values' && <StepValues data={data} onChange={update} />}
              {currentStep === 'personality' && <StepPersonality data={data} onChange={update} />}
              {currentStep === 'personal' && <StepPersonal data={data} onChange={update} />}
              {currentStep === 'professional' && <StepProfessional data={data} onChange={update} />}
              {currentStep === 'support' && <StepSupport data={data} onChange={update} />}
              {currentStep === 'done' && <DoneScreen data={data} onChange={update} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <Button variant="ghost" onClick={handleBack} className="gap-2 text-gray-500">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canAdvance()}
              className={cn(
                'gap-2 px-6',
                currentStep === 'done'
                  ? 'bg-gradient-to-r from-thrive-pink to-violet-500 text-white hover:opacity-90'
                  : 'bg-gradient-to-r from-violet-500 to-purple-700 text-white hover:opacity-90'
              )}
            >
              {currentStep === 'done' ? (
                <><Check className="w-4 h-4" />Save & Finish</>
              ) : (
                <>Continue <ChevronRight className="w-4 h-4" /></>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
