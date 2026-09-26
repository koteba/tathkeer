import { useEffect, useState } from 'react'
import { Moon } from 'lucide-react'

function getGreeting(hour) {
  if (hour >= 4 && hour < 12) return 'صباحكم خير وذكر'
  if (hour >= 12 && hour < 17) return 'نهاركم مبارك'
  if (hour >= 17 && hour < 20) return 'مساؤكم أنس وذكر'
  return 'ليلتكم عامرة بالذكر'
}

export default function Header() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  const dateLabel = now.toLocaleDateString('ar-SA-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <header className="pt-10 pb-2 text-center">
      <div className="inline-flex items-center gap-2 text-gold-deep dark:text-gold mb-3">
        <Moon size={18} strokeWidth={1.5} />
        <span className="text-sm font-body tracking-normal">{dateLabel}</span>
      </div>
      <h1 className="font-display text-5xl sm:text-6xl leading-tight text-ink dark:text-ink-light">
        تذكير
      </h1>
      <p className="mt-3 text-base sm:text-lg text-ink/70 dark:text-ink-light/70 font-body">
        {getGreeting(now.getHours())}
      </p>
    </header>
  )
}
