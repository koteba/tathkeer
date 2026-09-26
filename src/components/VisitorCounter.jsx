import { useEffect, useRef, useState } from 'react'
import { Users } from 'lucide-react'
import { useVisitorCount } from '../hooks/useVisitorCount'

function useCountUp(target) {
  const [display, setDisplay] = useState(target ?? 0)
  const prevRef = useRef(target ?? 0)

  useEffect(() => {
    if (target === null || target === undefined) return
    const from = prevRef.current
    const to = target
    if (from === to) {
      setDisplay(to)
      return
    }
    const duration = 700
    const start = performance.now()

    let frame
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    prevRef.current = to
    return () => cancelAnimationFrame(frame)
  }, [target])

  return display
}

export default function VisitorCounter() {
  const { count, isLive, loading } = useVisitorCount()
  const display = useCountUp(count)

  if (loading && count === null) return null

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/[0.05] text-xs sm:text-sm font-body text-ink/60 dark:text-ink-light/55"
      title={isLive ? 'عدد زوار تذكير حتى الآن' : 'عدد الزيارات على هذا الجهاز'}
    >
      <Users size={14} className="text-gold-deep dark:text-gold shrink-0" strokeWidth={1.75} />
      <span>
        زارَ تذكير{' '}
        <span className="text-gold-deep dark:text-gold-bright font-medium tabular-nums">
          {(display ?? 0).toLocaleString('ar-EG')}
        </span>{' '}
        شخصًا
      </span>
    </div>
  )
}
