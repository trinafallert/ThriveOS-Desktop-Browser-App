'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Flame, CheckCircle2, Plus, Trophy, Zap, Target, Calendar } from 'lucide-react'

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const weekData = [true, true, true, false, true, true, false]

const initialHabits = [
  {
    id: 1, name: 'Morning workout', icon: '🏋️', streak: 12, target: 5, unit: 'days/week',
    done: true, history: [true, true, true, false, true, true, false],
    category: 'Health', color: 'pink',
  },
  {
    id: 2, name: 'Read 30 minutes', icon: '📚', streak: 7, target: 7, unit: 'days/week',
    done: true, history: [true, false, true, true, true, true, false],
    category: 'Mind', color: 'purple',
  },
  {
    id: 3, name: 'Meditate', icon: '🧘', streak: 4, target: 7, unit: 'days/week',
    done: false, history: [true, true, false, false, true, false, false],
    category: 'Mind', color: 'blue',
  },
  {
    id: 4, name: 'Drink 2L water', icon: '💧', streak: 19, target: 7, unit: 'days/week',
    done: true, history: [true, true, true, true, true, true, false],
    category: 'Health', color: 'teal',
  },
  {
    id: 5, name: 'Journal entry', icon: '📝', streak: 3, target: 7, unit: 'days/week',
    done: false, history: [false, true, true, false, true, false, false],
    category: 'Mind', color: 'purple',
  },
  {
    id: 6, name: 'No phone after 9pm', icon: '📵', streak: 2, target: 7, unit: 'days/week',
    done: false, history: [true, false, false, true, false, true, false],
    category: 'Lifestyle', color: 'gold',
  },
]

type ColorKey = 'pink' | 'purple' | 'blue' | 'teal' | 'gold'

const colorMap: Record<ColorKey, string> = {
  pink: 'text-thrive-pink bg-thrive-pink-soft border-thrive-pink/20',
  purple: 'text-thrive-purple bg-thrive-purple-soft border-thrive-purple/20',
  blue: 'text-thrive-blue bg-thrive-blue-soft border-thrive-blue/20',
  teal: 'text-thrive-teal bg-thrive-teal-light border-thrive-teal/20',
  gold: 'text-thrive-gold bg-thrive-gold-light border-thrive-gold/20',
}

export default function HabitsPage() {
  const [habits, setHabits] = useState(initialHabits)

  const toggle = (id: number) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h))
  }

  const doneToday = habits.filter(h => h.done).length
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Habits" subtitle="Build powerful habits that stick" />
      <main className="flex-1 p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Today's score", value: `${doneToday}/${habits.length}`, icon: Target, color: 'text-thrive-pink', bg: 'bg-thrive-pink-soft' },
            { label: 'Total streak days', value: totalStreak, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Best streak', value: '19 days', icon: Trophy, color: 'text-thrive-gold', bg: 'bg-thrive-gold-light' },
            { label: 'Completion rate', value: '74%', icon: Zap, color: 'text-thrive-purple', bg: 'bg-thrive-purple-soft' },
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Habits list */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Today&apos;s Habits</CardTitle>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Add habit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {habits.map((habit) => {
                    const color = colorMap[habit.color as ColorKey] || colorMap.purple
                    return (
                      <div
                        key={habit.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                          habit.done
                            ? `${color} opacity-80`
                            : 'bg-white border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-2xl">{habit.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-semibold ${habit.done ? '' : 'text-gray-800'}`}>
                              {habit.name}
                            </span>
                            <Badge variant="secondary" className="text-[10px]">{habit.category}</Badge>
                          </div>
                          {/* Week history */}
                          <div className="flex items-center gap-1">
                            {days.map((day, i) => (
                              <div key={i} className="flex flex-col items-center gap-0.5">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  habit.history[i]
                                    ? 'bg-current opacity-80'
                                    : 'bg-gray-100'
                                }`}>
                                  {habit.history[i] && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <span className="text-[9px] text-gray-400">{day}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 text-orange-500">
                            <Flame className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{habit.streak}</span>
                          </div>
                          <button
                            onClick={() => toggle(habit.id)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                              habit.done
                                ? 'bg-thrive-pink border-thrive-pink'
                                : 'border-gray-300 hover:border-thrive-pink'
                            }`}
                          >
                            {habit.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Completion rate */}
            <Card>
              <CardHeader>
                <CardTitle>This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  {days.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                        weekData[i]
                          ? 'bg-thrive-pink text-white'
                          : i === 6
                          ? 'bg-gray-100 text-gray-500 border-2 border-dashed border-gray-300'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {weekData[i] ? '✓' : day}
                      </div>
                      <span className="text-[10px] text-gray-400">{day}</span>
                    </div>
                  ))}
                </div>
                <Progress value={Math.round((weekData.filter(Boolean).length / 7) * 100)} color="pink" className="h-2" />
                <p className="text-xs text-gray-500 mt-2">{weekData.filter(Boolean).length}/7 days with all habits complete</p>
              </CardContent>
            </Card>

            {/* Longest streaks */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-thrive-gold" />
                  <CardTitle>Longest Streaks</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...habits].sort((a, b) => b.streak - a.streak).slice(0, 4).map((h, i) => (
                    <div key={h.id} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-gray-100 text-gray-600' :
                        i === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-base">{h.icon}</span>
                      <span className="flex-1 text-sm text-gray-700">{h.name}</span>
                      <div className="flex items-center gap-1 text-orange-500">
                        <Flame className="w-3.5 h-3.5" />
                        <span className="text-sm font-bold">{h.streak}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly calendar preview */}
            <Card className="bg-gradient-to-br from-thrive-pink-soft to-thrive-purple-soft border-thrive-pink/10">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-thrive-pink" />
                  <span className="text-sm font-semibold text-gray-700">March Progress</span>
                </div>
                <div className="text-4xl font-extrabold text-thrive-pink mb-1">74%</div>
                <p className="text-sm text-gray-500">Habit completion this month</p>
                <Progress value={74} color="pink" className="mt-3" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
