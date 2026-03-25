'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Smile, TrendingUp, Calendar, Sparkles } from 'lucide-react'

const moods = [
  { emoji: '😄', label: 'Amazing', value: 5, color: 'bg-green-100 border-green-300 text-green-800' },
  { emoji: '😊', label: 'Good', value: 4, color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { emoji: '😐', label: 'Okay', value: 3, color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { emoji: '😔', label: 'Rough', value: 2, color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { emoji: '😞', label: 'Bad', value: 1, color: 'bg-red-100 border-red-300 text-red-800' },
]

const weekHistory = [
  { day: 'Mon', mood: 4, emoji: '😊' },
  { day: 'Tue', mood: 5, emoji: '😄' },
  { day: 'Wed', mood: 3, emoji: '😐' },
  { day: 'Thu', mood: 4, emoji: '😊' },
  { day: 'Fri', mood: 5, emoji: '😄' },
  { day: 'Sat', mood: 4, emoji: '😊' },
  { day: 'Sun', mood: null, emoji: '?' },
]

const factors = [
  { label: 'Sleep quality', emoji: '😴', rating: 4 },
  { label: 'Energy level', emoji: '⚡', rating: 4 },
  { label: 'Stress level', emoji: '😰', rating: 2 },
  { label: 'Social connection', emoji: '👥', rating: 3 },
  { label: 'Productivity', emoji: '🎯', rating: 5 },
]

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [logged, setLogged] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Mood Tracker" subtitle="Track your emotional wellbeing over time" />
      <main className="flex-1 p-8 space-y-6">

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Log today's mood */}
          <div className="lg:col-span-2 space-y-4">
            {!logged ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-thrive-pink" />
                    <CardTitle>How are you feeling today?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 justify-center mb-8">
                    {moods.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          selectedMood === mood.value
                            ? mood.color + ' scale-110 shadow-lg'
                            : 'border-gray-100 hover:border-gray-200 hover:scale-105'
                        }`}
                      >
                        <span className="text-4xl">{mood.emoji}</span>
                        <span className="text-xs font-semibold text-gray-600">{mood.label}</span>
                      </button>
                    ))}
                  </div>

                  {selectedMood && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">What factors influenced your mood?</p>
                        <div className="flex flex-wrap gap-2">
                          {['Got enough sleep', 'Exercised', 'Ate well', 'Connected with friends', 'Productive work day', 'Stressful meeting', 'Personal time', 'Achieved a goal'].map(f => (
                            <button key={f} className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 bg-gray-50 hover:border-thrive-purple/40 hover:bg-thrive-purple-soft hover:text-thrive-purple transition-all">
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        placeholder="Add a note about your day (optional)..."
                        className="w-full p-3 text-sm rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-thrive-purple/20 focus:border-thrive-purple/30 resize-none"
                        rows={3}
                      />
                      <Button className="w-full" onClick={() => setLogged(true)}>
                        Log mood
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-green-50 to-thrive-teal-light border-green-100">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-3">😊</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Mood logged!</h3>
                  <p className="text-sm text-gray-500 mb-4">Great job checking in with yourself today.</p>
                  <Button variant="outline" size="sm" onClick={() => setLogged(false)}>Update</Button>
                </CardContent>
              </Card>
            )}

            {/* Week history */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-thrive-purple" />
                  <CardTitle>This Week</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {weekHistory.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                          d.mood === null
                            ? 'bg-gray-100 text-gray-400 text-sm'
                            : d.mood >= 4
                            ? 'bg-green-100'
                            : d.mood === 3
                            ? 'bg-yellow-100'
                            : 'bg-red-100'
                        }`}
                      >
                        {d.mood === null ? '?' : d.emoji}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{d.day}</span>
                      {d.mood && (
                        <div
                          className="w-1 rounded-full bg-current"
                          style={{
                            height: `${d.mood * 8}px`,
                            color: d.mood >= 4 ? '#22c55e' : d.mood === 3 ? '#eab308' : '#ef4444',
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wellbeing factors */}
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Wellbeing Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {factors.map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      <span className="text-xl w-8">{f.emoji}</span>
                      <span className="text-sm text-gray-700 flex-1">{f.label}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <div
                            key={v}
                            className={`w-6 h-6 rounded-full ${
                              v <= f.rating
                                ? 'bg-thrive-pink'
                                : 'bg-gray-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Mood stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-thrive-teal" />
                  <CardTitle>Monthly Average</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-6xl mb-2">😊</div>
                  <div className="text-3xl font-extrabold text-gray-900 mb-1">4.1/5</div>
                  <Badge variant="green">Above average</Badge>
                  <p className="text-sm text-gray-500 mt-3">Your mood has been great this month. Keep it up!</p>
                </div>
              </CardContent>
            </Card>

            {/* Patterns */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-thrive-purple" />
                  <span className="text-sm font-semibold text-thrive-purple">AI Pattern</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your mood is <strong>highest on Tuesdays and Fridays</strong> — both days when you exercise. Consider adding a workout on Wednesdays too.
                </p>
              </CardContent>
            </Card>

            {/* Streak */}
            <Card className="bg-gradient-to-br from-thrive-pink-soft to-thrive-purple-soft border-thrive-pink/10">
              <CardContent className="p-5 text-center">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-4xl font-extrabold text-thrive-pink mb-1">6</div>
                <p className="text-sm text-gray-600">day check-in streak</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
