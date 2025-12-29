import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="grid-dots absolute inset-0 opacity-40" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] animate-float rounded-full bg-coral-200/20 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-[500px] w-[500px] animate-float rounded-full bg-teal-200/20 blur-3xl" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-coral-200 bg-coral-50 px-4 py-1.5 text-sm font-medium text-coral-700">
            <Zap className="h-4 w-4" />
            <span>eIDAS 2.0 Compliant</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Universal{" "}
            <span className="text-gradient-coral">EUDI Wallet</span>
            <br />
            Verification Platform
          </h1>

          {/* Subheading */}
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Enterprise-grade relying party solution for eIDAS 2.0 compliant digital
            identity verification across the European Union
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-coral-400 to-amber-400 text-white hover:from-coral-500 hover:to-amber-500"
              asChild
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid w-full grid-cols-1 gap-8 border-t pt-12 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 font-display text-3xl font-bold text-gradient-coral">
                98%
              </div>
              <div className="text-sm text-muted-foreground">
                Compliance Score
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-display text-3xl font-bold text-gradient-coral">
                4 Wallets
              </div>
              <div className="text-sm text-muted-foreground">
                Integrated
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-display text-3xl font-bold text-gradient-coral">
                &lt;50ms
              </div>
              <div className="text-sm text-muted-foreground">
                Response Time
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

