import Link from "next/link"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

export function LandingFooter() {
  const sections = {
    product: {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Documentation", href: "https://docs.synapsys.io" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
      ],
    },
    resources: {
      title: "Resources",
      links: [
        { label: "Guides", href: "/guides" },
        { label: "API Reference", href: "/api" },
        { label: "Status", href: "/status" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Compliance", href: "#compliance" },
      ],
    },
  }

  return (
    <footer className="border-t border-coral-200/30 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-5">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center">
              <Image
                src="/images/synapsys-logo.png"
                alt="Synapsys"
                width={200}
                height={64}
                className="h-12 w-auto object-contain sm:h-16 md:h-20"
              />
            </Link>
            <p className="mt-2 text-xs sm:text-sm text-gray-700">
              Universal EUDI Wallet Verification Platform
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(sections).map(([key, section]) => (
            <div key={key}>
              <h4 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-gray-800">
                {section.title}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-gray-700 transition-colors hover:text-gray-900"
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
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-600 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} Synapsys. All rights reserved.</p>
          <p className="text-xs">
            eIDAS 2.0 | ISO 27001 | NIS2 | GDPR Compliant
          </p>
        </div>
      </div>
    </footer>
  )
}

