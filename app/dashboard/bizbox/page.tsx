'use client'

import { useState } from 'react'
import { Reorder } from 'framer-motion'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import {
  useBusinesses,
  useBusiness,
  Business,
  BUSINESS_GRADIENTS,
  BUSINESS_TYPE_LABELS,
  BusinessType,
} from '@/lib/businesses-context'
import {
  Plus,
  GripVertical,
  Check,
  Link2,
  LinkIcon,
  Pencil,
  Trash2,
  X,
  ArrowUpRight,
  Briefcase,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ─── Add Business Modal ───────────────────────────────────────────────────────

const EMOJI_OPTIONS = ['💼', '✍️', '🎵', '🎬', '🎙️', '🛍️', '🌿', '🔥', '⚡', '🚀', '🌸', '💡', '🎯', '📚', '🏆', '💎']

const TYPE_OPTIONS: { value: BusinessType; label: string; emoji: string }[] = [
  { value: 'personal-brand', label: 'Personal Brand', emoji: '🌟' },
  { value: 'company', label: 'Company', emoji: '🏢' },
  { value: 'author', label: 'Author / Books', emoji: '📚' },
  { value: 'music', label: 'Music / Artist', emoji: '🎵' },
  { value: 'creator', label: 'Content Creator', emoji: '🎬' },
  { value: 'podcast', label: 'Podcast', emoji: '🎙️' },
  { value: 'other', label: 'Other Business', emoji: '💼' },
]

const GRADIENT_OPTIONS = Object.keys(BUSINESS_GRADIENTS)

function AddBusinessModal({ onClose }: { onClose: () => void }) {
  const { addBusiness } = useBusinesses()
  const [name, setName] = useState('')
  const [type, setType] = useState<BusinessType>('company')
  const [description, setDescription] = useState('')
  const [gradient, setGradient] = useState('violet')
  const [emoji, setEmoji] = useState('💼')

  const handleSubmit = () => {
    if (!name.trim()) return
    addBusiness({ name: name.trim(), type, description: description.trim(), gradient, emoji })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Modal header preview */}
        <div className={cn('h-24 bg-gradient-to-br flex items-center justify-center relative', BUSINESS_GRADIENTS[gradient])}>
          <span className="text-5xl drop-shadow-md">{emoji}</span>
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add a Business or Brand</h2>
            <p className="text-sm text-gray-500 mt-0.5">Each one gets its own dashboard and tools</p>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Name</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. Trina Singer, My Shopify Store…"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-300"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all',
                    type === opt.value
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <span>{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Brand Color</label>
            <div className="flex gap-2 flex-wrap">
              {GRADIENT_OPTIONS.map(g => (
                <button
                  key={g}
                  onClick={() => setGradient(g)}
                  className={cn(
                    'w-8 h-8 rounded-full bg-gradient-to-br transition-transform',
                    BUSINESS_GRADIENTS[g],
                    gradient === g ? 'ring-2 ring-offset-2 ring-violet-500 scale-110' : 'hover:scale-105'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Emoji */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={cn(
                    'w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all',
                    emoji === e ? 'bg-violet-100 ring-2 ring-violet-400 scale-110' : 'hover:bg-gray-100'
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Short description <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What this brand is about…"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-300"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button
              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-700 text-white hover:opacity-90"
              onClick={handleSubmit}
              disabled={!name.trim()}
            >
              Create
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Edit Business Modal ──────────────────────────────────────────────────────

function EditBusinessModal({ business, onClose }: { business: Business; onClose: () => void }) {
  const { updateBusiness } = useBusinesses()
  const [name, setName] = useState(business.name)
  const [type, setType] = useState<BusinessType>(business.type)
  const [description, setDescription] = useState(business.description)
  const [gradient, setGradient] = useState(business.gradient)
  const [emoji, setEmoji] = useState(business.emoji)

  const handleSave = () => {
    if (!name.trim()) return
    updateBusiness(business.id, { name: name.trim(), type, description: description.trim(), gradient, emoji })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className={cn('h-24 bg-gradient-to-br flex items-center justify-center relative', BUSINESS_GRADIENTS[gradient])}>
          <span className="text-5xl drop-shadow-md">{emoji}</span>
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Edit Business</h2>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Name</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all',
                    type === opt.value
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  <span>{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {GRADIENT_OPTIONS.map(g => (
                <button
                  key={g}
                  onClick={() => setGradient(g)}
                  className={cn(
                    'w-8 h-8 rounded-full bg-gradient-to-br transition-transform',
                    BUSINESS_GRADIENTS[g],
                    gradient === g ? 'ring-2 ring-offset-2 ring-violet-500 scale-110' : 'hover:scale-105'
                  )}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} onClick={() => setEmoji(e)}
                  className={cn('w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all',
                    emoji === e ? 'bg-violet-100 ring-2 ring-violet-400 scale-110' : 'hover:bg-gray-100')}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Description</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-gradient-to-r from-violet-500 to-purple-700 text-white hover:opacity-90" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Connect Modal ────────────────────────────────────────────────────────────

function ConnectModal({ business, onClose }: { business: Business; onClose: () => void }) {
  const { businesses, linkBusinesses, unlinkBusinesses } = useBusinesses()
  const others = businesses.filter(b => b.id !== business.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Connect Businesses</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Connected brands can share data and branding info.</p>

        {others.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Add more businesses first to connect them.</p>
        ) : (
          <div className="space-y-2">
            {others.map(other => {
              const linked = business.linkedIds.includes(other.id)
              return (
                <div key={other.id} className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all',
                  linked ? 'border-violet-300 bg-violet-50' : 'border-gray-100'
                )}>
                  <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg shrink-0', BUSINESS_GRADIENTS[other.gradient])}>
                    {other.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{other.name}</p>
                    <p className="text-xs text-gray-400">{BUSINESS_TYPE_LABELS[other.type]}</p>
                  </div>
                  <button
                    onClick={() => linked ? unlinkBusinesses(business.id, other.id) : linkBusinesses(business.id, other.id)}
                    className={cn(
                      'text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
                      linked ? 'bg-violet-100 text-violet-700 hover:bg-red-50 hover:text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-700'
                    )}
                  >
                    {linked ? 'Unlink' : 'Link'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <Button variant="outline" className="w-full mt-4" onClick={onClose}>Done</Button>
      </motion.div>
    </div>
  )
}

// ─── Business Card ────────────────────────────────────────────────────────────

function BusinessCard({ business, editing }: { business: Business; editing: boolean }) {
  const { deleteBusiness, businesses } = useBusinesses()
  const [showEdit, setShowEdit] = useState(false)
  const [showConnect, setShowConnect] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const linkedCount = business.linkedIds.filter(id => businesses.some(b => b.id === id)).length

  return (
    <>
      <Reorder.Item
        value={business}
        className={cn(
          'relative rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-shadow',
          editing ? 'cursor-grab active:cursor-grabbing shadow-md' : 'hover:shadow-md hover:border-gray-200'
        )}
        whileDrag={{ scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', zIndex: 10 }}
      >
        {/* Gradient header */}
        <div className={cn('h-28 bg-gradient-to-br relative flex items-center justify-center', BUSINESS_GRADIENTS[business.gradient])}>
          {editing && (
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <GripVertical className="w-3.5 h-3.5 text-white/80" />
            </div>
          )}
          <span className="text-5xl drop-shadow-md">{business.emoji}</span>

          {/* Linked indicator */}
          {linkedCount > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
              <Link2 className="w-3 h-3 text-white" />
              <span className="text-white text-[10px] font-medium">{linkedCount}</span>
            </div>
          )}

          {/* Menu button */}
          {!editing && (
            <div className="absolute top-2 right-2">
              <button
                onClick={e => { e.preventDefault(); setMenuOpen(o => !o) }}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <ChevronDown className="w-3.5 h-3.5 text-white" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[140px]">
                  <button
                    onClick={e => { e.preventDefault(); setMenuOpen(false); setShowEdit(true) }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                    Edit
                  </button>
                  <button
                    onClick={e => { e.preventDefault(); setMenuOpen(false); setShowConnect(true) }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                    Connect
                  </button>
                  <button
                    onClick={e => {
                      e.preventDefault()
                      setMenuOpen(false)
                      if (confirm(`Delete "${business.name}"? This cannot be undone.`)) deleteBusiness(business.id)
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card body — clicking navigates into the business */}
        <Link href={`/dashboard/bizbox/${business.id}`} className={editing ? 'pointer-events-none' : ''}>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2">{business.name}</h3>
              {!editing && <ArrowUpRight className="w-4 h-4 text-gray-300 shrink-0 mt-0.5 group-hover:text-thrive-purple" />}
            </div>
            <p className="text-xs text-gray-400 mb-3">{BUSINESS_TYPE_LABELS[business.type]}</p>
            {business.description && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{business.description}</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <Briefcase className="w-3 h-3" />
                {business.widgets.length} widgets
              </div>
              {linkedCount > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-violet-500">
                  <Link2 className="w-3 h-3" />
                  {linkedCount} linked
                </div>
              )}
            </div>
          </div>
        </Link>
      </Reorder.Item>

      {showEdit && <EditBusinessModal business={business} onClose={() => setShowEdit(false)} />}
      {showConnect && <ConnectModal business={business} onClose={() => setShowConnect(false)} />}
    </>
  )
}

// ─── Add Card ─────────────────────────────────────────────────────────────────

function AddCard({ onAdd }: { onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="rounded-2xl border-2 border-dashed border-gray-200 bg-white/60 hover:border-violet-300 hover:bg-violet-50/40 transition-all flex flex-col items-center justify-center gap-3 min-h-[220px] group"
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-violet-100 flex items-center justify-center transition-colors">
        <Plus className="w-6 h-6 text-gray-400 group-hover:text-violet-500 transition-colors" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-500 group-hover:text-violet-600 transition-colors">Add Business</p>
        <p className="text-xs text-gray-400 mt-0.5">Brand, company, project…</p>
      </div>
    </button>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center mb-6 shadow-thrive">
        <Briefcase className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Your business command center</h3>
      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
        Add your brands, businesses, and personal projects. Each one gets its own dashboard, tasks, revenue tracking, and more.
      </p>
      <Button onClick={onAdd} className="bg-gradient-to-r from-violet-500 to-purple-700 text-white hover:opacity-90 px-6 py-2.5 h-auto text-sm font-semibold rounded-xl shadow-thrive">
        <Plus className="w-4 h-4 mr-2" />
        Add your first business
      </Button>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BizboxCommandCenter() {
  const { businesses, reorderBusinesses } = useBusinesses()
  const [editing, setEditing] = useState(false)
  const [showAdd, setShowAdd] = useState(false)

  const sorted = [...businesses].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col min-h-screen">
      <Header subtitle="Your business command center" />
      <main className="flex-1 p-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Brands & Businesses</h2>
            <p className="text-sm text-gray-500 mt-0.5">Click any business to open its dashboard</p>
          </div>
          <div className="flex gap-2">
            {sorted.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(e => !e)}
                className={cn(editing && 'border-violet-500 text-violet-600 bg-violet-50')}
              >
                {editing
                  ? <><Check className="w-3.5 h-3.5 mr-1.5" />Done</>
                  : <><GripVertical className="w-3.5 h-3.5 mr-1.5" />Reorder</>
                }
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setShowAdd(true)}
              className="bg-gradient-to-r from-violet-500 to-purple-700 text-white hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Business
            </Button>
          </div>
        </div>

        {businesses.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : (
          <Reorder.Group
            axis="y"
            values={sorted}
            onReorder={reorderBusinesses}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
            as="div"
          >
            {sorted.map(biz => (
              <BusinessCard key={biz.id} business={biz} editing={editing} />
            ))}
            {!editing && <AddCard onAdd={() => setShowAdd(true)} />}
          </Reorder.Group>
        )}
      </main>

      {showAdd && <AddBusinessModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
