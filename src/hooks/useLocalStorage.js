import { useState, useEffect, useCallback } from 'react'

/**
 * يخزن قيمة في localStorage ويبقيها متزامنة مع الحالة.
 * آمن للعمل حتى لو تعذّر الوصول إلى localStorage (وضع خاص، إلخ).
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // تجاهل أخطاء التخزين (مثل وضع التصفح الخاص)
    }
  }, [key, value])

  const reset = useCallback(() => setValue(initialValue), [initialValue])

  return [value, setValue, reset]
}
