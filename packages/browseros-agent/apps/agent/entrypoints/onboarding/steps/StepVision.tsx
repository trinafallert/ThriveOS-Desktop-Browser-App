import { type FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { onboardingProfileStorage } from '@/lib/onboarding/onboardingStorage'
import { type StepDirection, StepTransition } from './StepTransition'

interface StepVisionProps {
  direction: StepDirection
  onContinue: () => void
}

const visions = [
  'Building a business', 'Traveling more', 'Creative projects', 'Financial freedom',
  'Health & fitness', 'Deep relationships', 'Learning new skills', 'Making an impact',
  'Passive income', 'Starting fresh', 'Scaling up', 'Personal growth',
]

export const StepVision: FC<StepVisionProps> = ({ direction, onContinue }) => {
  const [dreamLife, setDreamLife] = useState('')
  const [perfectYear, setPerfectYear] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (item: string) =>
    setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])

  const handleContinue = async () => {
    const existing = await onboardingProfileStorage.getValue()
    await onboardingProfileStorage.setValue({
      ...existing,
      dreamLife,
      perfectYear,
      excitements: selected,
    } as never)
    onContinue()
  }

  return (
    <StepTransition direction={direction}>
      <div className="flex h-full flex-col items-center justify-center">
        <div className="w-full max-w-lg space-y-6">
          <div className="space-y-1 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary opacity-70">Step 1 — Vision</span>
            <h2 className="font-bold text-3xl tracking-tight">Let&apos;s design your dream life ✨</h2>
            <p className="text-muted-foreground text-sm">
              We&apos;ll use this to personalize your ThriveOS experience.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              If you had unlimited time, money, and freedom — what would your life look like?
            </label>
            <Textarea
              placeholder="I'd be living between NYC and Bali, running a creative agency..."
              rows={3}
              value={dreamLife}
              onChange={e => setDreamLife(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">What excites you most right now?</label>
            <div className="flex flex-wrap gap-2">
              {visions.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(item)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    selected.includes(item)
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
            <label className="text-sm font-semibold">
              If everything worked out perfectly this year, what would your life look like?
            </label>
            <Textarea
              placeholder="I'd have hit $10K/month, moved to a new city, launched my course..."
              rows={3}
              value={perfectYear}
              onChange={e => setPerfectYear(e.target.value)}
            />
          </div>

          <Button onClick={handleContinue} className="w-full">
            Continue
          </Button>
        </div>
      </div>
    </StepTransition>
  )
}
