import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10) // YYYY-MM-DD
}

/**
 * عداد تفاعلي (سبحة) يحفظ:
 * - القيمة الحالية لجلسة الذكر الحالي
 * - سجل الإحصائيات اليومية الإجمالية (كل الأذكار مجتمعة) لآخر 14 يومًا
 */
export function useCounter() {
  const [count, setCount] = useLocalStorage('tathkeer:tasbeeh:current', 0)
  const [history, setHistory] = useLocalStorage('tathkeer:tasbeeh:history', {})

  const increment = useCallback(() => {
    setCount((c) => c + 1)
    setHistory((h) => {
      const key = todayKey()
      const next = { ...h, [key]: (h[key] || 0) + 1 }
      // الاحتفاظ بآخر 30 يوم فقط لتفادي تضخم التخزين
      const keys = Object.keys(next).sort()
      if (keys.length > 30) {
        delete next[keys[0]]
      }
      return next
    })
  }, [setCount, setHistory])

  const resetCurrent = useCallback(() => setCount(0), [setCount])

  const todayTotal = history[todayKey()] || 0

  const weekTotal = useMemo(() => {
    const now = new Date()
    let sum = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      sum += history[todayKey(d)] || 0
    }
    return sum
  }, [history])

  const last7Days = useMemo(() => {
    const now = new Date()
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      days.push({
        label: d.toLocaleDateString('ar-SA', { weekday: 'short' }),
        value: history[todayKey(d)] || 0,
      })
    }
    return days
  }, [history])

  return {
    count,
    increment,
    resetCurrent,
    todayTotal,
    weekTotal,
    last7Days,
  }
}
