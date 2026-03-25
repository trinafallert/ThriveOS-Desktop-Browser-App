'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/user-context'

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user.onboardingComplete) {
      router.replace('/onboarding')
    }
  }, [user.onboardingComplete, router])

  if (!user.onboardingComplete) return null

  return <>{children}</>
}
