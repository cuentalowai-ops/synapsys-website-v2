import { Shield, Key, Wallet, Lock, Zap, Code } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Shield,
    title: "eIDAS 2.0 Compliance",
    description: "Fully compliant with EU Digital Identity Wallet regulations and Architecture Reference Framework (ARF 1.4.0).",
    color: "coral",
  },
  {
    icon: Key,
    title: "OpenID4VP Protocol",
    description: "Native support for OpenID for Verifiable Presentations with selective disclosure and credential validation.",
    color: "amber",
  },
  {
    icon: Wallet,
    title: "Multi-Wallet Support",
    description: "Seamless integration with Gataca, iGrant.io, DIZME, and other EUDI-compliant wallet providers.",
    color: "teal",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "ISO 27001 certified with NIS2 incident reporting, GDPR compliance, and comprehensive audit logging.",
    color: "purple",
  },
  {
    icon: Zap,
    title: "Real-time Verification",
    description: "Instant credential verification with cryptographic proof validation, revocation checking, and trust framework integration.",
    color: "purple",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "RESTful API, comprehensive documentation, SDKs in multiple languages, and webhook support for easy integration.",
    color: "coral",
  },
]

const colorMap = {
  coral: {
    icon: "text-coral-600",
    border: "border-coral-200 hover:border-coral-400 border-coral-blur border-coral-blur-hover",
    bg: "bg-coral-50 bg-coral-blur",
  },
  amber: {
    icon: "text-amber-600",
    border: "border-amber-200 hover:border-amber-400 blur-soft",
    bg: "bg-amber-50 bg-amber-blur",
  },
  teal: {
    icon: "text-teal-600",
    border: "border-teal-200 hover:border-teal-400",
    bg: "bg-teal-50",
  },
  purple: {
    icon: "text-purple-600",
    border: "border-purple-200 hover:border-purple-400",
    bg: "bg-purple-50",
  },
}

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 font-display text-3xl font-semibold leading-[1.2] tracking-[-0.01em] text-gradient-secondary sm:text-4xl md:text-5xl">
            Enterprise Features
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-700 sm:text-lg">
            Production-ready verification platform with compliance and security built-in
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            const colors = colorMap[feature.color as keyof typeof colorMap]
            return (
              <Card
                key={feature.title}
                className={`group cursor-pointer glass-card border-2 rounded-xl sm:rounded-2xl transition-all duration-300 hover-lift card-shadow-glow bg-white ${colors.border}`}
              >
                <CardHeader className="pb-4">
                  <div className={`mb-4 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl border-2 ${colors.bg} ${colors.border}`}>
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

