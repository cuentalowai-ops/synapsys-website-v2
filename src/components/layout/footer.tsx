import Link from "next/link"
import { Shield } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const sections = {
    product: {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Security", href: "/security" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    resources: {
      title: "Resources",
      links: [
        { label: "Documentation", href: "https://docs.synapsys.io" },
        { label: "API Reference", href: "/api" },
        { label: "Guides", href: "/guides" },
        { label: "Support", href: "/support" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Compliance", href: "#compliance" },
        { label: "Security Policy", href: "/security" },
      ],
    },
  }

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2 cursor-glow">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-coral-400 to-amber-400">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold">SYNAPSYS</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Universal EUDI Wallet Verification Platform
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(sections).map(([key, section]) => (
            <div key={key}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors cursor-glow hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <p>
            © {new Date().getFullYear()} Synapsys. All rights reserved.
          </p>
          <p className="text-xs">
            eIDAS 2.0 | ISO 27001 | NIS2 | GDPR Compliant
          </p>
        </div>
      </div>
    </footer>
  )
}

