import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Flame,
  Target,
  ArrowUpRight,
  Clock,
  Zap,
  Heart,
  Briefcase,
  MessageSquare,
  Plus,
} from 'lucide-react'
import Link from 'next/link'

const aiInsights = [
  {
    text: "You're 2x more productive on days you journal in the morning. You haven't journaled yet today.",
    action: 'Open journal',
    href: '/dashboard/lifebud/journal',
    type: 'info',
  },
  {
    text: "3 tasks are overdue in Bizbox. Clearing them would free up significant mental load.",
    action: 'View tasks',
    href: '/dashboard/bizbox/tasks',
    type: 'warning',
  },
  {
    text: "Your habit streak is at 12 days — a personal best! Keep it up.",
    action: 'View habits',
    href: '/dashboard/lifebud/habits',
    type: 'success',
  },
]

const recentTasks = [
  { title: 'Review Q4 financial report', done: true, priority: 'high' },
  { title: 'Send proposal to Acme Corp', done: false, priority: 'high' },
  { title: 'Update website copy', done: false, priority: 'medium' },
  { title: 'Schedule team standup', done: true, priority: 'low' },
  { title: 'Client onboarding call prep', done: false, priority: 'medium' },
]

const habits = [
  { name: 'Morning workout', done: true, streak: 12, icon: '🏋️' },
  { name: 'Read 30 min', done: true, streak: 7, icon: '📚' },
  { name: 'Meditate', done: false, streak: 4, icon: '🧘' },
  { name: 'No screens before bed', done: false, streak: 2, icon: '📵' },
  { name: 'Drink 2L water', done: true, streak: 19, icon: '💧' },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header subtitle="Here&apos;s your Thrive snapshot for today" />
      <main className="flex-1 p-8 space-y-8">
        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Tasks complete',
              value: '8',
              sub: '3 remaining',
              icon: CheckCircle2,
              color: 'text-thrive-blue',
              bg: 'bg-thrive-blue-soft',
              trend: '+2 vs yesterday',
            },
            {
              label: 'Habits hit',
              value: '3/5',
              sub: '2 more to go',
              icon: Flame,
              color: 'text-thrive-pink',
              bg: 'bg-thrive-pink-soft',
              trend: '12-day streak',
            },
            {
              label: 'Revenue today',
              value: '$4,200',
              sub: 'Monthly: $38K',
              icon: TrendingUp,
              color: 'text-thrive-teal',
              bg: 'bg-thrive-teal-light',
              trend: '+18% vs last week',
            },
            {
              label: 'Goal progress',
              value: '68%',
              sub: 'Q4 objectives',
              icon: Target,
              color: 'text-thrive-purple',
              bg: 'bg-thrive-purple-soft',
              trend: 'On track',
            },
          ].map((stat) => (
            <Card key={stat.label} hover>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <Badge variant="green" className="text-[10px]">{stat.trend}</Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
                <div className="text-sm font-medium text-gray-700">{stat.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* AI Assistant */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-thrive-purple to-thrive-blue flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <CardTitle className="text-base">AI Insights</CardTitle>
                  </div>
                  <Badge variant="purple" className="text-xs">Powered by AI</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiInsights.map((insight, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-4 rounded-xl border ${
                      insight.type === 'warning'
                        ? 'bg-amber-50 border-amber-100'
                        : insight.type === 'success'
                        ? 'bg-green-50 border-green-100'
                        : 'bg-thrive-purple-soft border-thrive-purple/10'
                    }`}
                  >
                    <div className="flex-1 text-sm text-gray-700 leading-relaxed">{insight.text}</div>
                    <Link href={insight.href}>
                      <Button variant="ghost" size="sm" className="shrink-0 text-xs h-7 px-2.5 gap-1">
                        {insight.action}
                        <ArrowUpRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                ))}

                {/* AI Chat input */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-400">
                    <MessageSquare className="w-4 h-4" />
                    Ask AI anything about your day...
                  </div>
                  <Button size="icon" className="rounded-xl w-10 h-10">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bizbox Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-thrive-blue" />
                    <CardTitle className="text-base">Bizbox — Today&apos;s Tasks</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/dashboard/bizbox/tasks">
                      <Button variant="ghost" size="sm" className="text-xs h-7">View all</Button>
                    </Link>
                    <Button size="icon" variant="outline" className="w-7 h-7 rounded-lg">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentTasks.map((task, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        task.done ? 'opacity-60' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        task.done
                          ? 'bg-thrive-blue border-thrive-blue'
                          : 'border-gray-300'
                      }`}>
                        {task.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`flex-1 text-sm ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {task.title}
                      </span>
                      <Badge
                        variant={
                          task.priority === 'high' ? 'red' :
                          task.priority === 'medium' ? 'gold' : 'secondary'
                        }
                        className="text-[10px] capitalize"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Lifebud Habits */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-thrive-pink" />
                    <CardTitle className="text-base">Lifebud — Habits</CardTitle>
                  </div>
                  <Link href="/dashboard/lifebud/habits">
                    <Button variant="ghost" size="sm" className="text-xs h-7">View all</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {habits.map((habit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-base">{habit.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700 truncate">{habit.name}</span>
                          <div className="flex items-center gap-1 text-xs text-orange-500 shrink-0">
                            <Flame className="w-3 h-3" />
                            {habit.streak}
                          </div>
                        </div>
                        <Progress value={habit.done ? 100 : 0} color={habit.done ? 'pink' : 'purple'} className="h-1" />
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        habit.done ? 'bg-thrive-pink border-thrive-pink' : 'border-gray-300'
                      }`}>
                        {habit.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's schedule */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-thrive-teal" />
                    <CardTitle className="text-base">Schedule</CardTitle>
                  </div>
                  <Badge variant="teal" className="text-xs">Today</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '9:00', title: 'Team standup', type: 'meeting', color: 'bg-thrive-blue-soft border-thrive-blue/20' },
                    { time: '11:00', title: 'Client call — Acme Corp', type: 'call', color: 'bg-thrive-purple-soft border-thrive-purple/20' },
                    { time: '2:00', title: 'Deep work block', type: 'focus', color: 'bg-thrive-teal-light border-thrive-teal/20' },
                    { time: '4:30', title: 'Weekly review', type: 'review', color: 'bg-thrive-gold-light border-thrive-gold/20' },
                  ].map((event, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${event.color}`}>
                      <div className="text-xs font-semibold text-gray-500 w-10 shrink-0">{event.time}</div>
                      <div className="text-sm text-gray-700 font-medium">{event.title}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-thrive-gold" />
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Add task', icon: '✅', href: '/dashboard/bizbox/tasks' },
                    { label: 'Log mood', icon: '😊', href: '/dashboard/lifebud/mood' },
                    { label: 'Add revenue', icon: '💰', href: '/dashboard/bizbox/revenue' },
                    { label: 'Journal entry', icon: '📝', href: '/dashboard/lifebud/journal' },
                  ].map((action) => (
                    <Link key={action.label} href={action.href}>
                      <button className="w-full flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
                        <span>{action.icon}</span>
                        {action.label}
                      </button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
