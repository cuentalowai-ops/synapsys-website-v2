import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="border-y py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="rounded-2xl border bg-gradient-subtle p-12 text-center md:p-16">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Deploy your EUDI verification system in minutes, not months
          </p>
          <Button
            size="lg"
            className="gap-2 bg-gradient-to-r from-coral-400 to-amber-400 text-white hover:from-coral-500 hover:to-amber-500 cursor-glow hover-lift"
            asChild
          >
            <Link href="/auth/register">
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

