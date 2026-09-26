import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { recordActivity } from '../utils/activity'

export const TOTAL_PAGES = 604 // عدد صفحات المصحف المدني القياسي

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

export function useQuranProgress() {
  const [pagesRead, setPagesRead] = useLocalStorage('tathkeer:quran:pagesRead', 0)
  const [khatmaCount, setKhatmaCount] = useLocalStorage('tathkeer:quran:khatmaCount', 0)
  const [dailyGoal, setDailyGoal] = useLocalStorage('tathkeer:quran:dailyGoal', 4)
  const [history, setHistory] = useLocalStorage('tathkeer:quran:history', {})

  const addPages = useCallback(
    (n) => {
      const amount = Math.floor(n)
      if (!amount || amount <= 0) return

      setPagesRead((p) => {
        let next = p + amount
        while (next >= TOTAL_PAGES) {
          next -= TOTAL_PAGES
          setKhatmaCount((k) => k + 1)
        }
        return next
      })

      setHistory((h) => {
        const key = todayKey()
        const next = { ...h, [key]: (h[key] || 0) + amount }
        const keys = Object.keys(next).sort()
        if (keys.length > 30) delete next[keys[0]]
        return next
      })

      recordActivity()
    },
    [setPagesRead, setKhatmaCount, setHistory]
  )

  const todayPages = history[todayKey()] || 0
  const todayGoalMet = dailyGoal > 0 && todayPages >= dailyGoal

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

  const percent = Math.min(Math.round((pagesRead / TOTAL_PAGES) * 100), 100)

  return {
    pagesRead,
    khatmaCount,
    dailyGoal,
    setDailyGoal,
    todayPages,
    todayGoalMet,
    last7Days,
    percent,
    totalPages: TOTAL_PAGES,
    addPages,
  }
}
