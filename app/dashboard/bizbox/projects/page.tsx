import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Folder, Plus, Users, Calendar, CheckCircle2 } from 'lucide-react'

const projects = [
  {
    name: 'Website Redesign',
    client: 'Internal',
    status: 'active',
    progress: 65,
    due: 'Apr 15',
    team: ['A', 'M', 'J'],
    tasks: { done: 18, total: 28 },
    color: 'blue' as const,
  },
  {
    name: 'Acme Corp Integration',
    client: 'Acme Corp',
    status: 'active',
    progress: 40,
    due: 'May 1',
    team: ['A', 'P'],
    tasks: { done: 8, total: 20 },
    color: 'purple' as const,
  },
  {
    name: 'Mobile App v2.0',
    client: 'Internal',
    status: 'planning',
    progress: 15,
    due: 'Jul 30',
    team: ['J', 'M', 'A', 'P'],
    tasks: { done: 3, total: 20 },
    color: 'teal' as const,
  },
  {
    name: 'Q2 Marketing Campaign',
    client: 'Internal',
    status: 'active',
    progress: 80,
    due: 'Mar 31',
    team: ['M'],
    tasks: { done: 16, total: 20 },
    color: 'pink' as const,
  },
  {
    name: 'Annual Report',
    client: 'Internal',
    status: 'completed',
    progress: 100,
    due: 'Mar 15',
    team: ['A'],
    tasks: { done: 12, total: 12 },
    color: 'green' as const,
  },
]

const colorMap = {
  blue: 'border-thrive-blue/20',
  purple: 'border-thrive-purple/20',
  teal: 'border-thrive-teal/20',
  pink: 'border-thrive-pink/20',
  green: 'border-green-200',
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Projects" subtitle="Manage your active projects and timelines" />
      <main className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {[
              { label: 'All', count: projects.length },
              { label: 'Active', count: projects.filter(p => p.status === 'active').length },
              { label: 'Planning', count: projects.filter(p => p.status === 'planning').length },
              { label: 'Completed', count: projects.filter(p => p.status === 'completed').length },
            ].map((f) => (
              <button key={f.label} className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                {f.label}
                <Badge variant="secondary" className="text-xs">{f.count}</Badge>
              </button>
            ))}
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            New project
          </Button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <Card key={project.name} hover className={`border-l-4 ${colorMap[project.color]}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base mb-1">{project.name}</CardTitle>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Folder className="w-3 h-3" />
                      {project.client}
                    </div>
                  </div>
                  <Badge
                    variant={project.status === 'completed' ? 'green' : project.status === 'active' ? 'blue' : 'gold'}
                    className="capitalize text-xs"
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} color={project.color === 'green' ? 'green' : project.color} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {project.tasks.done}/{project.tasks.total} tasks
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {project.due}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <div className="flex -space-x-1">
                    {project.team.map((member, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-thrive-purple to-thrive-blue flex items-center justify-center text-white text-[9px] font-bold border-2 border-white">
                        {member}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
