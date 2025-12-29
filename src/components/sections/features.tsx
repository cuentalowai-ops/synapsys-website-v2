import {
  Shield,
  Zap,
  Globe,
  Lock,
  CheckCircle,
  Code,
} from "lucide-react"
import { FeatureCard } from "@/components/ui/feature-card"

const features = [
  {
    icon: Shield,
    title: "eIDAS 2.0 Compliant",
    description:
      "Fully compliant with EU Digital Identity Wallet regulations and Architecture Reference Framework (ARF 1.4.0).",
    color: "coral" as const,
  },
  {
    icon: Zap,
    title: "OpenID4VP Ready",
    description:
      "Native support for OpenID for Verifiable Presentations with selective disclosure and credential validation.",
    color: "amber" as const,
  },
  {
    icon: Globe,
    title: "Multi-Wallet Support",
    description:
      "Seamless integration with Gataca, iGrant.io, DIZME, and other EUDI-compliant wallet providers.",
    color: "teal" as const,
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "ISO 27001 certified with NIS2 incident reporting, GDPR compliance, and comprehensive audit logging.",
    color: "magenta" as const,
  },
  {
    icon: CheckCircle,
    title: "Real-time Verification",
    description:
      "Instant credential verification with cryptographic proof validation, revocation checking, and trust framework integration.",
    color: "purple" as const,
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description:
      "RESTful API, comprehensive documentation, SDKs in multiple languages, and webhook support for easy integration.",
    color: "coral" as const,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t bg-gradient-subtle py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Enterprise Features
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Production-ready verification platform with compliance and security built-in
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

