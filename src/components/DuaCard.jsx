import { useState } from 'react'
import { Copy, Check, Shuffle } from 'lucide-react'
import { duas, getDayIndex } from '../data/duas'
import GeometricDivider from './GeometricDivider'

export default function DuaCard() {
  const [index, setIndex] = useState(getDayIndex())
  const [copied, setCopied] = useState(false)
  const dua = duas[index]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dua.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* تجاهل فشل النسخ (متصفحات لا تدعمه) */
    }
  }

  const handleNext = () => {
    setIndex((i) => (i + 1) % duas.length)
    setCopied(false)
  }

  return (
    <div className="mx-auto max-w-xl animate-fadeUp">
      <p className="text-center text-sm text-gold-deep dark:text-gold font-body mb-4">دعاء اليوم</p>

      <div className="rounded-3xl border border-gold/25 bg-gradient-to-b from-gold/[0.06] to-transparent px-6 py-10 sm:px-10 text-center">
        <p key={index} className="font-display text-2xl sm:text-3xl leading-loose text-ink dark:text-ink-light animate-fadeUp">
          {dua.text}
        </p>
        <p className="mt-5 text-xs text-ink/45 dark:text-ink-light/40 font-body">{dua.source}</p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-full border border-ink/10 dark:border-ink-light/10 px-4 py-2 text-sm font-body text-ink/70 dark:text-ink-light/65 hover:border-gold/40 hover:text-gold-deep dark:hover:text-gold-bright transition-colors"
        >
          {copied ? <Check size={15} className="text-gold-deep dark:text-gold-bright" /> : <Copy size={15} />}
          {copied ? 'تم النسخ' : 'نسخ الدعاء'}
        </button>
        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-full bg-gold/15 border border-gold/40 px-4 py-2 text-sm font-body text-gold-deep dark:text-gold-bright hover:bg-gold/25 transition-colors"
        >
          <Shuffle size={15} />
          دعاء آخر
        </button>
      </div>

      <GeometricDivider />
      <p className="text-center text-xs text-ink/40 dark:text-ink-light/35 font-body">
        يتغيّر دعاء اليوم تلقائيًا كل يوم، ويمكنك تصفّح بقية الأدعية يدويًا
      </p>
    </div>
  )
}
