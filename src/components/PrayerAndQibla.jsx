import { useEffect } from 'react'
import { MapPin, LocateFixed } from 'lucide-react'
import { useGeolocation } from '../hooks/useGeolocation'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import PrayerTimesCard from './PrayerTimesCard'
import QiblaCompass from './QiblaCompass'
import GeometricDivider from './GeometricDivider'

export default function PrayerAndQibla() {
  const { coords, status, request } = useGeolocation()
  const { timings, status: timingsStatus } = usePrayerTimes(coords)

  useEffect(() => {
    request()
    // نطلب الموقع مرة واحدة عند فتح هذا القسم فقط
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto max-w-xl animate-fadeUp">
      <p className="text-center text-sm text-gold-deep dark:text-gold font-body mb-6">
        أوقات الصلاة واتجاه القبلة
      </p>

      {status === 'idle' || status === 'loading' ? (
        <div className="flex flex-col items-center gap-3 py-14 text-ink/50 dark:text-ink-light/45 font-body text-sm text-center">
          <MapPin className="animate-pulse" size={22} />
          جارٍ تحديد موقعك لحساب الأوقات والقبلة بدقة...
        </div>
      ) : status === 'denied' || status === 'unsupported' ? (
        <div className="flex flex-col items-center gap-4 py-14 text-center">
          <p className="text-sm text-ink/55 dark:text-ink-light/50 font-body max-w-xs">
            لحساب أوقات الصلاة الدقيقة واتجاه القبلة، يحتاج التطبيق إلى إذن الوصول لموقعك. لن يُستخدم موقعك لأي غرض آخر.
          </p>
          <button
            onClick={request}
            className="flex items-center gap-2 rounded-full bg-gold/15 border border-gold/40 px-5 py-2.5 text-sm font-body text-gold-deep dark:text-gold-bright hover:bg-gold/25 transition-colors"
          >
            <LocateFixed size={15} /> السماح بالوصول للموقع
          </button>
        </div>
      ) : (
        <>
          {timingsStatus === 'loading' && (
            <p className="text-center text-sm text-ink/45 dark:text-ink-light/40 font-body py-6">
              جارٍ جلب أوقات الصلاة...
            </p>
          )}
          {timingsStatus === 'error' && (
            <p className="text-center text-sm text-red-400 font-body py-6">تعذّر جلب أوقات الصلاة، حاول لاحقًا.</p>
          )}
          {timingsStatus === 'ready' && <PrayerTimesCard timings={timings} />}

          <GeometricDivider />

          <QiblaCompass coords={coords} />

          <p className="mt-8 text-center text-[11px] text-ink/35 dark:text-ink-light/30 font-body">
            طريقة الحساب: أم القرى (مكة المكرمة)، عبر خدمة Aladhan. اتجاه القبلة تقريبي بحسب مستشعرات جهازك.
          </p>
        </>
      )}
    </div>
  )
}
