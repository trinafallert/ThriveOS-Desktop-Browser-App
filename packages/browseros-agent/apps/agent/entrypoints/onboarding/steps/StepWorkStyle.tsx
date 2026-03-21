import { type FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { onboardingProfileStorage } from '@/lib/onboarding/onboardingStorage'
import { type StepDirection, StepTransition } from './StepTransition'

interface StepWorkStyleProps {
  direction: StepDirection
  onContinue: () => void
}

const workStyles = [
  { label: 'Fast + action-focused', emoji: '⚡', desc: 'Ship first, refine later' },
  { label: 'Calm + thoughtful', emoji: '🧘', desc: 'Intentional and deliberate' },
  { label: 'Structured + organized', emoji: '📋', desc: 'Systems and checklists' },
  { label: 'Chaotic + creative', emoji: '🎨', desc: 'Vibes-based, non-linear' },
]

const aiPersonalities = [
  { id: 'Strategic CEO', emoji: '🧠', label: 'Strategic CEO', desc: 'Big picture thinking, data-driven, always 3 steps ahead.' },
  { id: 'Supportive Bestie', emoji: '💖', label: 'Supportive Bestie', desc: 'Warm, encouraging, celebrates your wins on hard days.' },
  { id: 'Fast Execution Machine', emoji: '⚡', label: 'Fast Execution Machine', desc: 'No fluff. Direct. Focuses on output.' },
  { id: 'Accountability Coach', emoji: '🎯', label: 'Accountability Coach', desc: 'Holds you to your word. Firm but fair.' },
]

const toggle = (arr: string[], item: string) =>
  arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]

export const StepWorkStyle: FC<StepWorkStyleProps> = ({ direction, onContinue }) => {
  const [workStyle, setWorkStyle] = useState('')
  const [aiPersonality, setAiPersonality] = useState('')
  const [aiPreference, setAiPreference] = useState('')
  const [workEnjoyments, setWorkEnjoyments] = useState<string[]>([])

  const handleContinue = async () => {
    const existing = await onboardingProfileStorage.getValue()
    await onboardingProfileStorage.setValue({
      ...existing,
      workStyle,
      aiPersonality,
      aiPreference,
      workEnjoyments,
    } as never)
    onContinue()
  }

  return (
    <StepTransition direction={direction}>
      <div className="flex h-full flex-col items-center justify-center overflow-y-auto py-4">
        <div className="w-full max-w-lg space-y-6">
          <div className="space-y-1 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary opacity-70">Step 3 — Your AI</span>
            <h2 className="font-bold text-3xl tracking-tight">How should your AI show up? 🤖</h2>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Your natural work style:</label>
            <div className="grid grid-cols-2 gap-2">
              {workStyles.map(s => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setWorkStyle(s.label)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    workStyle === s.label
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/40'
                  }`}
                >
                  <div className="text-lg mb-1">{s.emoji}</div>
                  <div className="text-sm font-semibold">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Pick your AI personality:</label>
            <div className="grid grid-cols-2 gap-2">
              {aiPersonalities.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAiPersonality(p.id)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    aiPersonality === p.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/40'
                  }`}
                >
                  <div className="text-lg mb-1">{p.emoji}</div>
                  <div className="text-sm font-semibold">{p.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">How do you prefer your AI to help?</label>
            <div className="flex flex-wrap gap-2">
              {['Send me reminders', 'Make smart suggestions', 'Full automation please', 'Just show me the data'].map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAiPreference(item)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    aiPreference === item
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">What parts of work do you enjoy?</label>
            <div className="flex flex-wrap gap-2">
              {['Envisioning & strategy', 'Building & creating', 'Managing teams', 'Selling & pitching',
                'Writing & content', 'Numbers & analytics', 'Design & aesthetics', 'Problem solving',
                'Coaching & teaching', 'Networking'].map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setWorkEnjoyments(toggle(workEnjoyments, item))}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    workEnjoyments.includes(item)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleContinue} className="w-full">
            Continue
          </Button>
        </div>
      </div>
    </StepTransition>
  )
}
