import StreakCard from './StreakCard'
import QuranTracker from './QuranTracker'
import GeometricDivider from './GeometricDivider'

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-xl animate-fadeUp">
      <p className="text-center text-sm text-gold-deep dark:text-gold font-body mb-6">تقدّمك ومتتاليتك</p>
      <StreakCard />

      <GeometricDivider />

      <p className="text-center text-sm text-gold-deep dark:text-gold font-body mb-6">ختمة القرآن والورد اليومي</p>
      <QuranTracker />
    </div>
  )
}
