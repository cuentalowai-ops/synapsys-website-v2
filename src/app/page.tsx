import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero"
import { FeaturesSection } from "@/components/sections/features"
import { ComplianceSection } from "@/components/sections/compliance"
import { TechStackSection } from "@/components/sections/tech-stack"
import { CTASection } from "@/components/sections/cta"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ComplianceSection />
        <TechStackSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
