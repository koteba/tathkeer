import { useEffect, useState } from 'react'
import { Compass as CompassIcon, Navigation2 } from 'lucide-react'
import { getQiblaBearing, bearingToArabicDirection } from '../utils/qibla'

export default function QiblaCompass({ coords }) {
  const [heading, setHeading] = useState(null)
  const [liveError, setLiveError] = useState(null)

  useEffect(() => {
    function handleOrientation(e) {
      let h = null
      if (typeof e.webkitCompassHeading === 'number') {
        h = e.webkitCompassHeading
      } else if (typeof e.alpha === 'number') {
        h = 360 - e.alpha
      }
      if (h !== null) setHeading(h)
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation, true)
    window.addEventListener('deviceorientation', handleOrientation, true)
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true)
      window.removeEventListener('deviceorientation', handleOrientation, true)
    }
  }, [])

  const enableLiveCompass = async () => {
    setLiveError(null)
    try {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        const res = await DeviceOrientationEvent.requestPermission()
        if (res !== 'granted') {
          setLiveError('لم يُسمح بالوصول إلى بوصلة الجهاز')
        }
      }
    } catch {
      setLiveError('البوصلة الحيّة غير مدعومة على هذا الجهاز')
    }
  }

  if (!coords) return null

  const bearing = getQiblaBearing(coords.lat, coords.lon)
  const directionLabel = bearingToArabicDirection(bearing)
  const arrowRotation = heading !== null ? bearing - heading : bearing

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-56 h-56 max-w-full">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-ink/15 dark:text-ink-light/15"
          />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="8"
              x2="100"
              y2="20"
              stroke="currentColor"
              strokeWidth="2"
              className="text-ink/25 dark:text-ink-light/25"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}
          <text x="100" y="34" textAnchor="middle" className="fill-ink/45 dark:fill-ink-light/40 text-[10px] font-body">
            شمال
          </text>
        </svg>

        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${arrowRotation}deg)` }}
        >
          <Navigation2 size={68} className="text-gold-deep dark:text-gold-bright" fill="currentColor" strokeWidth={1} />
        </div>
      </div>

      <p className="mt-4 font-body text-sm text-ink/70 dark:text-ink-light/65 text-center">
        اتجاه القبلة:{' '}
        <span className="text-gold-deep dark:text-gold-bright font-medium tabular-nums">{Math.round(bearing)}°</span>{' '}
        من الشمال ({directionLabel})
      </p>

      {heading === null ? (
        <button
          onClick={enableLiveCompass}
          className="mt-3 flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-xs font-body text-gold-deep dark:text-gold-bright hover:bg-gold/5 transition-colors"
        >
          <CompassIcon size={14} /> تفعيل بوصلة الجهاز الحيّة
        </button>
      ) : (
        <p className="mt-3 text-xs text-ink/40 dark:text-ink-light/35 font-body">
          البوصلة الحيّة مفعّلة — وجّه أعلى جهازك نحو السهم
        </p>
      )}
      {liveError && <p className="mt-2 text-xs text-red-400 font-body">{liveError}</p>}
    </div>
  )
}
