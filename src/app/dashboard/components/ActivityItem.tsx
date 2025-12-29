"use client"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityItemProps {
  icon: LucideIcon
  title: string
  description: string
  time: string
  color: "coral" | "teal" | "amber" | "purple" | "green"
}

const colorMap = {
  coral: "bg-coral-50 dark:bg-coral-900/20 bg-coral-blur text-coral-600 dark:text-coral-400 blur-soft",
  teal: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
  amber: "bg-amber-50 dark:bg-amber-900/20 bg-amber-blur text-amber-600 dark:text-amber-400 blur-soft",
  purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
}

export function ActivityItem({
  icon: Icon,
  title,
  description,
  time,
  color,
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          colorMap[color]
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {title}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">{time}</p>
      </div>
    </div>
  )
}

