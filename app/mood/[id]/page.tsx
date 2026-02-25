'use client'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const fetchCache = 'force-no-store'
export const revalidate = 0

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import nextDynamic from 'next/dynamic'
import { SuggestionPanel } from '@/components/SuggestionPanel'
import { MoodData } from '@/lib/moodData'
import { Mood, MoodSuggestion } from '@/types/mood'
import { useMoodStore } from '@/lib/useMoodStore'
import { ThemeToggle } from '@/components/ThemeToggle'
import reflectiveMoods from '@/lib/reflectiveMoods'
import { getTraditionalMoodId } from '@/lib/moodMapping'

const OrbVisualizer = nextDynamic(
  () => import('@/components/OrbVisualizer').then(m => m.OrbVisualizer),
  { ssr: false }
)

interface MoodWithMeta extends Mood {
  traditionalId?: string
  spotifyPlaylistId?: string
}

export default function MoodPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams?: { moods?: string }
}) {

  const [moodData, setMoodData] = useState<MoodWithMeta[]>([])
  const [suggestions, setSuggestions] = useState<MoodSuggestion | null>(null)
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0)

  const addMood = useMoodStore(state => state.addMood)

  useEffect(() => {

    const moodIds =
      searchParams?.moods
        ? searchParams.moods.split(',')
        : [params.id]

    const moodsData = moodIds
      .map(id => {

        const reflectiveMood = reflectiveMoods.find(m => m.id === id)

        if (reflectiveMood) {
          const traditionalId = getTraditionalMoodId(id)
          const traditionalMood = MoodData.getMoodById(traditionalId)

          return {
            id: reflectiveMood.id,
            name: reflectiveMood.label,
            emoji: reflectiveMood.label?.charAt(0).toUpperCase() || '✨',
            color: reflectiveMood.color,
            glow: reflectiveMood.glow,
            traditionalId,
            spotifyPlaylistId: traditionalMood?.spotifyPlaylistId,
          } as MoodWithMeta
        }

        return MoodData.getMoodById(id)
      })
      .filter((m): m is MoodWithMeta => Boolean(m))

    setMoodData(moodsData)

    moodIds.forEach(moodId => {
      const moodInfo = moodsData.find(m => m.id === moodId)
      if (moodInfo) {
        addMood({
          mood: moodId,
          emotion: moodInfo.name,
          date: new Date().toDateString(),
          color: moodInfo.color,
        })
      }
    })

  }, [params.id, searchParams?.moods, addMood])


  useEffect(() => {
    if (!moodData.length) return

    const mood = moodData[currentMoodIndex]
    const suggestionId = mood.traditionalId || mood.id
    setSuggestions(MoodData.getSuggestions(suggestionId))

  }, [currentMoodIndex, moodData])


  if (!moodData.length || !suggestions) {
    return (
      <div className="min-h-screen bg-[#0f0720] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const currentMood = moodData[currentMoodIndex]

  return (
    <div className="min-h-screen bg-[#0f0720]">
      <motion.header className="p-6 flex justify-between">
        <Link href="/">
          <ArrowLeft className="text-white" />
        </Link>
        <ThemeToggle />
      </motion.header>

      <main className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

          <OrbVisualizer mood={currentMood} />

          <SuggestionPanel
            suggestions={suggestions}
            mood={currentMood}
            onRefresh={async () => {
              await new Promise(r => setTimeout(r, 300))
              const id = currentMood.traditionalId || currentMood.id
              setSuggestions(MoodData.getSuggestions(id))
            }}
          />

        </div>
      </main>
    </div>
  )
}