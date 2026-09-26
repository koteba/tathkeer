// سجل نشاط يومي مشترك تعتمد عليه ميزة "متتالية الالتزام": أي إنجاز حقيقي
// (إتمام فئة أذكار، بلوغ هدف السبحة، تسجيل ورد قرآني) يُسجَّل هنا كيوم "ملتزم".

const LOG_KEY = 'tathkeer:activity:log'

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

function readLog() {
  try {
    const raw = localStorage.getItem(LOG_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeLog(log) {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(log))
  } catch {
    /* تجاهل فشل التخزين */
  }
}

/** يسجّل اليوم الحالي كيوم ملتزم (إن لم يكن مسجلاً) ويبلّغ الواجهات المهتمة بالتحديث */
export function recordActivity() {
  const log = readLog()
  const key = todayKey()
  if (log[key]) return
  log[key] = true
  writeLog(log)
  try {
    window.dispatchEvent(new CustomEvent('tathkeer:activity-updated'))
  } catch {
    /* تجاهل */
  }
}

export function getActivityLog() {
  return readLog()
}
