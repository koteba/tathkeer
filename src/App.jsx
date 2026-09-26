import { useState } from 'react'
import { BookOpen, Fingerprint, Heart, BellRing, Compass, Flame } from 'lucide-react'
import Header from './components/Header'
import TabNav from './components/TabNav'
import GeometricDivider from './components/GeometricDivider'
import DhikrList from './components/DhikrList'
import TasbeehCounter from './components/TasbeehCounter'
import DuaCard from './components/DuaCard'
import ReminderManager from './components/ReminderManager'
import PrayerAndQibla from './components/PrayerAndQibla'
import ProgressPage from './components/ProgressPage'
import VisitorCounter from './components/VisitorCounter'
import { useLocalStorage } from './hooks/useLocalStorage'

const TABS = [
  { id: 'adhkar', label: 'الأذكار', icon: BookOpen },
  { id: 'tasbeeh', label: 'السبحة', icon: Fingerprint },
  { id: 'dua', label: 'دعاء اليوم', icon: Heart },
  { id: 'prayer', label: 'الصلاة', icon: Compass },
  { id: 'progress', label: 'تقدّمي', icon: Flame },
  { id: 'reminders', label: 'التذكيرات', icon: BellRing },
]

export default function App() {
  const [tab, setTab] = useLocalStorage('tathkeer:main-tab', 'adhkar')

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full max-w-2xl px-5 sm:px-6 flex-1">
        <Header />

        <div className="sticky top-0 z-10 -mx-5 sm:-mx-6 px-5 sm:px-6 py-3 mb-2 backdrop-blur-md bg-parchment/70 dark:bg-night/70">
          <TabNav tabs={TABS} active={tab} onChange={setTab} />
        </div>

        <GeometricDivider className="mt-0" />

        <main className="pb-16">
          {tab === 'adhkar' && <DhikrList />}
          {tab === 'tasbeeh' && <TasbeehCounter />}
          {tab === 'dua' && <DuaCard />}
          {tab === 'prayer' && <PrayerAndQibla />}
          {tab === 'progress' && <ProgressPage />}
          {tab === 'reminders' && <ReminderManager />}
        </main>
      </div>

      <footer className="border-t border-ink/10 dark:border-ink-light/10 py-8">
        <div className="mx-auto w-full max-w-2xl px-5 sm:px-6 flex flex-col items-center gap-4">
          <VisitorCounter />
          <p className="text-xs text-ink/35 dark:text-ink-light/30 font-body text-center">
            تذكير — رفيقك اليومي للأذكار والأدعية والاستغفار
          </p>
        </div>
      </footer>
    </div>
  )
}
