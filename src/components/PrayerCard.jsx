import { Trash2 } from 'lucide-react'

export default function PrayerCard({ icon: Icon, title, time, onTimeChange, onDelete, editableTime = true }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 dark:border-ink-light/10 bg-white/40 dark:bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold-deep dark:text-gold">
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <span className="truncate font-body text-sm sm:text-base text-ink dark:text-ink-light">{title}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {editableTime ? (
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange?.(e.target.value)}
            className="rounded-full border border-ink/10 dark:border-ink-light/10 bg-transparent px-2.5 py-1 text-sm font-body text-ink dark:text-ink-light tabular-nums focus:outline-none focus:border-gold/50"
          />
        ) : (
          <span className="text-sm font-body text-ink/60 dark:text-ink-light/55 tabular-nums">{time}</span>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            aria-label="حذف التذكير"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink/35 dark:text-ink-light/30 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
