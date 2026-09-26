import { useCallback, useEffect, useState } from 'react'
import { getActivityLog, todayKey } from '../utils/activity'

export const BADGE_MILESTONES = [3, 7, 14, 30, 60, 100, 365]

export const BADGE_LABELS = {
  3: 'بداية الطريق',
  7: 'أسبوع كامل',
  14: 'أسبوعان',
  30: 'شهر ملتزم',
  60: 'شهران',
  100: 'مئة يوم',
  365: 'سنة كاملة',
}

function computeCurrentStreak(log) {
  const now = new Date()
  const cursor = new Date(now)
  let streak = 0

  // إن لم يُنجز شيء اليوم بعد، نبدأ العدّ من الأمس حتى لا تُكسر المتتالية بغير حق
  if (!log[todayKey(cursor)]) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (log[todayKey(cursor)]) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function syncLongestStreak(current) {
  try {
    const stored = Number(localStorage.getItem('tathkeer:streak:longest') || 0)
    const longest = Math.max(stored, current)
    if (longest > stored) localStorage.setItem('tathkeer:streak:longest', String(longest))
    return longest
  } catch {
    return current
  }
}

export function useStreak() {
  const [log, setLog] = useState(() => getActivityLog())

  const refresh = useCallback(() => setLog(getActivityLog()), [])

  useEffect(() => {
    window.addEventListener('tathkeer:activity-updated', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener('tathkeer:activity-updated', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [refresh])

  const currentStreak = computeCurrentStreak(log)
  const longestStreak = syncLongestStreak(currentStreak)
  const activeToday = Boolean(log[todayKey()])
  const totalActiveDays = Object.keys(log).length

  const badges = BADGE_MILESTONES.map((days) => ({
    days,
    label: BADGE_LABELS[days],
    unlocked: longestStreak >= days,
  }))

  return { currentStreak, longestStreak, activeToday, totalActiveDays, badges }
}
