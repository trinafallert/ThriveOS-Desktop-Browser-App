'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type BusinessType =
  | 'personal-brand'
  | 'company'
  | 'author'
  | 'music'
  | 'creator'
  | 'podcast'
  | 'other'

export type WidgetType =
  | 'tasks'
  | 'revenue'
  | 'projects'
  | 'goals'
  | 'notes'
  | 'analytics'
  | 'calendar'

export interface Widget {
  id: string
  type: WidgetType
  order: number
}

export interface Business {
  id: string
  name: string
  type: BusinessType
  description: string
  gradient: string
  emoji: string
  order: number
  linkedIds: string[]
  widgets: Widget[]
  createdAt: string
}

export const BUSINESS_GRADIENTS: Record<string, string> = {
  violet: 'from-violet-500 to-purple-700',
  blue: 'from-blue-500 to-indigo-600',
  pink: 'from-pink-400 to-rose-600',
  teal: 'from-teal-400 to-emerald-600',
  orange: 'from-orange-400 to-red-500',
  gold: 'from-yellow-400 to-amber-600',
  sky: 'from-sky-400 to-cyan-600',
  slate: 'from-slate-500 to-gray-700',
}

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  'personal-brand': 'Personal Brand',
  'company': 'Company',
  'author': 'Author',
  'music': 'Music',
  'creator': 'Creator',
  'podcast': 'Podcast',
  'other': 'Business',
}

function makeDefaultWidgets(): Widget[] {
  return [
    { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-tasks`, type: 'tasks', order: 0 },
    { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-projects`, type: 'projects', order: 1 },
    { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-goals`, type: 'goals', order: 2 },
    { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-revenue`, type: 'revenue', order: 3 },
  ]
}

interface BusinessesContextType {
  businesses: Business[]
  addBusiness: (b: Pick<Business, 'name' | 'type' | 'description' | 'gradient' | 'emoji'>) => Business
  updateBusiness: (id: string, updates: Partial<Business>) => void
  deleteBusiness: (id: string) => void
  reorderBusinesses: (ordered: Business[]) => void
  updateWidgets: (businessId: string, widgets: Widget[]) => void
  linkBusinesses: (id1: string, id2: string) => void
  unlinkBusinesses: (id1: string, id2: string) => void
}

const BusinessesContext = createContext<BusinessesContextType>({
  businesses: [],
  addBusiness: () => ({ id: '', name: '', type: 'other', description: '', gradient: 'violet', emoji: '💼', order: 0, linkedIds: [], widgets: [], createdAt: '' }),
  updateBusiness: () => {},
  deleteBusiness: () => {},
  reorderBusinesses: () => {},
  updateWidgets: () => {},
  linkBusinesses: () => {},
  unlinkBusinesses: () => {},
})

const STORAGE_KEY = 'thriveos_businesses'

export function BusinessesProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setBusinesses(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(businesses))
  }, [businesses, loaded])

  const addBusiness = (b: Pick<Business, 'name' | 'type' | 'description' | 'gradient' | 'emoji'>) => {
    const newBiz: Business = {
      ...b,
      id: `${Date.now()}`,
      order: businesses.length,
      linkedIds: [],
      widgets: makeDefaultWidgets(),
      createdAt: new Date().toISOString(),
    }
    setBusinesses(prev => [...prev, newBiz])
    return newBiz
  }

  const updateBusiness = (id: string, updates: Partial<Business>) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const deleteBusiness = (id: string) => {
    setBusinesses(prev =>
      prev.filter(b => b.id !== id)
        .map((b, i) => ({ ...b, order: i, linkedIds: b.linkedIds.filter(lid => lid !== id) }))
    )
  }

  const reorderBusinesses = (ordered: Business[]) => {
    setBusinesses(ordered.map((b, i) => ({ ...b, order: i })))
  }

  const updateWidgets = (businessId: string, widgets: Widget[]) => {
    setBusinesses(prev => prev.map(b => b.id === businessId ? { ...b, widgets } : b))
  }

  const linkBusinesses = (id1: string, id2: string) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === id1 && !b.linkedIds.includes(id2)) return { ...b, linkedIds: [...b.linkedIds, id2] }
      if (b.id === id2 && !b.linkedIds.includes(id1)) return { ...b, linkedIds: [...b.linkedIds, id1] }
      return b
    }))
  }

  const unlinkBusinesses = (id1: string, id2: string) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === id1) return { ...b, linkedIds: b.linkedIds.filter(id => id !== id2) }
      if (b.id === id2) return { ...b, linkedIds: b.linkedIds.filter(id => id !== id1) }
      return b
    }))
  }

  if (!loaded) return null

  return (
    <BusinessesContext.Provider value={{
      businesses,
      addBusiness,
      updateBusiness,
      deleteBusiness,
      reorderBusinesses,
      updateWidgets,
      linkBusinesses,
      unlinkBusinesses,
    }}>
      {children}
    </BusinessesContext.Provider>
  )
}

export function useBusinesses() {
  return useContext(BusinessesContext)
}

export function useBusiness(id: string) {
  const { businesses } = useBusinesses()
  return businesses.find(b => b.id === id) ?? null
}
