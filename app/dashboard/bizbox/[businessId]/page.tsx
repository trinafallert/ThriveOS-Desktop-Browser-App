'use client'

export function generateStaticParams() { return [] }

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Reorder } from 'framer-motion'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/header'
import {
  useBusiness,
  useBusinesses,
  Widget,
  WidgetType,
  BUSINESS_GRADIENTS,
  BUSINESS_TYPE_LABELS,
} from '@/lib/businesses-context'
import {
  ArrowLeft,
  LayoutGrid,
  Check,
  Plus,
  X,
  GripVertical,
  CheckSquare,
  TrendingUp,
  Target,
  Sparkles,
  StickyNote,
  BarChart3,
  Calendar,
  Link2,
  Pencil,
  Trash2,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ─── Widget registry ──────────────────────────────────────────────────────────

const WIDGET_META: Record<WidgetType, { label: string; icon: React.ElementType; color: string; bg: string; description: string }> = {
  tasks: { label: 'Tasks', icon: CheckSquare, color: 'text-thrive-blue', bg: 'bg-thrive-blue-soft', description: 'Your to-dos and action items' },
  revenue: { label: 'Revenue', icon: TrendingUp, color: 'text-thrive-teal', bg: 'bg-thrive-teal-light', description: 'Income and financial tracking' },
  projects: { label: 'Projects', icon: Target, color: 'text-thrive-purple', bg: 'bg-thrive-purple-soft', description: 'Track active projects' },
  goals: { label: 'Goals', icon: Sparkles, color: 'text-thrive-gold', bg: 'bg-thrive-gold-light', description: 'Business goals & milestones' },
  notes: { label: 'Notes', icon: StickyNote, color: 'text-gray-600', bg: 'bg-gray-100', description: 'Quick notes and ideas' },
  analytics: { label: 'Analytics', icon: BarChart3, color: 'text-thrive-pink', bg: 'bg-thrive-pink-soft', description: 'Stats and performance data' },
  calendar: { label: 'Calendar', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50', description: 'Upcoming events and deadlines' },
}

// ─── Individual widget content ─────────────────────────────────────────────────

function TasksWidget({ businessName }: { businessName: string }) {
  const tasks = [
    { id: 1, text: 'Update website copy', done: false, due: 'Today' },
    { id: 2, text: 'Follow up with client', done: true, due: 'Yesterday' },
    { id: 3, text: 'Review Q2 strategy', done: false, due: 'Mar 25' },
    { id: 4, text: 'Schedule team sync', done: false, due: 'Mar 28' },
  ]
  return (
    <div className="space-y-2">
      {tasks.map(t => (
        <div key={t.id} className="flex items-center gap-3 group">
          <div className={cn(
            'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
            t.done ? 'border-thrive-blue bg-thrive-blue' : 'border-gray-300 group-hover:border-thrive-blue/50'
          )}>
            {t.done && <Check className="w-2.5 h-2.5 text-white" />}
          </div>
          <span className={cn('text-sm flex-1', t.done ? 'line-through text-gray-400' : 'text-gray-700')}>{t.text}</span>
          <span className="text-[11px] text-gray-400 flex items-center gap-1 shrink-0">
            <Clock className="w-2.5 h-2.5" />{t.due}
          </span>
        </div>
      ))}
      <button className="flex items-center gap-2 text-xs text-thrive-blue hover:text-thrive-blue/80 transition-colors pt-1">
        <Plus className="w-3 h-3" />Add task
      </button>
    </div>
  )
}

function RevenueWidget() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-thrive-teal-light">
          <p className="text-xs text-gray-500 mb-0.5">This Month</p>
          <p className="text-xl font-bold text-gray-900">$8,400</p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500 mb-0.5">Goal</p>
          <p className="text-xl font-bold text-gray-900">$12,000</p>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Monthly progress</span>
          <span className="font-medium text-gray-700">70%</span>
        </div>
        <Progress value={70} className="h-2" />
      </div>
      <div className="space-y-1.5">
        {[
          { label: 'Consulting', amount: '$4,200', color: 'bg-thrive-teal' },
          { label: 'Products', amount: '$2,800', color: 'bg-thrive-blue' },
          { label: 'Affiliate', amount: '$1,400', color: 'bg-thrive-purple' },
        ].map(r => (
          <div key={r.label} className="flex items-center gap-2 text-sm">
            <div className={cn('w-2 h-2 rounded-full shrink-0', r.color)} />
            <span className="flex-1 text-gray-600">{r.label}</span>
            <span className="font-semibold text-gray-800">{r.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsWidget() {
  const projects = [
    { name: 'Website Redesign', progress: 68, status: 'In Progress', color: 'bg-thrive-blue' },
    { name: 'Product Launch', progress: 25, status: 'Planning', color: 'bg-thrive-purple' },
    { name: 'Q2 Campaign', progress: 45, status: 'In Progress', color: 'bg-thrive-teal' },
  ]
  return (
    <div className="space-y-3">
      {projects.map(p => (
        <div key={p.name} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('w-2 h-2 rounded-full', p.color)} />
              <span className="text-sm font-medium text-gray-800">{p.name}</span>
            </div>
            <span className="text-xs text-gray-400">{p.progress}%</span>
          </div>
          <Progress value={p.progress} className="h-1.5" />
        </div>
      ))}
      <button className="flex items-center gap-2 text-xs text-thrive-purple hover:text-thrive-purple/80 transition-colors pt-1">
        <Plus className="w-3 h-3" />Add project
      </button>
    </div>
  )
}

function GoalsWidget({ businessName }: { businessName: string }) {
  const goals = [
    { text: `Grow ${businessName} to $15K/month`, done: false },
    { text: 'Launch new product line by Q3', done: false },
    { text: 'Build email list to 5,000', done: true },
  ]
  return (
    <div className="space-y-2.5">
      {goals.map((g, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={cn(
            'w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold border',
            g.done
              ? 'bg-thrive-gold border-thrive-gold/50 text-white'
              : 'bg-thrive-gold-light border-thrive-gold/30 text-thrive-gold'
          )}>
            {g.done ? '✓' : i + 1}
          </div>
          <p className={cn('text-sm leading-relaxed', g.done ? 'line-through text-gray-400' : 'text-gray-700')}>{g.text}</p>
        </div>
      ))}
      <button className="flex items-center gap-2 text-xs text-thrive-gold hover:text-thrive-gold/80 transition-colors pt-1">
        <Plus className="w-3 h-3" />Add goal
      </button>
    </div>
  )
}

function NotesWidget() {
  const [note, setNote] = useState('')
  return (
    <div>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Quick thoughts, ideas, brain dumps…"
        className="w-full min-h-[120px] text-sm text-gray-700 placeholder:text-gray-300 resize-none focus:outline-none leading-relaxed"
      />
    </div>
  )
}

function AnalyticsWidget() {
  const bars = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 80 },
    { label: 'Wed', value: 45 },
    { label: 'Thu', value: 90 },
    { label: 'Fri', value: 72 },
    { label: 'Sat', value: 30 },
    { label: 'Sun', value: 55 },
  ]
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-xl bg-thrive-pink-soft">
          <p className="text-lg font-bold text-gray-900">2.4K</p>
          <p className="text-[10px] text-gray-500">Visitors</p>
        </div>
        <div className="p-2 rounded-xl bg-thrive-blue-soft">
          <p className="text-lg font-bold text-gray-900">12%</p>
          <p className="text-[10px] text-gray-500">Conversion</p>
        </div>
        <div className="p-2 rounded-xl bg-thrive-purple-soft">
          <p className="text-lg font-bold text-gray-900">4.8</p>
          <p className="text-[10px] text-gray-500">Avg Rating</p>
        </div>
      </div>
      <div className="flex items-end gap-1 h-16">
        {bars.map(b => (
          <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-thrive-pink/60"
              style={{ height: `${(b.value / 100) * 48}px` }}
            />
            <span className="text-[9px] text-gray-400">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarWidget() {
  const events = [
    { title: 'Client call', time: 'Today 2pm', color: 'bg-thrive-blue' },
    { title: 'Content shoot', time: 'Tomorrow 10am', color: 'bg-thrive-pink' },
    { title: 'Investor meeting', time: 'Mar 28 3pm', color: 'bg-thrive-purple' },
    { title: 'Product review', time: 'Apr 1 11am', color: 'bg-thrive-teal' },
  ]
  return (
    <div className="space-y-2">
      {events.map((e, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={cn('w-2 h-8 rounded-full shrink-0', e.color)} />
          <div>
            <p className="text-sm font-medium text-gray-800">{e.title}</p>
            <p className="text-xs text-gray-400">{e.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function WidgetContent({ widget, businessName }: { widget: Widget; businessName: string }) {
  switch (widget.type) {
    case 'tasks': return <TasksWidget businessName={businessName} />
    case 'revenue': return <RevenueWidget />
    case 'projects': return <ProjectsWidget />
    case 'goals': return <GoalsWidget businessName={businessName} />
    case 'notes': return <NotesWidget />
    case 'analytics': return <AnalyticsWidget />
    case 'calendar': return <CalendarWidget />
  }
}

// ─── Widget Card ──────────────────────────────────────────────────────────────

function WidgetCard({
  widget,
  businessName,
  editMode,
  onRemove,
}: {
  widget: Widget
  businessName: string
  editMode: boolean
  onRemove: (id: string) => void
}) {
  const meta = WIDGET_META[widget.type]
  const Icon = meta.icon

  return (
    <Reorder.Item
      value={widget}
      className={cn(
        'bg-white rounded-2xl border border-gray-100 overflow-hidden transition-shadow',
        editMode ? 'cursor-grab active:cursor-grabbing shadow-md' : 'shadow-sm hover:shadow-md'
      )}
      whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.12)', zIndex: 10 }}
    >
      <div className="p-4">
        {/* Widget header */}
        <div className="flex items-center gap-2.5 mb-4">
          {editMode && (
            <GripVertical className="w-4 h-4 text-gray-300 shrink-0 -ml-1" />
          )}
          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', meta.bg)}>
            <Icon className={cn('w-4 h-4', meta.color)} />
          </div>
          <span className="text-sm font-semibold text-gray-800 flex-1">{meta.label}</span>
          {editMode && (
            <button
              onClick={() => onRemove(widget.id)}
              className="w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-red-400" />
            </button>
          )}
        </div>

        {/* Widget content */}
        {!editMode && <WidgetContent widget={widget} businessName={businessName} />}
        {editMode && (
          <p className="text-xs text-gray-400 italic">{meta.description}</p>
        )}
      </div>
    </Reorder.Item>
  )
}

// ─── Add Widget Panel ─────────────────────────────────────────────────────────

function AddWidgetPanel({
  activeTypes,
  onAdd,
  onClose,
}: {
  activeTypes: WidgetType[]
  onAdd: (type: WidgetType) => void
  onClose: () => void
}) {
  const available = (Object.keys(WIDGET_META) as WidgetType[]).filter(t => !activeTypes.includes(t))

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-800">Add a widget</span>
        <button onClick={onClose} className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      {available.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-3">All widgets are already on your dashboard.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {available.map(type => {
            const meta = WIDGET_META[type]
            const Icon = meta.icon
            return (
              <button
                key={type}
                onClick={() => { onAdd(type); onClose() }}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all text-left"
              >
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', meta.bg)}>
                  <Icon className={cn('w-3.5 h-3.5', meta.color)} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{meta.label}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">{meta.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BusinessDashboardPage() {
  const params = useParams()
  const businessId = params.businessId as string
  const business = useBusiness(businessId)
  const { businesses, updateWidgets, deleteBusiness } = useBusinesses()
  const router = useRouter()

  const [editMode, setEditMode] = useState(false)
  const [showAddWidget, setShowAddWidget] = useState(false)

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500">Business not found.</p>
        <Link href="/dashboard/bizbox" className="text-thrive-purple text-sm mt-2 hover:underline">← Back to Bizbox</Link>
      </div>
    )
  }

  const sortedWidgets = [...business.widgets].sort((a, b) => a.order - b.order)
  const linkedBusinesses = businesses.filter(b => business.linkedIds.includes(b.id))

  const handleReorder = (newOrder: Widget[]) => {
    updateWidgets(business.id, newOrder.map((w, i) => ({ ...w, order: i })))
  }

  const handleRemoveWidget = (widgetId: string) => {
    updateWidgets(business.id, business.widgets.filter(w => w.id !== widgetId).map((w, i) => ({ ...w, order: i })))
  }

  const handleAddWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: `${Date.now()}-${type}`,
      type,
      order: business.widgets.length,
    }
    updateWidgets(business.id, [...business.widgets, newWidget])
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Business-branded header bar */}
      <div className={cn('h-1.5 bg-gradient-to-r', BUSINESS_GRADIENTS[business.gradient])} />

      <Header subtitle={BUSINESS_TYPE_LABELS[business.type]} />

      <main className="flex-1 p-8">
        {/* Business title row */}
        <div className="flex items-start gap-4 mb-8">
          <Link href="/dashboard/bizbox">
            <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors mt-0.5">
              <ArrowLeft className="w-4 h-4 text-gray-500" />
            </button>
          </Link>

          <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl shrink-0 shadow-sm', BUSINESS_GRADIENTS[business.gradient])}>
            {business.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{business.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{BUSINESS_TYPE_LABELS[business.type]}</p>
            {business.description && (
              <p className="text-sm text-gray-500 mt-0.5 truncate">{business.description}</p>
            )}
            {linkedBusinesses.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <Link2 className="w-3 h-3 text-violet-400" />
                <span className="text-xs text-gray-400">Linked to:</span>
                {linkedBusinesses.map(lb => (
                  <Link key={lb.id} href={`/dashboard/bizbox/${lb.id}`}>
                    <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full hover:bg-violet-100 transition-colors">
                      {lb.emoji} {lb.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2 shrink-0">
            <AnimatePresence>
              {editMode && (
                <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddWidget(o => !o)}
                    className="text-violet-600 border-violet-200 hover:bg-violet-50"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />Add widget
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setEditMode(e => !e); setShowAddWidget(false) }}
              className={cn(editMode && 'border-violet-500 text-violet-600 bg-violet-50')}
            >
              {editMode
                ? <><Check className="w-3.5 h-3.5 mr-1.5" />Done editing</>
                : <><LayoutGrid className="w-3.5 h-3.5 mr-1.5" />Edit layout</>
              }
            </Button>
          </div>
        </div>

        {/* Add widget panel */}
        <AnimatePresence>
          {showAddWidget && (
            <div className="mb-6 max-w-lg">
              <AddWidgetPanel
                activeTypes={business.widgets.map(w => w.type)}
                onAdd={handleAddWidget}
                onClose={() => setShowAddWidget(false)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Edit mode hint */}
        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-violet-600 bg-violet-50 border border-violet-200 rounded-xl px-4 py-2.5 mb-6 w-fit"
          >
            <GripVertical className="w-3.5 h-3.5" />
            Drag widgets to rearrange your dashboard. Use × to remove a widget.
          </motion.div>
        )}

        {/* Widget grid */}
        {sortedWidgets.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <LayoutGrid className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No widgets yet. Click <strong>Edit layout</strong> to add some.</p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={sortedWidgets}
            onReorder={handleReorder}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
            as="div"
          >
            {sortedWidgets.map(widget => (
              <WidgetCard
                key={widget.id}
                widget={widget}
                businessName={business.name}
                editMode={editMode}
                onRemove={handleRemoveWidget}
              />
            ))}
          </Reorder.Group>
        )}
      </main>
    </div>
  )
}
