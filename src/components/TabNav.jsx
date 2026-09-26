export default function TabNav({ tabs, active, onChange, className = '' }) {
  return (
    <nav
      className={`flex items-center gap-1 sm:gap-2 overflow-x-auto justify-start sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex shrink-0 items-center gap-1.5 px-3 sm:px-4 py-2 text-sm sm:text-base font-body transition-colors duration-300 ${
              isActive
                ? 'text-gold-deep dark:text-gold-bright'
                : 'text-ink/50 dark:text-ink-light/45 hover:text-ink/80 dark:hover:text-ink-light/80'
            }`}
          >
            {tab.icon && <tab.icon size={16} strokeWidth={1.75} />}
            <span>{tab.label}</span>
            {isActive && (
              <span className="absolute -bottom-[9px] right-1/2 translate-x-1/2 h-[2px] w-6 rounded-full bg-gold" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
