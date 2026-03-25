import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dumbbell, Flame, Heart, TrendingUp, Target, Plus, Trophy, Zap } from 'lucide-react'

const workouts = [
  { day: 'Mon', type: 'Strength', duration: 45, calories: 320, done: true, emoji: '🏋️' },
  { day: 'Tue', type: 'Running', duration: 30, calories: 280, done: true, emoji: '🏃' },
  { day: 'Wed', type: 'Rest', duration: 0, calories: 0, done: true, emoji: '😴' },
  { day: 'Thu', type: 'Yoga', duration: 40, calories: 180, done: true, emoji: '🧘' },
  { day: 'Fri', type: 'HIIT', duration: 25, calories: 340, done: true, emoji: '⚡' },
  { day: 'Sat', type: 'Cycling', duration: 60, calories: 480, done: true, emoji: '🚴' },
  { day: 'Sun', type: 'Planned', duration: 0, calories: 0, done: false, emoji: '📅' },
]

const personalBests = [
  { exercise: 'Bench Press', value: '185 lbs', improvement: '+10 lbs this month', emoji: '🏋️' },
  { exercise: '5K Run', value: '24:30', improvement: '-1:20 this month', emoji: '🏃' },
  { exercise: 'Pull-ups', value: '14 reps', improvement: '+3 reps this month', emoji: '💪' },
  { exercise: 'Plank', value: '3:45', improvement: '+45s this month', emoji: '🧘' },
]

export default function FitnessPage() {
  const weekCalories = workouts.filter(w => w.done && w.calories > 0).reduce((s, w) => s + w.calories, 0)
  const weekMinutes = workouts.filter(w => w.done && w.duration > 0).reduce((s, w) => s + w.duration, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Fitness" subtitle="Track workouts, calories, and personal bests" />
      <main className="flex-1 p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Calories this week', value: weekCalories.toLocaleString(), icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Active minutes', value: `${weekMinutes}`, icon: Zap, color: 'text-thrive-blue', bg: 'bg-thrive-blue-soft' },
            { label: 'Workouts done', value: `${workouts.filter(w => w.done && w.type !== 'Rest').length}`, icon: Dumbbell, color: 'text-thrive-purple', bg: 'bg-thrive-purple-soft' },
            { label: 'Current streak', value: '12 days', icon: Trophy, color: 'text-thrive-gold', bg: 'bg-thrive-gold-light' },
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
          {/* This week */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-thrive-purple" />
                    <CardTitle>This Week&apos;s Workouts</CardTitle>
                  </div>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Log workout
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {workouts.map((w) => (
                    <div
                      key={w.day}
                      className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                        w.done
                          ? w.type === 'Rest'
                            ? 'bg-gray-50 border-gray-100'
                            : 'bg-thrive-purple-soft border-thrive-purple/20'
                          : 'bg-gray-50 border-dashed border-gray-200'
                      }`}
                    >
                      <span className="text-xl">{w.emoji}</span>
                      <span className="text-xs font-bold text-gray-700">{w.day}</span>
                      <span className="text-[10px] text-gray-500 text-center leading-tight">{w.type}</span>
                      {w.duration > 0 && (
                        <span className="text-[10px] font-semibold text-thrive-purple">{w.duration}m</span>
                      )}
                      {w.calories > 0 && (
                        <span className="text-[10px] text-orange-500">{w.calories} kcal</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal bests */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-thrive-gold" />
                  <CardTitle>Personal Bests</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {personalBests.map((pb) => (
                    <div key={pb.exercise} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-thrive-gold-light/50 transition-colors">
                      <span className="text-2xl">{pb.emoji}</span>
                      <div>
                        <div className="text-xs text-gray-500">{pb.exercise}</div>
                        <div className="text-lg font-extrabold text-gray-900">{pb.value}</div>
                        <div className="text-xs text-green-600 font-medium">{pb.improvement}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Body metrics */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-thrive-pink" />
                  <CardTitle>Health Metrics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Resting HR', value: '62 bpm', status: 'Excellent', color: 'green' },
                    { label: 'VO2 Max', value: '48 ml/kg', status: 'Good', color: 'blue' },
                    { label: 'Recovery', value: '87%', status: 'High', color: 'purple' },
                  ].map((m) => (
                    <div key={m.label} className="text-center p-4 rounded-2xl bg-gray-50">
                      <div className="text-xl font-bold text-gray-900 mb-0.5">{m.value}</div>
                      <div className="text-xs text-gray-500 mb-1">{m.label}</div>
                      <Badge variant={m.color === 'green' ? 'green' : m.color === 'blue' ? 'blue' : 'purple'} className="text-[10px]">
                        {m.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Monthly goals */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-thrive-teal" />
                  <CardTitle>March Goals</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Workouts', current: 18, target: 20, color: 'purple' as const },
                    { label: 'Active minutes', current: 840, target: 1200, color: 'blue' as const },
                    { label: 'Calories burned', current: 6840, target: 8000, color: 'pink' as const },
                    { label: 'Steps', current: 68400, target: 100000, color: 'teal' as const },
                  ].map((g) => (
                    <div key={g.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-700">{g.label}</span>
                        <span className="text-gray-500 text-xs">{g.current.toLocaleString()}/{g.target.toLocaleString()}</span>
                      </div>
                      <Progress value={Math.round((g.current / g.target) * 100)} color={g.color} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI insight */}
            <Card className="bg-gradient-to-br from-thrive-purple-soft to-thrive-blue-soft border-thrive-purple/10">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-thrive-purple" />
                  <span className="text-sm font-semibold text-thrive-purple">Fitness Insight</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  You&apos;re on track for your <strong>best fitness month ever</strong>. Your HIIT sessions are boosting your VO2 max — keep Friday workouts consistent!
                </p>
              </CardContent>
            </Card>

            {/* Calories ring */}
            <Card>
              <CardContent className="p-5 text-center">
                <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-extrabold text-gray-900">{weekCalories}</div>
                <p className="text-sm text-gray-500">calories burned this week</p>
                <Progress value={Math.round((weekCalories / 8000) * 100)} color="pink" className="mt-3" />
                <p className="text-xs text-gray-400 mt-1">{(8000 - weekCalories).toLocaleString()} to weekly goal</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
