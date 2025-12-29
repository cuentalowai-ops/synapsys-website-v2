import { CheckCircle, Shield, Lock, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const compliances = [
  {
    name: "eIDAS 2.0",
    description: "EU Regulation 2024/1183",
    status: "98% Compliant",
    icon: CheckCircle,
    color: "bg-green-50 text-green-700 border-green-200",
    iconColor: "text-green-600",
  },
  {
    name: "ISO 27001",
    description: "Information Security",
    status: "Certified",
    icon: Shield,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    name: "NIS2",
    description: "Cybersecurity Directive",
    status: "95% Compliant",
    icon: Lock,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    iconColor: "text-purple-600",
  },
  {
    name: "GDPR",
    description: "Data Protection",
    status: "Fully Compliant",
    icon: Check,
    color: "bg-pink-50 text-pink-700 border-pink-200",
    iconColor: "text-pink-600",
  },
]

export function ComplianceSection() {
  return (
    <section id="compliance" className="border-y border-gray-200 bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 font-display text-3xl font-semibold leading-[1.2] tracking-[-0.01em] text-gradient-teal sm:text-4xl md:text-5xl">
            Compliance & Standards
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-700 sm:text-lg">
            Built with security, privacy, and regulatory compliance as foundational pillars
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {compliances.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.name}
                className={`group rounded-xl sm:rounded-2xl border-2 p-5 sm:p-6 text-center transition-all duration-300 hover-lift card-shadow-glow bg-white ${item.color}`}
              >
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${item.iconColor}`} />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-gray-800 sm:text-xl">{item.name}</h3>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-700 opacity-90">{item.description}</p>
                <Badge variant="secondary" className="font-semibold text-xs sm:text-sm">
                  {item.status}
                </Badge>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

