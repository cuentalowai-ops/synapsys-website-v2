import { Shield, Key, Wallet, Lock, Zap, Code } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Key,
    title: "OpenID4VP Protocol",
    description: "Integrated with synapsys-verifier for secure credential verification using the latest OpenID4VP standards.",
    color: "teal",
  },
  {
    icon: Shield,
    title: "eIDAS 2.0 Compliance",
    description: "Full compliance with European Digital Identity standards and ARF 1.4 requirements.",
    color: "purple",
  },
  {
    icon: Lock,
    title: "Security First",
    description: "GDPR, NIS2, and ISO 27001 compliant architecture with end-to-end encryption.",
    color: "coral",
  },
  {
    icon: Wallet,
    title: "Multi-Wallet Support",
    description: "Compatible with major EUDI wallet implementations across Europe.",
    color: "amber",
  },
  {
    icon: Zap,
    title: "Real-time Verification",
    description: "Sub-50ms verification response times with 99.9% uptime SLA.",
    color: "teal",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "RESTful APIs with comprehensive documentation and SDKs for multiple languages.",
    color: "purple",
  },
]

const colorMap = {
  coral: {
    icon: "text-coral-600",
    border: "border-coral-200 hover:border-coral-500/50",
    bg: "bg-coral-500/10",
    glow: "shadow-lg shadow-coral-500/50",
  },
  amber: {
    icon: "text-amber-600",
    border: "border-amber-200 hover:border-amber-500/50",
    bg: "bg-amber-500/10",
    glow: "shadow-lg shadow-amber-500/50",
  },
  teal: {
    icon: "text-teal-600",
    border: "border-teal-200 hover:border-teal-500/50",
    bg: "bg-teal-500/10",
    glow: "shadow-lg shadow-teal-500/50",
  },
  purple: {
    icon: "text-purple-600",
    border: "border-purple-200 hover:border-purple-500/50",
    bg: "bg-purple-500/10",
    glow: "shadow-lg shadow-purple-500/50",
  },
}

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-12 sm:py-16 md:py-20 lg:py-28 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 font-display text-3xl font-semibold leading-[1.2] tracking-[-0.01em] text-gradient-hero sm:text-4xl md:text-5xl">
            Platform Features
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-700 sm:text-lg">
            Everything you need for EUDI wallet verification
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const colors = colorMap[feature.color as keyof typeof colorMap]
            return (
              <Card
                key={feature.title}
                className={`group cursor-pointer bg-white/95 backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:-translate-y-2 hover:border-opacity-50 ${colors.border} ${colors.glow} animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className={`mb-4 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl p-4 ${colors.bg}`}>
                    <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${colors.icon}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800 sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed text-gray-700 sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

