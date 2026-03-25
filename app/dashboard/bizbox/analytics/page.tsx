import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Users, Target, Zap, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const kpis = [
  { label: 'Customer Acquisition Cost', value: '$142', change: '-8%', up: false, good: true },
  { label: 'Customer Lifetime Value', value: '$8,400', change: '+22%', up: true, good: true },
  { label: 'Churn Rate', value: '2.1%', change: '-0.4%', up: false, good: true },
  { label: 'Net Promoter Score', value: '72', change: '+5', up: true, good: true },
  { label: 'Sales Win Rate', value: '38%', change: '+6%', up: true, good: true },
  { label: 'Avg Sales Cycle', value: '18 days', change: '-3d', up: false, good: true },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Analytics" subtitle="Business intelligence and performance insights" />
      <main className="flex-1 p-8 space-y-6">

        {/* KPI Grid */}
        <div className="grid grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-gray-500">{kpi.label}</span>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.good ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {kpi.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pipeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-thrive-blue" />
                <CardTitle>Sales Pipeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: 'Lead', count: 24, value: 86400, color: 'blue' as const, pct: 100 },
                  { stage: 'Qualified', count: 14, value: 58800, color: 'purple' as const, pct: 68 },
                  { stage: 'Proposal', count: 8, value: 42000, color: 'pink' as const, pct: 48 },
                  { stage: 'Negotiation', count: 5, value: 28500, color: 'teal' as const, pct: 33 },
                  { stage: 'Closed Won', count: 3, value: 18200, color: 'green' as const, pct: 21 },
                ].map((stage) => (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{stage.stage}</span>
                        <Badge variant="secondary" className="text-xs">{stage.count}</Badge>
                      </div>
                      <span className="text-gray-500">{formatCurrency(stage.value)}</span>
                    </div>
                    <Progress value={stage.pct} color={stage.color} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top channels */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-thrive-purple" />
                <CardTitle>Revenue by Channel</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { channel: 'Direct Sales', revenue: 18400, pct: 48, color: 'purple' as const },
                  { channel: 'Referrals', revenue: 11500, pct: 30, color: 'blue' as const },
                  { channel: 'Inbound', revenue: 5800, pct: 15, color: 'teal' as const },
                  { channel: 'Partnerships', revenue: 2500, pct: 7, color: 'pink' as const },
                ].map((ch) => (
                  <div key={ch.channel}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700">{ch.channel}</span>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span>{ch.pct}%</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(ch.revenue)}</span>
                      </div>
                    </div>
                    <Progress value={ch.pct} color={ch.color} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team performance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-thrive-teal" />
                <CardTitle>Team Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Alex K.', role: 'Sales Lead', tasks: 94, revenue: 18400, score: 98 },
                  { name: 'Maria S.', role: 'Account Mgr', tasks: 87, revenue: 12800, score: 91 },
                  { name: 'James T.', role: 'Sales Rep', tasks: 76, revenue: 9200, score: 82 },
                  { name: 'Priya N.', role: 'BizDev', tasks: 71, revenue: 8100, score: 78 },
                ].map((member) => (
                  <div key={member.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-thrive-purple to-thrive-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800">{member.name}</div>
                      <div className="text-xs text-gray-400">{member.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{formatCurrency(member.revenue)}</div>
                      <div className="text-xs text-gray-400">{member.tasks}% tasks</div>
                    </div>
                    <Badge variant={member.score >= 90 ? 'green' : member.score >= 75 ? 'gold' : 'secondary'} className="text-xs">
                      {member.score}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Growth metrics */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-thrive-gold" />
                <CardTitle>Growth Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { metric: 'MoM Revenue Growth', value: 12, target: 15, color: 'teal' as const },
                  { metric: 'New Customers', value: 71, target: 80, color: 'blue' as const },
                  { metric: 'Retention Rate', value: 94, target: 90, color: 'purple' as const },
                  { metric: 'Upsell Rate', value: 38, target: 50, color: 'pink' as const },
                ].map((m) => (
                  <div key={m.metric}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700">{m.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">Target: {m.target}%</span>
                        <Badge variant={m.value >= m.target ? 'green' : 'gold'} className="text-xs">
                          {m.value}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={Math.min((m.value / m.target) * 100, 100)} color={m.color} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
