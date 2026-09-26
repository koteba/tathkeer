import { useEffect, useRef, useState } from 'react'
import { Sunrise, Sunset, Sun, Moon, Star, Bell, BellRing, Plus, X, RefreshCw } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getLatestCachedPrayerTimes } from '../hooks/usePrayerTimes'
import PrayerCard from './PrayerCard'
import GeometricDivider from './GeometricDivider'

const PRAYER_ID_MAP = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' }

const DEFAULT_REMINDERS = [
  { id: 'adhkar_sabah', title: 'أذكار الصباح', time: '06:00', icon: Sunrise },
  { id: 'fajr', title: 'صلاة الفجر', time: '05:00', icon: Star },
  { id: 'dhuhr', title: 'صلاة الظهر', time: '12:30', icon: Sun },
  { id: 'asr', title: 'صلاة العصر', time: '15:45', icon: Sun },
  { id: 'adhkar_masaa', title: 'أذكار المساء', time: '17:00', icon: Sunset },
  { id: 'maghrib', title: 'صلاة المغرب', time: '18:15', icon: Sunset },
  { id: 'isha', title: 'صلاة العشاء', time: '19:45', icon: Moon },
  { id: 'istighfar', title: 'تذكير بالاستغفار', time: '21:30', icon: Star },
]

function nowHHMM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function ReminderManager() {
  const [times, setTimes] = useLocalStorage(
    'tathkeer:reminders:times',
    Object.fromEntries(DEFAULT_REMINDERS.map((r) => [r.id, r.time]))
  )
  const [customReminders, setCustomReminders] = useLocalStorage('tathkeer:reminders:custom', [])
  const [newText, setNewText] = useState('')
  const [newTime, setNewTime] = useState('20:00')
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )
  const [banner, setBanner] = useState(null)
  const firedRef = useRef(new Set())

  useEffect(() => {
    const check = () => {
      const current = nowHHMM()
      const allReminders = [
        ...DEFAULT_REMINDERS.map((r) => ({ id: r.id, title: r.title, time: times[r.id] ?? r.time })),
        ...customReminders.map((r) => ({ id: r.id, title: r.text, time: r.time })),
      ]
      allReminders.forEach((r) => {
        const fireKey = `${r.id}:${current}`
        if (r.time === current && !firedRef.current.has(fireKey)) {
          firedRef.current.add(fireKey)
          setBanner(r.title)
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try {
              new Notification('تذكير', { body: r.title, icon: undefined })
            } catch {
              /* تجاهل */
            }
          }
          setTimeout(() => setBanner((b) => (b === r.title ? null : b)), 8000)
        }
      })
    }
    check()
    const interval = setInterval(check, 20_000)
    return () => clearInterval(interval)
  }, [times, customReminders])

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  const addCustomReminder = () => {
    const text = newText.trim()
    if (!text) return
    setCustomReminders((list) => [...list, { id: `c_${Date.now()}`, text, time: newTime }])
    setNewText('')
  }

  const removeCustomReminder = (id) => {
    setCustomReminders((list) => list.filter((r) => r.id !== id))
  }

  const syncWithRealTimes = () => {
    const real = getLatestCachedPrayerTimes()
    if (!real) {
      setBanner('لا تتوفر أوقات حقيقية بعد — افتح تبويب «الصلاة» أولًا للسماح بالموقع')
      setTimeout(() => setBanner(null), 5000)
      return
    }
    setTimes((t) => {
      const next = { ...t }
      Object.entries(PRAYER_ID_MAP).forEach(([localId, apiKey]) => {
        if (real[apiKey]) next[localId] = real[apiKey]
      })
      return next
    })
  }

  return (
    <div className="mx-auto max-w-xl animate-fadeUp">
      {banner && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-3 animate-fadeUp">
          <div className="flex items-center gap-2 text-gold-deep dark:text-gold-bright font-body text-sm">
            <BellRing size={16} />
            <span>حان وقت: {banner}</span>
          </div>
          <button onClick={() => setBanner(null)} aria-label="إغلاق" className="text-gold-deep/70 dark:text-gold-bright/70">
            <X size={16} />
          </button>
        </div>
      )}

      {permission !== 'granted' && permission !== 'unsupported' && (
        <button
          onClick={requestPermission}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/40 px-4 py-3 text-sm font-body text-gold-deep dark:text-gold-bright hover:bg-gold/5 transition-colors"
        >
          <Bell size={15} />
          فعّل إشعارات المتصفح لتصلك التذكيرات حتى خارج الصفحة
        </button>
      )}

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-ink/50 dark:text-ink-light/45 font-body">التذكيرات الأساسية</p>
        <button
          onClick={syncWithRealTimes}
          className="flex items-center gap-1.5 text-xs font-body text-gold-deep dark:text-gold-bright hover:underline"
        >
          <RefreshCw size={12} /> مزامنة مع أوقات الصلاة الحقيقية
        </button>
      </div>
      <div className="space-y-2.5">
        {DEFAULT_REMINDERS.map((r) => (
          <PrayerCard
            key={r.id}
            icon={r.icon}
            title={r.title}
            time={times[r.id] ?? r.time}
            onTimeChange={(val) => setTimes((t) => ({ ...t, [r.id]: val }))}
          />
        ))}
      </div>

      <GeometricDivider />

      <p className="text-sm text-ink/50 dark:text-ink-light/45 font-body mb-3">تذكيراتي الخاصة</p>
      <div className="space-y-2.5 mb-4">
        {customReminders.length === 0 && (
          <p className="text-sm text-ink/40 dark:text-ink-light/35 font-body text-center py-4">
            لا توجد تذكيرات خاصة بعد
          </p>
        )}
        {customReminders.map((r) => (
          <PrayerCard
            key={r.id}
            icon={Bell}
            title={r.text}
            time={r.time}
            editableTime={false}
            onDelete={() => removeCustomReminder(r.id)}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="نص التذكير الخاص بك"
          className="flex-1 min-w-0 rounded-full border border-ink/10 dark:border-ink-light/10 bg-transparent px-4 py-2.5 text-sm font-body text-ink dark:text-ink-light focus:outline-none focus:border-gold/50"
        />
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="w-28 rounded-full border border-ink/10 dark:border-ink-light/10 bg-transparent px-3 py-2.5 text-sm font-body text-ink dark:text-ink-light tabular-nums focus:outline-none focus:border-gold/50"
        />
        <button
          onClick={addCustomReminder}
          aria-label="إضافة تذكير"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 border border-gold/40 text-gold-deep dark:text-gold-bright hover:bg-gold/25 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}
