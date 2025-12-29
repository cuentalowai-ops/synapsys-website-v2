import { CheckCircle, Shield, Lock, Check, Award, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const compliances = [
  {
    name: "eIDAS 2.0",
    description: "EU Digital Identity",
    status: "98% Compliant",
    icon: Shield,
    color: "bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/30",
    iconColor: "text-green-400",
  },
  {
    name: "ISO 27001",
    description: "Information Security",
    status: "Certified",
    icon: Award,
    color: "bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    name: "NIS2",
    description: "Network Security",
    status: "95% Compliant",
    icon: ShieldCheck,
    color: "bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    name: "GDPR",
    description: "Data Protection",
    status: "Fully Compliant",
    icon: CheckCircle2,
    color: "bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/30",
    iconColor: "text-pink-400",
  },
]

export function ComplianceSection() {
  return (
    <section id="compliance" className="border-y border-gray-200 bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-28 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 font-display text-3xl font-semibold leading-[1.2] tracking-[-0.01em] text-gradient-secondary sm:text-4xl md:text-5xl">
            Compliance & Standards
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-700 sm:text-lg">
            Built to meet the highest industry standards
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {compliances.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.name}
                className={`group rounded-xl sm:rounded-2xl border-2 p-5 sm:p-6 text-center transition-all duration-300 hover-lift card-shadow-glow bg-white/95 backdrop-blur-lg ${item.color} animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
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

