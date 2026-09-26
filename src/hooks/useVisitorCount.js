import { useEffect, useState } from 'react'

// حارس على مستوى الوحدة (module) لمنع احتساب أكثر من زيارة واحدة
// لنفس تحميل الصفحة، حتى مع إعادة التصيير في وضع React StrictMode.
let requestedThisLoad = false

const LOCAL_KEY = 'tathkeer:visits:local'
const CACHE_KEY = 'tathkeer:visits:lastSeen'

export function useVisitorCount() {
  const [count, setCount] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? Number(cached) : null
    } catch {
      return null
    }
  })
  const [isLive, setIsLive] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (requestedThisLoad) {
      setLoading(false)
      return
    }
    requestedThisLoad = true

    const fallbackToLocal = () => {
      setIsLive(false)
      try {
        const prev = Number(localStorage.getItem(LOCAL_KEY) || 0)
        const next = prev + 1
        localStorage.setItem(LOCAL_KEY, String(next))
        setCount(next)
      } catch {
        setCount((c) => c ?? 1)
      } finally {
        setLoading(false)
      }
    }

    fetch('/api/visits')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then((data) => {
        if (typeof data.count === 'number' && data.live) {
          setCount(data.count)
          setIsLive(true)
          try {
            localStorage.setItem(CACHE_KEY, String(data.count))
          } catch {
            /* تجاهل */
          }
        } else {
          fallbackToLocal()
        }
      })
      .catch(fallbackToLocal)
      .finally(() => setLoading(false))
  }, [])

  return { count, isLive, loading }
}
