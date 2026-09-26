import { useEffect, useMemo } from 'react'
import {
  Check,
  Sunrise,
  Sunset,
  Moon,
  Plane,
  Utensils,
  Home,
  Stethoscope,
  CloudLightning,
  CalendarDays,
  GraduationCap,
  RotateCcw,
} from 'lucide-react'
import { morningAdhkar, eveningAdhkar } from '../data/adhkar'
import {
  sleepAdhkar,
  wakeAdhkar,
  travelAdhkar,
  foodAdhkar,
  homeAdhkar,
  illnessAdhkar,
  distressAdhkar,
  fridayAdhkar,
  knowledgeAdhkar,
} from '../data/extraAdhkar'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { recordActivity } from '../utils/activity'

const CATEGORIES = [
  { id: 'morning', label: 'الصباح', icon: Sunrise, list: morningAdhkar },
  { id: 'evening', label: 'المساء', icon: Sunset, list: eveningAdhkar },
  { id: 'sleep', label: 'النوم', icon: Moon, list: sleepAdhkar },
  { id: 'wake', label: 'الاستيقاظ', icon: Sunrise, list: wakeAdhkar },
  { id: 'travel', label: 'السفر', icon: Plane, list: travelAdhkar },
  { id: 'food', label: 'الطعام', icon: Utensils, list: foodAdhkar },
  { id: 'home', label: 'المنزل', icon: Home, list: homeAdhkar },
  { id: 'illness', label: 'الشفاء', icon: Stethoscope, list: illnessAdhkar },
  { id: 'distress', label: 'الهم والكرب', icon: CloudLightning, list: distressAdhkar },
  { id: 'friday', label: 'الجمعة', icon: CalendarDays, list: fridayAdhkar },
  { id: 'knowledge', label: 'طلب العلم', icon: GraduationCap, list: knowledgeAdhkar },
]

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function DhikrItem({ dhikr, done, onTap, onReset }) {
  const isComplete = done >= dhikr.count
  const remaining = Math.max(dhikr.count - done, 0)

  return (
    <button
      onClick={onTap}
      className={`group w-full text-right rounded-2xl border px-5 py-4 transition-all duration-300 ${
        isComplete
          ? 'border-gold/30 bg-gold/[0.06] dark:bg-gold/[0.08]'
          : 'border-ink/10 dark:border-ink-light/10 bg-white/40 dark:bg-white/[0.03] hover:border-gold/40'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p
          className={`font-display text-lg sm:text-xl leading-loose transition-opacity duration-300 ${
            isComplete ? 'text-ink/45 dark:text-ink-light/40' : 'text-ink dark:text-ink-light'
          }`}
        >
          {dhikr.text}
        </p>
        <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
          {isComplete ? (
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-night animate-fadeUp"
              onClick={(e) => {
                e.stopPropagation()
                onReset()
              }}
              role="button"
              aria-label="إعادة"
              title="إعادة"
            >
              <Check size={18} strokeWidth={2.5} />
            </span>
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 text-gold-deep dark:text-gold text-sm font-body">
              {remaining}
            </span>
          )}
          {dhikr.count > 1 && (
            <span className="text-[11px] text-ink/40 dark:text-ink-light/40 font-body">
              {done}/{dhikr.count}
            </span>
          )}
          {isComplete && (
            <span className="text-[11px] text-ink/40 dark:text-ink-light/40 font-body whitespace-nowrap">
              المتبقي 0
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export default function DhikrList() {
  const [categoryId, setCategoryId] = useLocalStorage('tathkeer:adhkar:category', 'morning')
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0]
  const list = category.list
  const storageKey = `tathkeer:adhkar:progress:${categoryId}:${todayKey()}`
  const [progress, setProgress] = useLocalStorage(storageKey, {})

  const handleTap = (id, max) => {
    setProgress((p) => {
      const current = p[id] || 0
      if (current >= max) return p
      return { ...p, [id]: current + 1 }
    })
  }

  const handleReset = (id) => {
    setProgress((p) => ({ ...p, [id]: 0 }))
  }

  const { completedCount, totalCount, percent } = useMemo(() => {
    const total = list.length
    const completed = list.filter((d) => (progress[d.id] || 0) >= d.count).length
    return {
      completedCount: completed,
      totalCount: total,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    }
  }, [list, progress])

  useEffect(() => {
    if (totalCount > 0 && completedCount === totalCount) {
      recordActivity()
    }
  }, [completedCount, totalCount])

  return (
    <div className="animate-fadeUp">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryId(c.id)}
            className={`flex shrink-0 items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-body border transition-colors whitespace-nowrap ${
              categoryId === c.id
                ? 'bg-gold/15 border-gold/50 text-gold-deep dark:text-gold-bright'
                : 'border-ink/10 dark:border-ink-light/10 text-ink/55 dark:text-ink-light/50'
            }`}
          >
            <c.icon size={14} /> {c.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-xs font-body text-ink/50 dark:text-ink-light/45">
          <span>
            تبقّى {totalCount - completedCount} من {totalCount}
          </span>
          <span>{percent}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-ink/10 dark:bg-ink-light/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-l from-gold to-gold-bright transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {list.map((dhikr) => (
          <DhikrItem
            key={dhikr.id}
            dhikr={dhikr}
            done={progress[dhikr.id] || 0}
            onTap={() => handleTap(dhikr.id, dhikr.count)}
            onReset={() => handleReset(dhikr.id)}
          />
        ))}
      </div>

      {completedCount === totalCount && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gold-deep dark:text-gold-bright font-body animate-fadeUp">
          <button
            onClick={() => setProgress({})}
            className="flex items-center gap-1.5 hover:underline"
          >
            <RotateCcw size={14} /> أتممت هذه الفئة، إعادة من جديد
          </button>
        </div>
      )}
    </div>
  )
}
