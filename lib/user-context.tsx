'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface UserData {
  name: string
  dreamLife: string
  excitements: string[]
  perfectYear: string
  currentSituation: string[]
  messy: string[]
  dailyHelpWish: string[]
  lifeGoals: string[]
  bizGoals: string[]
  currentProjects: string
  notWantedLife: string
  workStyle: string
  productiveTime: string
  aiPreference: string
  workEnjoyments: string[]
  aiPersonality: string
  linkedin: string
  website: string
  instagram: string
  onboardingComplete: boolean
}

const defaultUser: UserData = {
  name: '',
  dreamLife: '',
  excitements: [],
  perfectYear: '',
  currentSituation: [],
  messy: [],
  dailyHelpWish: [],
  lifeGoals: ['', '', ''],
  bizGoals: ['', '', ''],
  currentProjects: '',
  notWantedLife: '',
  workStyle: '',
  productiveTime: '',
  aiPreference: '',
  workEnjoyments: [],
  aiPersonality: '',
  linkedin: '',
  website: '',
  instagram: '',
  onboardingComplete: false,
}

interface UserContextType {
  user: UserData
  updateUser: (updates: Partial<UserData>) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
}

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  updateUser: () => {},
  completeOnboarding: () => {},
  resetOnboarding: () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(defaultUser)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('thriveos_user')
      if (stored) {
        setUser({ ...defaultUser, ...JSON.parse(stored) })
      }
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('thriveos_user', JSON.stringify(user))
    }
  }, [user, loaded])

  const updateUser = (updates: Partial<UserData>) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const completeOnboarding = () => {
    setUser(prev => ({ ...prev, onboardingComplete: true }))
  }

  const resetOnboarding = () => {
    setUser(defaultUser)
    localStorage.removeItem('thriveos_user')
  }

  if (!loaded) return null

  return (
    <UserContext.Provider value={{ user, updateUser, completeOnboarding, resetOnboarding }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
