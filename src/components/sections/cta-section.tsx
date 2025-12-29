import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section id="get-started" className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-purple-600 to-coral-600 py-12 sm:py-16 md:py-20 lg:py-28 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-display text-2xl font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Ready to get started?
          </h2>
          <p className="mb-8 text-base text-white/80 sm:text-lg md:text-xl">
            Join leading organizations using Synapsys for secure digital identity verification
          </p>
          <Button
            size="lg"
            className="group scanning-button bg-white px-6 py-4 text-base font-semibold text-purple-600 shadow-2xl glow-coral transition-all hover:bg-gray-100 hover:scale-105 sm:px-8 sm:py-4 sm:text-lg"
            asChild
          >
            <Link href="/dashboard">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

