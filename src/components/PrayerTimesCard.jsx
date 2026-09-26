import { useEffect, useState } from 'react'
import { PRAYER_ORDER, PRAYER_LABELS } from '../hooks/usePrayerTimes'

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export default function PrayerTimesCard({ timings }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(i)
  }, [])

  if (!timings) return null

  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  let nextKey = PRAYER_ORDER.find((k) => timeToMinutes(timings[k]) > nowMinutes)
  if (!nextKey) nextKey = PRAYER_ORDER[0]

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
      {PRAYER_ORDER.map((key) => {
        const isNext = key === nextKey
        return (
          <div
            key={key}
            className={`flex flex-col items-center gap-1 rounded-2xl border px-1.5 py-3 transition-colors ${
              isNext ? 'border-gold/50 bg-gold/10' : 'border-ink/10 dark:border-ink-light/10'
            }`}
          >
            <span
              className={`text-xs font-body ${
                isNext ? 'text-gold-deep dark:text-gold-bright' : 'text-ink/55 dark:text-ink-light/50'
              }`}
            >
              {PRAYER_LABELS[key]}
            </span>
            <span
              className={`text-sm font-medium tabular-nums font-body ${
                isNext ? 'text-gold-deep dark:text-gold-bright' : 'text-ink dark:text-ink-light'
              }`}
            >
              {timings[key]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
