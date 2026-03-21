import { type FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { onboardingProfileStorage } from '@/lib/onboarding/onboardingStorage'
import { type StepDirection, StepTransition } from './StepTransition'

interface StepGoalsProps {
  direction: StepDirection
  onContinue: () => void
}

export const StepGoals: FC<StepGoalsProps> = ({ direction, onContinue }) => {
  const [lifeGoals, setLifeGoals] = useState(['', '', ''])
  const [bizGoals, setBizGoals] = useState(['', '', ''])
  const [currentProjects, setCurrentProjects] = useState('')
  const [notWantedLife, setNotWantedLife] = useState('')

  const handleContinue = async () => {
    const existing = await onboardingProfileStorage.getValue()
    await onboardingProfileStorage.setValue({
      ...existing,
      lifeGoals: lifeGoals.filter(Boolean),
      bizGoals: bizGoals.filter(Boolean),
      currentProjects,
      notWantedLife,
    } as never)
    onContinue()
  }

  return (
    <StepTransition direction={direction}>
      <div className="flex h-full flex-col items-center justify-center">
        <div className="w-full max-w-lg space-y-5">
          <div className="space-y-1 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary opacity-70">Step 2 — Goals</span>
            <h2 className="font-bold text-3xl tracking-tight">Let&apos;s map your direction 🎯</h2>
            <p className="text-muted-foreground text-sm">
              Dream big — you have an expert AI team coming.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Top 3 Life Goals</label>
            {[0, 1, 2].map(i => (
              <Input
                key={i}
                placeholder={`Life goal ${i + 1}...`}
                value={lifeGoals[i]}
                onChange={e => {
                  const g = [...lifeGoals]; g[i] = e.target.value; setLifeGoals(g)
                }}
              />
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Top 3 Business / Money Goals</label>
            {[0, 1, 2].map(i => (
              <Input
                key={i}
                placeholder={`Business goal ${i + 1}...`}
                value={bizGoals[i]}
                onChange={e => {
                  const g = [...bizGoals]; g[i] = e.target.value; setBizGoals(g)
                }}
              />
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Any current projects or ideas?</label>
            <Textarea
              placeholder="Starting a podcast, building a Shopify store..."
              rows={2}
              value={currentProjects}
              onChange={e => setCurrentProjects(e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 space-y-2">
            <label className="text-sm font-semibold">
              💎 What kind of life do you NOT want?
            </label>
            <Textarea
              placeholder="I never want to be stuck at a desk doing work I hate..."
              rows={2}
              value={notWantedLife}
              onChange={e => setNotWantedLife(e.target.value)}
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
