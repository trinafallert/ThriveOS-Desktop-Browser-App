'use client'

import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Target, Plus, CheckCircle2, Calendar, TrendingUp, Flame, Star } from 'lucide-react'

const goals = [
  {
    id: 1,
    title: 'Hit $50K MRR',
    description: 'Scale the business to $50K monthly recurring revenue',
    category: 'Business',
    progress: 76,
    due: 'Dec 31, 2025',
    milestones: [
      { text: 'Reach $30K MRR', done: true },
      { text: 'Hire 2nd sales rep', done: true },
      { text: 'Launch enterprise tier', done: false },
      { text: 'Close 5 enterprise deals', done: false },
    ],
    color: 'blue' as const,
    icon: '💼',
  },
  {
    id: 2,
    title: 'Run a half marathon',
    description: 'Complete my first 21K race by October',
    category: 'Health',
    progress: 52,
    due: 'Oct 15, 2025',
    milestones: [
      { text: 'Run 5K without stopping', done: true },
      { text: 'Complete a 10K race', done: true },
      { text: 'Run 3x/week for 8 weeks', done: false },
      { text: 'Complete half marathon', done: false },
    ],
    color: 'pink' as const,
    icon: '🏃',
  },
  {
    id: 3,
    title: 'Read 24 books this year',
    description: '2 books per month across different genres',
    category: 'Learning',
    progress: 37,
    due: 'Dec 31, 2025',
    milestones: [
      { text: 'Read 6 books (Q1)', done: true },
      { text: 'Read 12 books (Q2)', done: false },
      { text: 'Read 18 books (Q3)', done: false },
      { text: 'Read 24 books (Q4)', done: false },
    ],
    color: 'purple' as const,
    icon: '📚',
  },
  {
    id: 4,
    title: 'Launch podcast',
    description: 'Record and publish first 10 podcast episodes',
    category: 'Creative',
    progress: 20,
    due: 'Jun 30, 2025',
    milestones: [
      { text: 'Setup recording equipment', done: true },
      { text: 'Record pilot episode', done: false },
      { text: 'Publish to Spotify & Apple', done: false },
      { text: 'Reach 10 episodes', done: false },
    ],
    color: 'teal' as const,
    icon: '🎙️',
  },
]

const colorVariant = {
  blue: { badge: 'blue' as const, progress: 'blue' as const, ring: 'ring-thrive-blue/20' },
  pink: { badge: 'pink' as const, progress: 'pink' as const, ring: 'ring-thrive-pink/20' },
  purple: { badge: 'purple' as const, progress: 'purple' as const, ring: 'ring-thrive-purple/20' },
  teal: { badge: 'teal' as const, progress: 'teal' as const, ring: 'ring-thrive-teal/20' },
}

export default function GoalsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Goals" subtitle="Set, track, and achieve your biggest goals" />
      <main className="flex-1 p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Active goals', value: '4', icon: Target, color: 'text-thrive-purple', bg: 'bg-thrive-purple-soft' },
            { label: 'Milestones hit', value: '6', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Avg progress', value: '46%', icon: TrendingUp, color: 'text-thrive-blue', bg: 'bg-thrive-blue-soft' },
            { label: 'Goals completed', value: '3', icon: Star, color: 'text-thrive-gold', bg: 'bg-thrive-gold-light' },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Your 2025 Goals</h2>
          <Button size="sm" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add goal
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const cv = colorVariant[goal.color]
            return (
              <Card key={goal.id} className={`ring-2 ${cv.ring}`} hover>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{goal.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">{goal.title}</CardTitle>
                      </div>
                      <p className="text-sm text-gray-500">{goal.description}</p>
                    </div>
                    <Badge variant={cv.badge} className="shrink-0">{goal.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Progress</span>
                      <span className="font-bold text-gray-900">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} color={cv.progress} className="h-2.5" />
                  </div>

                  {/* Milestones */}
                  <div className="space-y-2">
                    {goal.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          m.done ? `bg-thrive-${goal.color === 'blue' ? 'blue' : goal.color === 'pink' ? 'pink' : goal.color === 'teal' ? 'teal' : 'purple'} border-current` : 'border-gray-200'
                        }`}>
                          {m.done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className={`text-sm ${m.done ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                          {m.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Due date */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      Due {goal.due}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                      <Flame className="w-3.5 h-3.5" />
                      On track
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
