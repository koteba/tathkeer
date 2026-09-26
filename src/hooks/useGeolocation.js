import { useCallback, useState } from 'react'

/**
 * يطلب موقع المستخدم عبر متصفحه لحساب أوقات الصلاة الحقيقية واتجاه القبلة.
 * status: idle | loading | granted | denied | unsupported
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null)
  const [status, setStatus] = useState('idle')

  const request = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setStatus('unsupported')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setStatus('granted')
      },
      () => {
        setStatus('denied')
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60 * 60 * 1000 }
    )
  }, [])

  return { coords, status, request }
}
