'use client'

import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Heart,
  Zap,
  Target,
  Smile,
  BookOpen,
  Dumbbell,
  ArrowUpRight,
  Flame,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/lib/user-context'

const sections = [
  { label: 'Habits', href: '/dashboard/lifebud/habits', icon: Zap, desc: 'Build daily rituals', color: 'text-thrive-purple', bg: 'bg-thrive-purple-soft' },
  { label: 'Goals', href: '/dashboard/lifebud/goals', icon: Target, desc: 'Track life milestones', color: 'text-thrive-pink', bg: 'bg-thrive-pink-soft' },
  { label: 'Mood', href: '/dashboard/lifebud/mood', icon: Smile, desc: 'Check in with yourself', color: 'text-thrive-teal', bg: 'bg-thrive-teal-light' },
  { label: 'Journal', href: '/dashboard/lifebud/journal', icon: BookOpen, desc: 'Reflect & grow', color: 'text-thrive-blue', bg: 'bg-thrive-blue-soft' },
  { label: 'Fitness', href: '/dashboard/lifebud/fitness', icon: Dumbbell, desc: 'Move your body', color: 'text-thrive-gold', bg: 'bg-thrive-gold-light' },
  { label: 'Life Match ✨', href: '/dashboard/lifebud/life-match', icon: Users, desc: 'AI-matched connections', color: 'text-thrive-purple', bg: 'bg-gradient-to-br from-thrive-pink-soft to-thrive-purple-soft' },
]

const habits = [
  { name: 'Morning workout', streak: 12, done: true, icon: '🏋️' },
  { name: 'Read 30 min', streak: 7, done: true, icon: '📚' },
  { name: 'Meditate', streak: 4, done: false, icon: '🧘' },
  { name: 'Drink 2L water', streak: 19, done: true, icon: '💧' },
  { name: 'No screens before bed', streak: 2, done: false, icon: '📵' },
]

export default function LifebudOverviewPage() {
  const { user } = useUser()

  const lifeGoals = user.lifeGoals?.filter(g => g.trim()) ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <Header subtitle="Your life, beautifully organized" />
      <main className="flex-1 p-8 space-y-8">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Habits today', value: '3/5', color: 'text-thrive-purple', bg: 'bg-thrive-purple-soft', icon: Zap },
            { label: 'Active goals', value: '4', color: 'text-thrive-pink', bg: 'bg-thrive-pink-soft', icon: Target },
            { label: 'Day streak', value: '12', color: 'text-thrive-teal', bg: 'bg-thrive-teal-light', icon: Flame },
            { label: "Today's mood", value: '😊', color: 'text-thrive-gold', bg: 'bg-thrive-gold-light', icon: Smile },
          ].map(stat => (
            <Card key={stat.label} hover>
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  {'value' in stat && stat.value === '😊'
                    ? <span className="text-xl">{stat.value}</span>
                    : <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  }
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">
                  {stat.value === '😊' ? '—' : stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Goals + Habits */}
          <div className="lg:col-span-2 space-y-6">

            {/* Life Goals */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-thrive-pink" />
                    <CardTitle className="text-base">Your Life Goals</CardTitle>
                  </div>
                  <Link href="/dashboard/lifebud/goals">
                    <Badge variant="pink" className="text-xs cursor-pointer hover:opacity-80">View all</Badge>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {lifeGoals.length > 0 ? (
                  lifeGoals.map((goal, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-thrive-pink-soft border border-thrive-pink/10">
                      <div className="w-6 h-6 rounded-full bg-thrive-pink/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-thrive-pink">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{goal}</p>
                        <Progress value={Math.floor(Math.random() * 60) + 10} color="pink" className="h-1.5 mt-2" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No goals yet — add them in Goals</p>
                    <Link href="/dashboard/lifebud/goals" className="text-thrive-purple text-xs mt-1 hover:underline">
                      Set your first goal →
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Habits */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-thrive-purple" />
                    <CardTitle className="text-base">Today&apos;s Habits</CardTitle>
                  </div>
                  <Link href="/dashboard/lifebud/habits">
                    <Badge variant="purple" className="text-xs cursor-pointer hover:opacity-80">View all</Badge>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {habits.map((habit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-base">{habit.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{habit.name}</span>
                        <div className="flex items-center gap-1 text-xs text-orange-500">
                          <Flame className="w-3 h-3" />
                          {habit.streak}
                        </div>
                      </div>
                      <Progress value={habit.done ? 100 : 0} color={habit.done ? 'pink' : 'purple'} className="h-1.5" />
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      habit.done ? 'bg-thrive-pink border-thrive-pink' : 'border-gray-300'
                    }`}>
                      {habit.done && <span className="text-white text-[10px]">✓</span>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: Quick Navigation */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Explore Lifebud</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map(section => (
                  <Link key={section.label} href={section.href}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className={`w-9 h-9 rounded-xl ${section.bg} flex items-center justify-center`}>
                        <section.icon className={`w-4 h-4 ${section.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">{section.label}</div>
                        <div className="text-xs text-gray-400">{section.desc}</div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-thrive-pink transition-colors" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Dream life from onboarding */}
            {user.dreamLife && (
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">✨</span>
                    <CardTitle className="text-sm">Your Dream Life</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 leading-relaxed italic">&ldquo;{user.dreamLife}&rdquo;</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
