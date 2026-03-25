'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle2,
  Circle,
  Plus,
  Flag,
  Calendar,
  Briefcase,
  Clock,
  Filter,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react'

const initialTasks = [
  { id: 1, title: 'Send proposal to Acme Corp', project: 'Sales', priority: 'high', due: 'Today', done: false, tags: ['client'] },
  { id: 2, title: 'Review Q4 financial report', project: 'Finance', priority: 'high', due: 'Today', done: true, tags: ['review'] },
  { id: 3, title: 'Update website homepage copy', project: 'Marketing', priority: 'medium', due: 'Tomorrow', done: false, tags: ['content'] },
  { id: 4, title: 'Client onboarding call prep', project: 'Sales', priority: 'medium', due: 'Today', done: false, tags: ['client', 'prep'] },
  { id: 5, title: 'Fix payment gateway bug', project: 'Product', priority: 'high', due: 'Tomorrow', done: false, tags: ['bug'] },
  { id: 6, title: 'Schedule team retrospective', project: 'Operations', priority: 'low', due: 'This week', done: false, tags: ['team'] },
  { id: 7, title: 'Review and merge PR #42', project: 'Product', priority: 'medium', due: 'Today', done: true, tags: ['dev'] },
  { id: 8, title: 'Prepare investor update email', project: 'Finance', priority: 'high', due: 'This week', done: false, tags: ['investor'] },
  { id: 9, title: 'Update CRM with new leads', project: 'Sales', priority: 'low', due: 'This week', done: false, tags: [] },
  { id: 10, title: 'Design new onboarding flow', project: 'Product', priority: 'medium', due: 'Next week', done: false, tags: ['design'] },
]

const projectColors: Record<string, string> = {
  Sales: 'bg-blue-100 text-blue-700',
  Finance: 'bg-green-100 text-green-700',
  Marketing: 'bg-pink-100 text-pink-700',
  Product: 'bg-purple-100 text-purple-700',
  Operations: 'bg-amber-100 text-amber-700',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks)

  const toggle = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const done = tasks.filter(t => t.done).length
  const completionRate = Math.round((done / tasks.length) * 100)

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Tasks"
        subtitle="Manage your Bizbox tasks and projects"
      />
      <main className="flex-1 p-8">
        {/* Top stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total tasks', value: tasks.length, icon: Briefcase, color: 'text-thrive-blue', bg: 'bg-thrive-blue-soft' },
            { label: 'Completed', value: done, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Due today', value: tasks.filter(t => t.due === 'Today' && !t.done).length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'High priority', value: tasks.filter(t => t.priority === 'high' && !t.done).length, icon: Flag, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Task list */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Tasks</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Filter className="w-3.5 h-3.5" />
                      Filter
                    </Button>
                    <Button size="sm" className="gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      Add task
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
                    <TabsTrigger value="today">Today ({tasks.filter(t => t.due === 'Today').length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({tasks.filter(t => !t.done).length})</TabsTrigger>
                    <TabsTrigger value="done">Done ({done})</TabsTrigger>
                  </TabsList>
                  {['all', 'today', 'pending', 'done'].map(tab => (
                    <TabsContent key={tab} value={tab}>
                      <div className="space-y-2">
                        {tasks
                          .filter(t =>
                            tab === 'all' ? true :
                            tab === 'today' ? t.due === 'Today' :
                            tab === 'pending' ? !t.done :
                            t.done
                          )
                          .map(task => (
                          <div
                            key={task.id}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                              task.done ? 'bg-gray-50 border-transparent opacity-60' : 'bg-white border-gray-100 hover:border-thrive-purple/20 hover:bg-thrive-purple-soft/30'
                            }`}
                          >
                            <button
                              onClick={() => toggle(task.id)}
                              className="shrink-0"
                            >
                              {task.done
                                ? <CheckCircle2 className="w-5 h-5 text-thrive-blue" />
                                : <Circle className="w-5 h-5 text-gray-300 hover:text-thrive-purple transition-colors" />
                              }
                            </button>
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {task.title}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${projectColors[task.project] || 'bg-gray-100 text-gray-600'}`}>
                                  {task.project}
                                </span>
                                {task.due && (
                                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-2.5 h-2.5" />
                                    {task.due}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge
                              variant={
                                task.priority === 'high' ? 'red' :
                                task.priority === 'medium' ? 'gold' : 'secondary'
                              }
                              className="text-[10px] capitalize shrink-0"
                            >
                              {task.priority}
                            </Badge>
                            <button className="text-gray-300 hover:text-gray-500 shrink-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-5xl font-extrabold text-thrive-blue mb-1">{completionRate}%</div>
                  <p className="text-sm text-gray-500">{done} of {tasks.length} tasks complete</p>
                </div>
                <Progress value={completionRate} color="blue" className="h-3 mb-4" />
                {completionRate >= 80 ? (
                  <p className="text-sm text-center text-green-600 font-medium">Outstanding! 🚀</p>
                ) : completionRate >= 50 ? (
                  <p className="text-sm text-center text-amber-600 font-medium">Great progress! Keep going 💪</p>
                ) : (
                  <p className="text-sm text-center text-gray-500">You&apos;ve got this! Start with the high priority ones.</p>
                )}
              </CardContent>
            </Card>

            {/* By project */}
            <Card>
              <CardHeader>
                <CardTitle>By Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.keys(projectColors).map(project => {
                    const projectTasks = tasks.filter(t => t.project === project)
                    const projectDone = projectTasks.filter(t => t.done).length
                    return (
                      <div key={project}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{project}</span>
                          <span className="text-gray-400 text-xs">{projectDone}/{projectTasks.length}</span>
                        </div>
                        <Progress value={projectTasks.length ? (projectDone / projectTasks.length) * 100 : 0} color="blue" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* AI suggestion */}
            <Card className="bg-gradient-to-br from-thrive-purple-soft to-thrive-blue-soft border-thrive-purple/10">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-thrive-purple" />
                  <span className="text-sm font-semibold text-thrive-purple">AI Suggestion</span>
                </div>
                <p className="text-sm text-gray-600">
                  Start with <strong>&ldquo;Send proposal to Acme Corp&rdquo;</strong> — it&apos;s high priority, due today, and will take ~30 min.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
