"use client"

import { LineChart } from "./LineChart"
import { DonutChart } from "./DonutChart"

const weeklyData = [
  { name: "Mon", value: 1240 },
  { name: "Tue", value: 1890 },
  { name: "Wed", value: 2100 },
  { name: "Thu", value: 1780 },
  { name: "Fri", value: 2340 },
  { name: "Sat", value: 1560 },
  { name: "Sun", value: 1980 },
]

const countryData = [
  { name: "Germany", value: 2840 },
  { name: "France", value: 1920 },
  { name: "Spain", value: 1560 },
  { name: "Italy", value: 1340 },
  { name: "Netherlands", value: 980 },
]

export function ChartsSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      {/* Line Chart */}
      <div className="glass-card rounded-2xl border-2 border-coral-200/30 bg-white dark:bg-gray-800 p-6 card-shadow border-coral-blur blur-soft">
        <h3 className="mb-4 text-lg font-semibold text-gradient-teal dark:text-gray-100">
          Weekly Verification Trend
        </h3>
        <LineChart data={weeklyData} />
      </div>

      {/* Donut Chart */}
      <div className="glass-card rounded-2xl border-2 border-teal-200/30 bg-white dark:bg-gray-800 p-6 card-shadow">
        <h3 className="mb-4 text-lg font-semibold text-gradient-teal dark:text-gray-100">
          Country Distribution
        </h3>
        <DonutChart data={countryData} />
      </div>
    </div>
  )
}

