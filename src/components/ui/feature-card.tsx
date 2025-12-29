import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: "coral" | "amber" | "teal" | "magenta" | "purple"
}

const colorMap = {
  coral: {
    bg: "bg-coral-50",
    border: "border-coral-200",
    icon: "text-coral-600",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-600",
  },
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    icon: "text-teal-600",
  },
  magenta: {
    bg: "bg-magenta-50",
    border: "border-magenta-200",
    icon: "text-magenta-600",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: "text-purple-600",
  },
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: FeatureCardProps) {
  const colors = colorMap[color]

  return (
    <Card
      className={`transition-all hover:card-shadow-hover ${colors.border}`}
    >
      <CardHeader>
        <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg ${colors.bg}`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

