"use client"

import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 md:py-24 lg:py-32">
      {/* Background decoration - Grid animado */}
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      
      {/* Orbes decorativos */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] orb-coral animate-float" />
        <div className="absolute left-0 bottom-0 h-[600px] w-[600px] orb-teal animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute right-1/3 top-1/3 h-[400px] w-[400px] orb-amber animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-coral-amber px-3 py-1.5 text-xs font-semibold text-white shadow-lg glow-coral sm:mb-8 sm:px-4 sm:text-sm">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>eIDAS 2.0 Compliant</span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 font-display text-3xl font-bold leading-[1.2] tracking-[-0.01em] text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl">
            Universal{" "}
            <span className="text-gradient-hero">
              EUDI Wallet
            </span>
            <br />
            Verification Platform
          </h1>

          {/* Subheading */}
          <p className="mb-10 text-base text-gray-700 leading-relaxed sm:text-lg md:text-xl">
            Enterprise relying party platform for seamless eIDAS 2.0 compliance
          </p>

          {/* CTA Buttons */}
          <div className="mb-16 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Button
              size="lg"
              className="group scanning-button bg-gradient-coral-amber px-6 py-4 text-base font-semibold text-gray-800 border border-coral-300/40 shadow-lg glow-coral hover-lift glow-coral-hover sm:px-8 sm:py-6 sm:text-lg"
              asChild
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <button
              onClick={() => window.open("https://docs.synapsys.io", "_blank")}
              className="px-6 py-4 text-base font-semibold border-2 border-teal-300/50 text-teal-700 hover:bg-teal-50 hover:border-teal-400 transition-all rounded-lg sm:px-8 sm:py-6 sm:text-lg"
            >
              View Documentation
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 border-t border-coral-200/40 pt-8 sm:grid-cols-3 sm:gap-8 sm:pt-12">
            <div className="text-center">
              <div className="mb-2 font-display text-3xl font-bold text-gradient-hero sm:text-4xl">
                98%
              </div>
              <div className="text-sm font-medium text-gray-700">
                Success Rate
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-display text-3xl font-bold text-gradient-teal sm:text-4xl">
                4
              </div>
              <div className="text-sm font-medium text-gray-700">
                Supported Wallets
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 font-display text-3xl font-bold text-amber-600 sm:text-4xl">
                &lt;50ms
              </div>
              <div className="text-sm font-medium text-gray-700">
                Response Time
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

