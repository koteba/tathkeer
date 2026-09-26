const MECCA_LAT = 21.4225
const MECCA_LON = 39.8262

function toRad(d) {
  return (d * Math.PI) / 180
}

function toDeg(r) {
  return (r * 180) / Math.PI
}

/**
 * يحسب زاوية اتجاه القبلة (بالدرجات من الشمال، باتجاه الشرق) انطلاقًا من
 * إحداثيات المستخدم، باستخدام معادلة الاتجاه الأعظمي (great-circle bearing).
 */
export function getQiblaBearing(lat, lon) {
  const φ1 = toRad(lat)
  const λ1 = toRad(lon)
  const φ2 = toRad(MECCA_LAT)
  const λ2 = toRad(MECCA_LON)
  const Δλ = λ2 - λ1

  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)

  const θ = toDeg(Math.atan2(y, x))
  return (θ + 360) % 360
}

const DIRECTIONS = [
  'الشمال',
  'الشمال الشرقي',
  'الشرق',
  'الجنوب الشرقي',
  'الجنوب',
  'الجنوب الغربي',
  'الغرب',
  'الشمال الغربي',
]

export function bearingToArabicDirection(bearing) {
  const idx = Math.round(bearing / 45) % 8
  return DIRECTIONS[idx]
}
