'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { useUser } from '@/lib/user-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  X,
  LogIn,
  LogOut,
  UserPlus,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Settings,
  User,
  Database,
  Shield,
  ChevronRight,
  Pencil,
} from 'lucide-react'

type Tab = 'account' | 'profile' | 'data'

// ─── Sign In Form ─────────────────────────────────────────────────────────────
function SignInForm({ onToggle }: { onToggle: () => void }) {
  const { signIn, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { setError(error); return }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
        <p className="font-semibold text-gray-900">Signed in!</p>
        <p className="text-sm text-gray-500">Welcome back.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!configured && (
        <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">Supabase not configured</p>
            <p>Add <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your <code className="bg-amber-100 px-1 rounded">.env.local</code> file to enable accounts.</p>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-300"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Password</label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      <Button
        className="w-full bg-gradient-to-r from-violet-500 to-purple-700 text-white hover:opacity-90"
        onClick={handleSubmit}
        disabled={loading || !email || !password}
      >
        {loading ? 'Signing in…' : <><LogIn className="w-3.5 h-3.5 mr-2" />Sign In</>}
      </Button>

      <p className="text-center text-xs text-gray-500">
        No account yet?{' '}
        <button onClick={onToggle} className="text-violet-600 font-semibold hover:underline">
          Create one
        </button>
      </p>
    </div>
  )
}

// ─── Sign Up Form ─────────────────────────────────────────────────────────────
function SignUpForm({ onToggle }: { onToggle: () => void }) {
  const { signUp, configured } = useAuth()
  const { user: localUser } = useUser()
  const [name, setName] = useState(localUser.name || '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) return
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError(null)
    const { error } = await signUp(email, password, name)
    setLoading(false)
    if (error) { setError(error); return }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
        <p className="font-semibold text-gray-900">Account created!</p>
        <p className="text-sm text-gray-500">Check your email to confirm your account, then sign in.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!configured && (
        <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">Supabase not configured</p>
            <p>Add <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your <code className="bg-amber-100 px-1 rounded">.env.local</code> file to enable real accounts.</p>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Your Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Trina Fallert"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-300"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-300"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Password</label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Min 6 characters"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      <Button
        className="w-full bg-gradient-to-r from-violet-500 to-purple-700 text-white hover:opacity-90"
        onClick={handleSubmit}
        disabled={loading || !email || !password}
      >
        {loading ? 'Creating account…' : <><UserPlus className="w-3.5 h-3.5 mr-2" />Create Account</>}
      </Button>

      <p className="text-center text-xs text-gray-500">
        Already have an account?{' '}
        <button onClick={onToggle} className="text-violet-600 font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </div>
  )
}

// ─── Account Tab ──────────────────────────────────────────────────────────────
function AccountTab() {
  const { user, signOut, configured } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [signingOut, setSigningOut] = useState(false)

  if (user) {
    const displayName = user.user_metadata?.name || user.email || 'User'
    const initials = displayName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    return (
      <div className="space-y-4">
        {/* Signed in card */}
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Saved
          </div>
        </div>

        <div className="p-3 bg-thrive-purple-soft border border-thrive-purple/10 rounded-xl">
          <p className="text-xs text-thrive-purple font-medium flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Your ThriveOS data is linked to this account and saved securely.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full text-red-500 border-red-200 hover:bg-red-50"
          onClick={async () => { setSigningOut(true); await signOut(); setSigningOut(false) }}
          disabled={signingOut}
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          {signingOut ? 'Signing out…' : 'Sign Out'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Local save notice */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-xs text-blue-700 font-medium mb-0.5">📦 Your data is saved locally</p>
        <p className="text-xs text-blue-600">
          Everything you've entered (onboarding answers, businesses, settings) is saved in your browser. Create an account to back it up to the cloud and access it from any device.
        </p>
      </div>

      {/* Toggle tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setMode('signup')}
          className={cn('flex-1 text-xs font-semibold py-2 rounded-lg transition-all', mode === 'signup' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500')}
        >
          Create Account
        </button>
        <button
          onClick={() => setMode('signin')}
          className={cn('flex-1 text-xs font-semibold py-2 rounded-lg transition-all', mode === 'signin' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500')}
        >
          Sign In
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {mode === 'signup'
            ? <SignUpForm onToggle={() => setMode('signin')} />
            : <SignInForm onToggle={() => setMode('signup')} />
          }
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  const { user } = useAuth()
  const { user: localUser, updateUser } = useUser()
  const [name, setName] = useState(localUser.name)
  const [linkedin, setLinkedin] = useState(localUser.linkedin)
  const [website, setWebsite] = useState(localUser.website)
  const [instagram, setInstagram] = useState(localUser.instagram)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateUser({ name, linkedin, website, instagram })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const initials = (name || localUser.name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl">
            {initials}
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50">
            <Pencil className="w-3 h-3 text-gray-500" />
          </button>
        </div>
        {user && (
          <span className="text-xs text-gray-400">{user.email}</span>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Display Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-300"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Website</label>
        <input
          value={website}
          onChange={e => setWebsite(e.target.value)}
          placeholder="https://yoursite.com"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-300"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Instagram</label>
        <input
          value={instagram}
          onChange={e => setInstagram(e.target.value)}
          placeholder="@yourhandle"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-300"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">LinkedIn</label>
        <input
          value={linkedin}
          onChange={e => setLinkedin(e.target.value)}
          placeholder="linkedin.com/in/yourprofile"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-300"
        />
      </div>

      <Button
        className={cn(
          'w-full transition-colors',
          saved
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gradient-to-r from-violet-500 to-purple-700 text-white hover:opacity-90'
        )}
        onClick={handleSave}
      >
        {saved ? <><Check className="w-3.5 h-3.5 mr-2" />Saved!</> : 'Save Profile'}
      </Button>
    </div>
  )
}

// ─── Data Tab ─────────────────────────────────────────────────────────────────
function DataTab() {
  const { user: localUser, resetOnboarding } = useUser()
  const [showReset, setShowReset] = useState(false)

  const savedFields = Object.entries(localUser).filter(([key, val]) => {
    if (key === 'onboardingComplete') return false
    if (typeof val === 'string') return val.trim().length > 0
    if (Array.isArray(val)) return val.some(v => v.trim?.().length > 0)
    return false
  })

  const dataItems = [
    { label: 'Name', value: localUser.name, saved: Boolean(localUser.name) },
    { label: 'Dream life', value: localUser.dreamLife?.slice(0, 60), saved: Boolean(localUser.dreamLife) },
    { label: 'Business goals', value: localUser.bizGoals?.filter(g => g.trim()).join(', ')?.slice(0, 60), saved: localUser.bizGoals?.some(g => g.trim()) },
    { label: 'Life goals', value: localUser.lifeGoals?.filter(g => g.trim()).join(', ')?.slice(0, 60), saved: localUser.lifeGoals?.some(g => g.trim()) },
    { label: 'Work style', value: localUser.workStyle, saved: Boolean(localUser.workStyle) },
    { label: 'Productive time', value: localUser.productiveTime, saved: Boolean(localUser.productiveTime) },
    { label: 'Social links', value: [localUser.linkedin, localUser.website, localUser.instagram].filter(Boolean).join(', '), saved: Boolean(localUser.linkedin || localUser.website || localUser.instagram) },
  ]

  const savedCount = dataItems.filter(d => d.saved).length

  return (
    <div className="space-y-4">
      <div className={cn(
        'flex items-center gap-2 p-3 rounded-xl border text-xs font-medium',
        savedCount > 0
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-gray-50 border-gray-200 text-gray-500'
      )}>
        {savedCount > 0
          ? <><CheckCircle2 className="w-4 h-4 shrink-0" />Your onboarding answers are saved in your browser ({savedCount} of {dataItems.length} sections filled).</>
          : <><Database className="w-4 h-4 shrink-0" />No profile data saved yet. Complete onboarding to fill this in.</>
        }
      </div>

      <div className="space-y-2">
        {dataItems.map(item => (
          <div key={item.label} className={cn(
            'flex items-start gap-2.5 p-2.5 rounded-xl',
            item.saved ? 'bg-white border border-gray-100' : 'opacity-40'
          )}>
            <div className={cn(
              'w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center',
              item.saved ? 'bg-green-100' : 'bg-gray-100'
            )}>
              {item.saved
                ? <Check className="w-2.5 h-2.5 text-green-600" />
                : <X className="w-2.5 h-2.5 text-gray-400" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700">{item.label}</p>
              {item.saved && item.value && (
                <p className="text-xs text-gray-400 truncate mt-0.5">{item.value}{item.value.length >= 60 ? '…' : ''}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-gray-100">
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Reset all data & onboarding…
          </button>
        ) : (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
            <p className="text-xs text-red-700 font-medium">This will erase all your data. Are you sure?</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-7"
                onClick={() => setShowReset(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs h-7 bg-red-500 hover:bg-red-600 text-white"
                onClick={() => { resetOnboarding(); setShowReset(false) }}
              >
                Reset everything
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

interface ProfilePanelProps {
  open: boolean
  onClose: () => void
  defaultTab?: Tab
}

export function ProfilePanel({ open, onClose, defaultTab = 'account' }: ProfilePanelProps) {
  const [tab, setTab] = useState<Tab>(defaultTab)
  const { user: authUser } = useAuth()
  const { user: localUser } = useUser()

  useEffect(() => {
    if (open) setTab(defaultTab)
  }, [open, defaultTab])

  const initials = (authUser?.user_metadata?.name || localUser.name || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'data', label: 'My Data', icon: Database },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed right-0 top-0 h-full w-[380px] max-w-full bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">
                  {authUser?.user_metadata?.name || localUser.name || 'Your Account'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {authUser?.email ?? 'Saved locally · not signed in'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Tab nav */}
            <div className="flex border-b border-gray-100 px-4 pt-2">
              {tabs.map(t => {
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors -mb-px',
                      tab === t.id
                        ? 'border-violet-500 text-violet-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {tab === 'account' && <AccountTab />}
                  {tab === 'profile' && <ProfileTab />}
                  {tab === 'data' && <DataTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
