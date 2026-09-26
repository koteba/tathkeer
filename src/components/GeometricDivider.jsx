export default function GeometricDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-8 select-none ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-l from-gold/60 to-transparent" />
      <svg width="22" height="22" viewBox="0 0 24 24" className="text-gold shrink-0">
        <path
          fill="currentColor"
          d="M12 2l2.09 5.26L19.5 8.5l-4.09 3.64L16.5 18 12 14.9 7.5 18l1.09-5.86L4.5 8.5l5.41-1.24L12 2z"
        />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-r from-gold/60 to-transparent" />
    </div>
  )
}
