import { Flame, Award, Lock } from 'lucide-react'
import { useStreak } from '../hooks/useStreak'

export default function StreakCard() {
  const { currentStreak, longestStreak, activeToday, badges } = useStreak()

  return (
    <div>
      <div className="flex flex-col items-center rounded-3xl border border-gold/25 bg-gradient-to-b from-gold/[0.06] to-transparent px-6 py-10 text-center">
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
            activeToday
              ? 'bg-gold/20 text-gold-deep dark:text-gold-bright'
              : 'bg-ink/5 dark:bg-ink-light/5 text-ink/30 dark:text-ink-light/25'
          }`}
        >
          <Flame size={28} strokeWidth={1.75} />
        </span>

        <p className="mt-4 font-display text-4xl text-ink dark:text-ink-light tabular-nums">{currentStreak}</p>
        <p className="text-sm text-ink/55 dark:text-ink-light/50 font-body mt-1">
          {currentStreak > 0 ? 'يومًا متتاليًا من الالتزام' : 'ابدأ اليوم متتاليتك الأولى'}
        </p>

        {!activeToday && (
          <p className="mt-3 text-xs text-gold-deep dark:text-gold-bright font-body max-w-[220px]">
            أتمم فئة أذكار، أو هدف سبحة، أو وردًا من القرآن اليوم لتستمر متتاليتك
          </p>
        )}

        <div className="mt-5 text-xs text-ink/45 dark:text-ink-light/40 font-body">
          أطول متتالية:{' '}
          <span className="text-gold-deep dark:text-gold-bright font-medium tabular-nums">{longestStreak}</span> يومًا
        </div>
      </div>

      <p className="mt-8 mb-3 text-sm text-ink/50 dark:text-ink-light/45 font-body">الشارات</p>
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {badges.map((b) => (
          <div
            key={b.days}
            title={b.label}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-4 text-center transition-opacity ${
              b.unlocked
                ? 'border-gold/40 bg-gold/[0.06]'
                : 'border-ink/10 dark:border-ink-light/10 opacity-50'
            }`}
          >
            {b.unlocked ? (
              <Award size={20} className="text-gold-deep dark:text-gold-bright" strokeWidth={1.75} />
            ) : (
              <Lock size={18} className="text-ink/30 dark:text-ink-light/25" strokeWidth={1.75} />
            )}
            <span className="text-[11px] font-body text-ink/60 dark:text-ink-light/55">{b.days} يوم</span>
          </div>
        ))}
      </div>
    </div>
  )
}
