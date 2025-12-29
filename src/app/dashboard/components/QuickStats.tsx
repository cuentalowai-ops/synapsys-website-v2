"use client"

import { Shield, FileCheck, TrendingUp, Clock } from "lucide-react"
import { StatCard } from "./StatCard"

const stats = [
  {
    title: "Active Wallets",
    value: "1,247",
    change: 12.5,
    icon: Shield,
    color: "coral" as const,
  },
  {
    title: "Verifications",
    value: "8,934",
    change: 8.2,
    icon: FileCheck,
    color: "teal" as const,
  },
  {
    title: "Success Rate",
    value: "98.7%",
    change: 2.1,
    icon: TrendingUp,
    color: "amber" as const,
  },
  {
    title: "Avg Response",
    value: "42ms",
    change: -5.3,
    icon: Clock,
    color: "purple" as const,
  },
]

export function QuickStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}

