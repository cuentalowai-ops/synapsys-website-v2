"use client"

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  color: "coral" | "teal" | "amber" | "purple"
}

const colorMap = {
  coral: {
    bg: "bg-coral-50 dark:bg-coral-900/20",
    icon: "text-coral-600 dark:text-coral-400",
    border: "border-coral-200 dark:border-coral-800",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    icon: "text-teal-600 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-800",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    icon: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
}

export function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color]
  const isPositive = change >= 0

  return (
    <div
      className={cn(
        "rounded-xl border p-6 transition-all hover:shadow-md",
        colors.bg,
        colors.border
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          <div className="mt-3 flex items-center gap-1 text-sm">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <span
              className={cn(
                "font-medium",
                isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {Math.abs(change)}%
            </span>
            <span className="text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            colors.bg
          )}
        >
          <Icon className={cn("h-6 w-6", colors.icon)} />
        </div>
      </div>
    </div>
  )
}

