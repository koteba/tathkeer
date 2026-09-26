import { useEffect, useState } from 'react'
import { RotateCcw, ChevronDown } from 'lucide-react'
import { useCounter } from '../hooks/useCounter'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { tasbeehOptions, goalPresets } from '../data/tasbeehOptions'
import { recordActivity } from '../utils/activity'
import StatsChart from './StatsChart'
import GeometricDivider from './GeometricDivider'

export default function TasbeehCounter() {
  const [dhikrId, setDhikrId] = useLocalStorage('tathkeer:tasbeeh:dhikr', 'istighfar')
  const [goal, setGoal] = useLocalStorage('tathkeer:tasbeeh:goal', 33)
  const { count, increment, resetCurrent, todayTotal, weekTotal, last7Days } = useCounter(dhikrId)
  const [customGoal, setCustomGoal] = useState('')
  const [justReached, setJustReached] = useState(false)
  const [tapPulse, setTapPulse] = useState(false)

  const dhikr = tasbeehOptions.find((d) => d.id === dhikrId) ?? tasbeehOptions[0]
  const percent = goal > 0 ? Math.min((count / goal) * 100, 100) : 0

  useEffect(() => {
    if (goal > 0 && count > 0 && count % goal === 0) {
      setJustReached(true)
      recordActivity()
      const t = setTimeout(() => setJustReached(false), 1800)
      return () => clearTimeout(t)
    }
  }, [count, goal])

  const handleTap = () => {
    increment()
    setTapPulse(true)
    setTimeout(() => setTapPulse(false), 280)
    if (navigator.vibrate) navigator.vibrate(8)
  }

  const applyCustomGoal = () => {
    const n = parseInt(customGoal, 10)
    if (n > 0) {
      setGoal(n)
      setCustomGoal('')
    }
  }

  return (
    <div className="flex flex-col items-center animate-fadeUp">
      <div className="relative w-full max-w-xs">
        <select
          value={dhikrId}
          onChange={(e) => setDhikrId(e.target.value)}
          className="w-full appearance-none text-center rounded-full border border-gold/30 bg-transparent py-2.5 px-5 font-display text-lg text-ink dark:text-ink-light focus:outline-none"
        >
          {tasbeehOptions.map((opt) => (
            <option key={opt.id} value={opt.id} className="text-ink bg-parchment dark:bg-night dark:text-ink-light">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep dark:text-gold" />
      </div>

      <div className="relative my-10 flex items-center justify-center">
        <svg width="240" height="240" viewBox="0 0 240 240" className="-rotate-90">
          <circle cx="120" cy="120" r="106" fill="none" stroke="currentColor" strokeWidth="3" className="text-ink/10 dark:text-ink-light/10" />
          <circle
            cx="120"
            cy="120"
            r="106"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 106}
            strokeDashoffset={2 * Math.PI * 106 * (1 - percent / 100)}
            className="transition-all duration-300 ease-out"
          />
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C6A15B" />
              <stop offset="100%" stopColor="#D9B968" />
            </linearGradient>
          </defs>
        </svg>

        <button
          onClick={handleTap}
          aria-label={`اضغط للتسبيح: ${dhikr.label}`}
          className={`absolute flex h-[200px] w-[200px] flex-col items-center justify-center rounded-full bg-gradient-to-b from-night/95 to-night-deep dark:from-night dark:to-night-deep text-ink-light shadow-[0_0_40px_-8px_rgba(198,161,91,0.45)] transition-transform active:scale-95 ${
            tapPulse ? 'animate-pulseTap' : ''
          } ${justReached ? 'animate-glow ring-2 ring-gold' : ''}`}
        >
          <span className="font-display text-5xl tabular-nums">{count}</span>
          <span className="mt-1 text-xs text-ink-light/60 font-body">من {goal}</span>
        </button>
      </div>

      {justReached && (
        <p className="-mt-6 mb-4 text-sm text-gold-deep dark:text-gold-bright font-body animate-fadeUp">
          أتممتَ الهدف، بارك الله فيك ✦
        </p>
      )}

      <div className="flex items-center gap-2">
        {goalPresets.map((g) => (
          <button
            key={g}
            onClick={() => setGoal(g)}
            className={`rounded-full px-4 py-1.5 text-sm font-body border transition-colors ${
              goal === g
                ? 'border-gold/60 bg-gold/15 text-gold-deep dark:text-gold-bright'
                : 'border-ink/10 dark:border-ink-light/10 text-ink/55 dark:text-ink-light/50'
            }`}
          >
            {g}
          </button>
        ))}
        <input
          type="number"
          min="1"
          placeholder="تخصيص"
          value={customGoal}
          onChange={(e) => setCustomGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyCustomGoal()}
          onBlur={applyCustomGoal}
          className="w-20 rounded-full border border-ink/10 dark:border-ink-light/10 bg-transparent px-3 py-1.5 text-sm text-center font-body text-ink dark:text-ink-light focus:outline-none focus:border-gold/50"
        />
        <button
          onClick={resetCurrent}
          aria-label="إعادة تصفير العداد"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 dark:border-ink-light/10 text-ink/50 dark:text-ink-light/45 hover:text-gold-deep hover:border-gold/40 transition-colors"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <GeometricDivider className="w-full max-w-sm" />

      <div className="w-full max-w-sm">
        <div className="flex justify-between text-sm font-body text-ink/60 dark:text-ink-light/55 mb-4">
          <span>
            اليوم: <span className="text-gold-deep dark:text-gold-bright font-medium">{todayTotal}</span>
          </span>
          <span>
            هذا الأسبوع: <span className="text-gold-deep dark:text-gold-bright font-medium">{weekTotal}</span>
          </span>
        </div>
        <StatsChart data={last7Days} />
      </div>
    </div>
  )
}
