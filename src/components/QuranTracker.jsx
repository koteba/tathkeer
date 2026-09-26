import { useState } from 'react'
import { BookMarked, Plus, Check } from 'lucide-react'
import { useQuranProgress } from '../hooks/useQuranProgress'
import StatsChart from './StatsChart'
import GeometricDivider from './GeometricDivider'

export default function QuranTracker() {
  const {
    pagesRead,
    khatmaCount,
    dailyGoal,
    setDailyGoal,
    todayPages,
    todayGoalMet,
    last7Days,
    percent,
    totalPages,
    addPages,
  } = useQuranProgress()

  const [customPages, setCustomPages] = useState('')
  const [goalInput, setGoalInput] = useState('')

  const logCustom = () => {
    const n = parseInt(customPages, 10)
    if (n > 0) {
      addPages(n)
      setCustomPages('')
    }
  }

  const applyGoal = () => {
    const n = parseInt(goalInput, 10)
    if (n > 0) {
      setDailyGoal(n)
      setGoalInput('')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 rounded-3xl border border-gold/25 bg-gradient-to-b from-gold/[0.06] to-transparent px-5 sm:px-6 py-7">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep dark:text-gold-bright">
          <BookMarked size={24} strokeWidth={1.75} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-body text-sm text-ink/60 dark:text-ink-light/55">
            ختمتك الحالية: {pagesRead} من {totalPages} صفحة
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-ink/10 dark:bg-ink-light/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-l from-gold to-gold-bright transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-ink/45 dark:text-ink-light/40 font-body">
            {percent}% — ختمات مكتملة:{' '}
            <span className="text-gold-deep dark:text-gold-bright font-medium tabular-nums">{khatmaCount}</span>
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-sm font-body text-ink/60 dark:text-ink-light/55">
        <span>
          وردك اليوم:{' '}
          <span className={todayGoalMet ? 'text-gold-deep dark:text-gold-bright font-medium' : ''}>
            {todayPages}/{dailyGoal} صفحة
          </span>
        </span>
        {todayGoalMet && <Check size={14} className="text-gold-deep dark:text-gold-bright" />}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => addPages(1)}
          className="rounded-full border border-gold/30 px-4 py-2 text-sm font-body text-gold-deep dark:text-gold-bright hover:bg-gold/5 transition-colors"
        >
          + صفحة واحدة
        </button>
        <button
          onClick={() => addPages(dailyGoal)}
          className="rounded-full bg-gold/15 border border-gold/40 px-4 py-2 text-sm font-body text-gold-deep dark:text-gold-bright hover:bg-gold/25 transition-colors"
        >
          + إنجاز وردي ({dailyGoal})
        </button>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="1"
            placeholder="عدد مخصص"
            value={customPages}
            onChange={(e) => setCustomPages(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && logCustom()}
            className="w-24 rounded-full border border-ink/10 dark:border-ink-light/10 bg-transparent px-3 py-2 text-sm text-center font-body text-ink dark:text-ink-light focus:outline-none focus:border-gold/50"
          />
          <button
            onClick={logCustom}
            aria-label="تسجيل الصفحات"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 dark:border-ink-light/10 text-ink/50 dark:text-ink-light/45 hover:text-gold-deep hover:border-gold/40 transition-colors"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      <GeometricDivider />

      <div>
        <p className="text-sm text-ink/50 dark:text-ink-light/45 font-body mb-3">قراءتك خلال آخر 7 أيام (صفحات)</p>
        <StatsChart data={last7Days} />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="text-xs text-ink/45 dark:text-ink-light/40 font-body">هدفك اليومي: {dailyGoal} صفحة</span>
        <input
          type="number"
          min="1"
          placeholder="تغيير الهدف"
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyGoal()}
          onBlur={applyGoal}
          className="w-24 rounded-full border border-ink/10 dark:border-ink-light/10 bg-transparent px-3 py-1.5 text-xs text-center font-body text-ink dark:text-ink-light focus:outline-none focus:border-gold/50"
        />
      </div>
    </div>
  )
}
