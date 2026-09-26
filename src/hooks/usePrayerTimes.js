import { useEffect, useState } from 'react'

export const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

export const PRAYER_LABELS = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function readCache(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* تجاهل فشل التخزين */
  }
}

/**
 * يجلب أوقات الصلاة الحقيقية لليوم الحالي بناءً على الإحداثيات، عبر خدمة Aladhan
 * (طريقة الحساب: أم القرى)، ويخزّنها محليًا ليوم واحد لتفادي تكرار الطلبات.
 * status: idle | loading | ready | error
 */
export function usePrayerTimes(coords) {
  const [timings, setTimings] = useState(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!coords) return

    const cacheKey = `tathkeer:prayertimes:${coords.lat.toFixed(2)},${coords.lon.toFixed(2)}:${todayKey()}`
    const cached = readCache(cacheKey)
    if (cached) {
      setTimings(cached)
      setStatus('ready')
      return
    }

    setStatus('loading')
    const d = new Date()
    const dateStr = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`

    fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${coords.lat}&longitude=${coords.lon}&method=4`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.code !== 200) throw new Error('استجابة غير صالحة')
        const t = data.data.timings
        const result = Object.fromEntries(PRAYER_ORDER.map((k) => [k, t[k].slice(0, 5)]))
        writeCache(cacheKey, result)
        // نسخة "أحدث" عامة يمكن لمُدير التذكيرات مزامنة أوقاته معها
        writeCache(`tathkeer:prayertimes:latest:${todayKey()}`, result)
        setTimings(result)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [coords])

  return { timings, status }
}

export function getLatestCachedPrayerTimes() {
  return readCache(`tathkeer:prayertimes:latest:${todayKey()}`)
}
