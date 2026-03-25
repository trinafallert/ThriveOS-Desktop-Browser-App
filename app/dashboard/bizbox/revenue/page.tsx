'use client'

import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Plus,
  ArrowUpRight,
  Target,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const revenueData = [
  { month: 'Oct', amount: 28400 },
  { month: 'Nov', amount: 31200 },
  { month: 'Dec', amount: 35800 },
  { month: 'Jan', amount: 29600 },
  { month: 'Feb', amount: 34100 },
  { month: 'Mar', amount: 38200 },
]

const transactions = [
  { client: 'Acme Corp', type: 'Consulting', amount: 4500, date: 'Mar 20', status: 'paid' },
  { client: 'Bloom Studio', type: 'Retainer', amount: 2800, date: 'Mar 18', status: 'paid' },
  { client: 'Nexus Tech', type: 'Project', amount: 12000, date: 'Mar 15', status: 'pending' },
  { client: 'Vista Health', type: 'Consulting', amount: 3200, date: 'Mar 12', status: 'paid' },
  { client: 'Peak Finance', type: 'Advisory', amount: 5500, date: 'Mar 10', status: 'overdue' },
  { client: 'Core Media', type: 'Retainer', amount: 1800, date: 'Mar 8', status: 'paid' },
]

const mrr = 38200
const mrrGoal = 50000
const mrProgress = Math.round((mrr / mrrGoal) * 100)

export default function RevenuePage() {
  const maxRevenue = Math.max(...revenueData.map(d => d.amount))

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Revenue" subtitle="Track your business revenue and financial health" />
      <main className="flex-1 p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Monthly Revenue', value: formatCurrency(38200), change: '+12%', up: true, icon: DollarSign, color: 'text-thrive-teal', bg: 'bg-thrive-teal-light' },
            { label: 'Annual Run Rate', value: formatCurrency(458400), change: '+18%', up: true, icon: TrendingUp, color: 'text-thrive-blue', bg: 'bg-thrive-blue-soft' },
            { label: 'Active Clients', value: '14', change: '+2 new', up: true, icon: Users, color: 'text-thrive-purple', bg: 'bg-thrive-purple-soft' },
            { label: 'Avg Deal Size', value: formatCurrency(4850), change: '+8%', up: true, icon: ShoppingCart, color: 'text-thrive-pink', bg: 'bg-thrive-pink-soft' },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <Badge variant={s.up ? 'green' : 'red'} className="text-xs gap-1">
                    {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue chart */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Revenue Trend</CardTitle>
                  <Badge variant="teal">Last 6 months</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 h-48 pt-4">
                  {revenueData.map((d) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs text-gray-500 font-medium">{formatCurrency(d.amount).replace('$', '$').replace(',000', 'k').replace(',200', '.2k').replace(',800', '.8k').replace(',600', '.6k').replace(',100', '.1k').replace(',400', '.4k')}</div>
                      <div className="w-full relative flex items-end justify-center" style={{ height: '120px' }}>
                        <div
                          className={`w-full rounded-t-lg transition-all ${
                            d.month === 'Mar' ? 'bg-gradient-to-t from-thrive-teal to-thrive-blue' : 'bg-thrive-teal-light'
                          }`}
                          style={{ height: `${(d.amount / maxRevenue) * 100}%` }}
                        />
                      </div>
                      <div className={`text-xs font-semibold ${d.month === 'Mar' ? 'text-thrive-teal' : 'text-gray-400'}`}>{d.month}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-thrive-purple to-thrive-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {t.client.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800">{t.client}</div>
                        <div className="text-xs text-gray-400">{t.type} · {t.date}</div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">{formatCurrency(t.amount)}</div>
                      <Badge
                        variant={t.status === 'paid' ? 'green' : t.status === 'pending' ? 'gold' : 'red'}
                        className="text-[10px] capitalize"
                      >
                        {t.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* MRR Goal */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-thrive-purple" />
                  <CardTitle>Monthly Goal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-extrabold text-thrive-teal mb-1">{mrProgress}%</div>
                  <p className="text-sm text-gray-500">of {formatCurrency(mrrGoal)} goal</p>
                </div>
                <Progress value={mrProgress} color="teal" className="h-3 mb-3" />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatCurrency(mrr)} earned</span>
                  <span>{formatCurrency(mrrGoal - mrr)} remaining</span>
                </div>
              </CardContent>
            </Card>

            {/* Revenue by type */}
            <Card>
              <CardHeader>
                <CardTitle>By Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Consulting', amount: 18400, pct: 48, color: 'teal' as const },
                    { type: 'Retainers', amount: 11200, pct: 29, color: 'blue' as const },
                    { type: 'Projects', amount: 6800, pct: 18, color: 'purple' as const },
                    { type: 'Advisory', amount: 1800, pct: 5, color: 'pink' as const },
                  ].map((item) => (
                    <div key={item.type}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-gray-700 font-medium">{item.type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs">{item.pct}%</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                        </div>
                      </div>
                      <Progress value={item.pct} color={item.color} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending */}
            <Card className="border-amber-100 bg-amber-50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-amber-800">Pending Invoices</span>
                  <ArrowUpRight className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-extrabold text-amber-700 mb-1">$17,500</div>
                <p className="text-xs text-amber-600">3 invoices awaiting payment</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
