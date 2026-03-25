import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Briefcase,
  Heart,
  Zap,
  Target,
  BarChart3,
  Brain,
  Star,
  TrendingUp,
  Shield,
  Globe,
} from 'lucide-react'

const features = [
  {
    icon: Briefcase,
    title: 'Bizbox',
    subtitle: 'Business Suite',
    description: 'Manage tasks, track revenue, run projects, and analyze performance — everything your business needs in one place.',
    color: 'text-thrive-blue',
    bg: 'bg-thrive-blue-soft',
    gradient: 'from-blue-500/10 to-indigo-500/5',
    items: ['Task & project management', 'Revenue tracking', 'Team calendar', 'Business analytics'],
  },
  {
    icon: Heart,
    title: 'Lifebud',
    subtitle: 'Life Companion',
    description: 'Build powerful habits, track your mood, hit your goals, and maintain your wellness — your personal life OS.',
    color: 'text-thrive-pink',
    bg: 'bg-thrive-pink-soft',
    gradient: 'from-pink-500/10 to-rose-500/5',
    items: ['Habit tracking & streaks', 'Goal setting & milestones', 'Mood & journal', 'Fitness tracker'],
  },
  {
    icon: Brain,
    title: 'AI Assistant',
    subtitle: 'Powered by AI',
    description: 'Your intelligent co-pilot that surfaces insights, suggests priorities, and helps you make smarter decisions every day.',
    color: 'text-thrive-purple',
    bg: 'bg-thrive-purple-soft',
    gradient: 'from-purple-500/10 to-violet-500/5',
    items: ['Smart insights & nudges', 'Priority recommendations', 'Pattern recognition', 'Natural language queries'],
  },
]

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '98%', label: 'Satisfaction' },
  { value: '3x', label: 'Productivity' },
  { value: '50+', label: 'Integrations' },
]

const testimonials = [
  {
    quote: "ThriveOS changed how I run my business AND my life. I used to juggle 6 different apps. Now it's just one.",
    author: 'Sarah Chen',
    role: 'Founder, Bloom Studio',
    initials: 'SC',
  },
  {
    quote: "The habit tracking combined with business analytics is genius. I finally see the connection between my lifestyle and my results.",
    author: 'Marcus Rivera',
    role: 'CEO, Apex Digital',
    initials: 'MR',
  },
  {
    quote: "The AI assistant is like having a personal coach and CFO in one. It flags things I would've missed completely.",
    author: 'Priya Nair',
    role: 'Consultant & Coach',
    initials: 'PN',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-thrive-purple to-thrive-blue flex items-center justify-center shadow-thrive">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient-purple">ThriveOS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-thrive-purple transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-thrive-purple transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-thrive-purple transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-thrive-mesh">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="purple" className="mb-6 px-4 py-1.5 text-sm gap-1.5 inline-flex">
            <Star className="w-3.5 h-3.5" />
            Introducing ThriveOS 1.0
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            Build a thriving{' '}
            <span className="text-gradient">business</span>
            <br />
            and a fulfilling{' '}
            <span className="text-gradient">life</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            ThriveOS is the all-in-one platform combining <strong className="text-gray-700">Bizbox</strong> for
            your business and <strong className="text-gray-700">Lifebud</strong> for your life — powered by AI
            to help you do more of what matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="xl" className="w-full sm:w-auto gap-2">
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                View demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card required · Free forever plan</p>
        </div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-gradient-purple">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="purple" className="mb-4">Everything you need</Badge>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Two worlds, one platform
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Stop switching between apps. ThriveOS brings your business tools
              and life tools together in perfect harmony.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`rounded-2xl p-8 bg-gradient-to-br ${feature.gradient} border border-gray-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <Badge variant={
                  feature.title === 'Bizbox' ? 'blue' :
                  feature.title === 'Lifebud' ? 'pink' : 'purple'
                } className="mb-3 text-xs">
                  {feature.subtitle}
                </Badge>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className={`w-4 h-4 ${feature.color} shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ThriveOS */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="purple" className="mb-4">Why ThriveOS</Badge>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                The connection between business and life is{' '}
                <span className="text-gradient">everything</span>
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                The best entrepreneurs know that a thriving business starts with a thriving life.
                ThriveOS is the first platform built on this truth — helping you see the patterns
                that connect your daily habits to your bottom line.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: 'See how your sleep affects your revenue decisions' },
                  { icon: TrendingUp, text: 'Track which habits correlate with your best work days' },
                  { icon: Target, text: 'Align life goals with business milestones' },
                  { icon: Shield, text: 'Built with privacy-first principles' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-thrive-purple-soft flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-thrive-purple" />
                    </div>
                    <p className="text-gray-700 font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl bg-gradient-hero p-8 shadow-thrive-lg">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-5 shadow-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Today&apos;s momentum</span>
                      <Badge variant="green">On track</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">8</div>
                        <div className="text-xs text-gray-400">Tasks done</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-thrive-pink">5/5</div>
                        <div className="text-xs text-gray-400">Habits hit</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-thrive-blue">$4.2k</div>
                        <div className="text-xs text-gray-400">Revenue</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-card">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-thrive-purple to-thrive-blue flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">AI Insight</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      You close <strong className="text-gray-700">3x more deals</strong> on days when
                      you exercise in the morning. You have a workout logged — great start! 🎯
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="purple" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Loved by builders</h2>
            <p className="text-lg text-gray-500">
              Join thousands of entrepreneurs who use ThriveOS every day.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.author} className="bg-gray-50 rounded-2xl p-8 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-thrive-gold text-thrive-gold" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-thrive-purple to-thrive-blue flex items-center justify-center text-white text-sm font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="purple" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, honest pricing</h2>
            <p className="text-lg text-gray-500">Start free, upgrade when you&apos;re ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                desc: 'Perfect for getting started',
                features: ['5 active tasks', '3 habits tracked', 'Basic analytics', 'AI assistant (10/day)'],
                cta: 'Get started',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '$19',
                desc: 'For serious builders',
                features: ['Unlimited tasks', 'Unlimited habits', 'Advanced analytics', 'AI assistant (unlimited)', 'Integrations', 'Priority support'],
                cta: 'Start free trial',
                highlight: true,
              },
              {
                name: 'Team',
                price: '$49',
                desc: 'For growing companies',
                features: ['Everything in Pro', 'Up to 10 members', 'Team analytics', 'Admin controls', 'SSO', 'Dedicated support'],
                cta: 'Contact us',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-thrive-purple to-violet-600 text-white shadow-thrive-lg scale-105'
                    : 'bg-white border border-gray-100 shadow-card'
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-violet-200' : 'text-gray-500'}`}>
                  {plan.name}
                </div>
                <div className={`text-4xl font-extrabold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                  <span className={`text-sm font-normal ${plan.highlight ? 'text-violet-200' : 'text-gray-400'}`}>/mo</span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-violet-200' : 'text-gray-500'}`}>{plan.desc}</p>
                <Link href="/dashboard">
                  <Button
                    className="w-full mb-6"
                    variant={plan.highlight ? 'outline' : 'default'}
                    style={plan.highlight ? { borderColor: 'rgba(255,255,255,0.4)', color: 'white', background: 'rgba(255,255,255,0.15)' } : {}}
                  >
                    {plan.cta}
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-violet-100' : 'text-gray-600'}`}>
                      <CheckCircle className={`w-4 h-4 shrink-0 ${plan.highlight ? 'text-violet-300' : 'text-thrive-purple'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-thrive-purple via-violet-600 to-thrive-blue">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4">
            Ready to thrive?
          </h2>
          <p className="text-violet-200 text-lg mb-8 leading-relaxed">
            Join the movement of entrepreneurs who are building better businesses
            and better lives — at the same time.
          </p>
          <Link href="/dashboard">
            <Button size="xl" className="bg-white text-thrive-purple hover:bg-violet-50 shadow-xl">
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-violet-300 text-sm mt-4">No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-thrive-purple to-thrive-blue flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold">ThriveOS</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-sm">© 2025 ThriveOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
