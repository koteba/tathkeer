export default function StatsChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex items-end justify-between gap-2 h-24 px-1" role="img" aria-label="إحصائية التسبيح لآخر 7 أيام">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1">
          <div className="w-full flex items-end justify-center h-16">
            <div
              className="w-full max-w-[18px] rounded-t-md bg-gradient-to-t from-gold-deep to-gold-bright transition-all duration-700 ease-out"
              style={{ height: `${Math.max((d.value / max) * 100, d.value > 0 ? 6 : 2)}%` }}
              title={`${d.value}`}
            />
          </div>
          <span className="text-[10px] text-ink/45 dark:text-ink-light/40 font-body">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
