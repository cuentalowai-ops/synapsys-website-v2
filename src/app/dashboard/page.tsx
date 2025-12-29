import { QuickStats } from "./components/QuickStats"
import { ChartsSection } from "./components/ChartsSection"
import { ActivityFeed } from "./components/ActivityFeed"

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gradient-hero dark:text-gray-100">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Monitor your EUDI wallet verification platform performance
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Charts Section */}
      <ChartsSection />

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  )
}

