import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react'

const events = [
  { time: '9:00 AM', title: 'Team Standup', duration: '30 min', type: 'meeting', attendees: 4, color: 'bg-thrive-blue-soft border-thrive-blue/20 text-thrive-blue' },
  { time: '11:00 AM', title: 'Client Call — Acme Corp', duration: '1 hour', type: 'call', attendees: 3, color: 'bg-thrive-purple-soft border-thrive-purple/20 text-thrive-purple' },
  { time: '1:00 PM', title: 'Lunch break', duration: '1 hour', type: 'personal', attendees: 0, color: 'bg-green-50 border-green-200 text-green-700' },
  { time: '2:00 PM', title: 'Deep Work Block', duration: '2 hours', type: 'focus', attendees: 0, color: 'bg-thrive-teal-light border-thrive-teal/20 text-thrive-teal' },
  { time: '4:30 PM', title: 'Weekly Review', duration: '30 min', type: 'review', attendees: 0, color: 'bg-thrive-gold-light border-thrive-gold/20 text-thrive-gold' },
  { time: '6:00 PM', title: 'Gym Session', duration: '1 hour', type: 'personal', attendees: 0, color: 'bg-thrive-pink-soft border-thrive-pink/20 text-thrive-pink' },
]

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const dates = [16, 17, 18, 19, 20, 21, 22]

export default function CalendarPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Calendar" subtitle="Schedule and manage your time" />
      <main className="flex-1 p-8 space-y-6">

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main calendar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Week strip */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h3 className="font-semibold text-gray-900">March 16–22, 2025</h3>
                    <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Today</Button>
                    <Button size="sm" className="gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      New event
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6">
                  {days.map((day, i) => (
                    <div
                      key={day}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${
                        dates[i] === 21 ? 'bg-thrive-purple text-white' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className={`text-xs font-medium ${dates[i] === 21 ? 'text-violet-200' : 'text-gray-400'}`}>{day}</span>
                      <span className={`text-lg font-bold ${dates[i] === 21 ? 'text-white' : 'text-gray-800'}`}>{dates[i]}</span>
                      {dates[i] === 21 && <div className="w-1 h-1 rounded-full bg-violet-300" />}
                    </div>
                  ))}
                </div>

                {/* Today's events */}
                <div className="space-y-2">
                  {events.map((event, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border ${event.color}`}>
                      <div className="w-16 shrink-0">
                        <span className="text-xs font-semibold">{event.time}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{event.title}</div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs flex items-center gap-1 opacity-70">
                            <Clock className="w-2.5 h-2.5" />
                            {event.duration}
                          </span>
                          {event.attendees > 0 && (
                            <span className="text-xs flex items-center gap-1 opacity-70">
                              <Users className="w-2.5 h-2.5" />
                              {event.attendees} attendees
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px] capitalize shrink-0">{event.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Mini calendar */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>March 2025</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="w-7 h-7"><ChevronLeft className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7"><ChevronRight className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-[10px] font-semibold text-gray-400 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {[...Array(6)].fill(null).concat([...Array(31)].map((_, i) => i + 1)).map((d, i) => (
                    <button
                      key={i}
                      className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                        d === 21
                          ? 'bg-thrive-purple text-white'
                          : d && [3, 7, 12, 18, 25].includes(d)
                          ? 'bg-thrive-pink-soft text-thrive-pink'
                          : d
                          ? 'hover:bg-gray-100 text-gray-700'
                          : ''
                      }`}
                    >
                      {d || ''}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-thrive-purple" />
                  <CardTitle>Upcoming</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: 'Board meeting', date: 'Mar 25', type: 'meeting' },
                    { title: 'Product launch', date: 'Apr 1', type: 'milestone' },
                    { title: 'Q1 review', date: 'Apr 3', type: 'review' },
                    { title: 'Team offsite', date: 'Apr 10', type: 'event' },
                  ].map((e, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
                        <span className="text-[9px] text-gray-400 uppercase">{e.date.split(' ')[0]}</span>
                        <span className="text-sm font-bold text-gray-900">{e.date.split(' ')[1]}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{e.title}</div>
                        <Badge variant="secondary" className="text-[10px] mt-0.5 capitalize">{e.type}</Badge>
                      </div>
                    </div>
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
