'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus, Sparkles, Search, Calendar, Heart } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const entries = [
  {
    id: 1,
    date: new Date('2025-03-20'),
    mood: '😊',
    title: 'Productive day and new insights',
    content: "Had a great call with the Acme Corp team today. They seem really excited about our solution. I also managed to get a solid workout in this morning which set the tone for the whole day. Feeling grateful for the momentum right now...",
    tags: ['work', 'gratitude', 'fitness'],
    wordCount: 142,
  },
  {
    id: 2,
    date: new Date('2025-03-19'),
    mood: '😄',
    title: 'Reflecting on Q1 goals',
    content: "Q1 is almost done and I'm actually surprised at how much we've achieved. Revenue is up 18%, the team is gelling really well, and I've maintained my habit streaks. There's still work to do but I feel proud of the progress...",
    tags: ['reflection', 'business', 'goals'],
    wordCount: 203,
  },
  {
    id: 3,
    date: new Date('2025-03-18'),
    mood: '😐',
    title: 'Navigating a tough decision',
    content: "Had to make a difficult call today about the product roadmap. The team is split on which direction to take. I keep going back and forth but I know I need to decide soon. The uncertainty is mentally draining...",
    tags: ['decisions', 'stress', 'leadership'],
    wordCount: 87,
  },
]

const prompts = [
  "What am I most grateful for today?",
  "What's one thing I want to improve tomorrow?",
  "What made me smile today?",
  "What was today's biggest challenge and what did I learn?",
  "What progress did I make toward my goals today?",
]

export default function JournalPage() {
  const [writing, setWriting] = useState(false)
  const [content, setContent] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Journal" subtitle="Reflect, grow, and capture your story" />
      <main className="flex-1 p-8 space-y-6">

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Writing area */}
          <div className="lg:col-span-2 space-y-4">
            {!writing ? (
              <Card className="border-2 border-dashed border-thrive-purple/20 hover:border-thrive-purple/40 transition-colors cursor-pointer"
                onClick={() => setWriting(true)}>
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-thrive-purple-soft flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-thrive-purple" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">Write today&apos;s entry</h3>
                  <p className="text-sm text-gray-400">Click to start writing · {formatDate(new Date())}</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(new Date())}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setWriting(false)}>Cancel</Button>
                      <Button size="sm">Save entry</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    type="text"
                    placeholder="Give this entry a title..."
                    className="w-full text-lg font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none border-b border-gray-100 pb-3"
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={selectedPrompt || "What's on your mind today?"}
                    className="w-full text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none resize-none leading-relaxed"
                    rows={12}
                    autoFocus
                  />
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex gap-1">
                      {['😄', '😊', '😐', '😔', '😞'].map(e => (
                        <button key={e} className="text-xl hover:scale-125 transition-transform">{e}</button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{content.split(' ').filter(Boolean).length} words</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Past entries */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Recent Entries</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-400">
                  <Search className="w-3.5 h-3.5" />
                  Search entries
                </div>
              </div>
              <div className="space-y-3">
                {entries.map((entry) => (
                  <Card key={entry.id} hover>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5">{entry.mood}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900">{entry.title}</h4>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{entry.content}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{formatDate(entry.date)}</span>
                            <span className="text-xs text-gray-300">·</span>
                            <span className="text-xs text-gray-400">{entry.wordCount} words</span>
                            {entry.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-[10px]">#{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Prompts */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-thrive-purple" />
                  <CardTitle>Writing Prompts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => { setSelectedPrompt(prompt); setWriting(true) }}
                      className="w-full text-left text-sm text-gray-600 p-3 rounded-xl bg-gray-50 hover:bg-thrive-purple-soft hover:text-thrive-purple transition-all leading-snug"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Journal Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: 'Entries this month', value: '18' },
                    { label: 'Current streak', value: '12 days' },
                    { label: 'Total words written', value: '24,380' },
                    { label: 'Avg entry length', value: '136 words' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{s.label}</span>
                      <span className="text-sm font-bold text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood correlation */}
            <Card className="bg-gradient-to-br from-thrive-purple-soft to-thrive-blue-soft border-thrive-purple/10">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-thrive-pink" />
                  <span className="text-sm font-semibold text-gray-700">Mood Insight</span>
                </div>
                <p className="text-sm text-gray-600">
                  On days you journal, your <strong>average mood is 0.8 points higher</strong>. Writing truly helps you thrive.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
