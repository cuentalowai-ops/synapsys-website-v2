"use client"

import { FileCheck, Shield, AlertCircle, CheckCircle, User, Settings } from "lucide-react"
import { ActivityItem } from "./ActivityItem"

const activities = [
  {
    icon: FileCheck,
    title: "Verification Completed",
    description: "eIDAS 2.0 credential verified for user@example.com",
    time: "2 hours ago",
    color: "green" as const,
  },
  {
    icon: Shield,
    title: "New Wallet Connected",
    description: "Gataca wallet integrated successfully",
    time: "5 hours ago",
    color: "teal" as const,
  },
  {
    icon: AlertCircle,
    title: "Compliance Alert",
    description: "GDPR audit scheduled for next week",
    time: "1 day ago",
    color: "amber" as const,
  },
  {
    icon: CheckCircle,
    title: "System Update",
    description: "OpenID4VP protocol updated to v1.2.0",
    time: "2 days ago",
    color: "purple" as const,
  },
  {
    icon: User,
    title: "New User Registered",
    description: "Enterprise account created for Acme Corp",
    time: "3 days ago",
    color: "coral" as const,
  },
  {
    icon: Settings,
    title: "Configuration Changed",
    description: "API rate limits updated",
    time: "1 week ago",
    color: "teal" as const,
  },
]

export function ActivityFeed() {
  return (
    <div className="glass-card rounded-2xl border-2 border-purple-200/30 bg-white dark:bg-gray-800 p-6 card-shadow">
      <h3 className="mb-4 text-lg font-semibold text-gradient-secondary dark:text-gray-100">
        Recent Activity
      </h3>
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </div>
  )
}

