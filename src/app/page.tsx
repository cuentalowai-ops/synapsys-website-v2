import { LandingHeader } from "@/components/layout/landing-header"
import { LandingFooter } from "@/components/layout/landing-footer"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { ComplianceSection } from "@/components/sections/compliance-section"
import { TechStackSection } from "@/components/sections/tech-stack-section"
import { CTASection } from "@/components/sections/cta-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ComplianceSection />
        <TechStackSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
