import Link from "next/link"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Github, Twitter, Linkedin } from "lucide-react"

export function LandingFooter() {
  const sections = {
    product: {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Documentation", href: "#docs" },
        { label: "API Reference", href: "#api" },
        { label: "Changelog", href: "#changelog" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" },
        { label: "Contact", href: "#contact" },
        { label: "Press Kit", href: "#press" },
      ],
    },
    resources: {
      title: "Resources",
      links: [
        { label: "Developer Guides", href: "#guides" },
        { label: "API Documentation", href: "#api-docs" },
        { label: "System Status", href: "#status" },
        { label: "Community", href: "#community" },
        { label: "Support", href: "#support" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Terms of Service", href: "#terms" },
        { label: "Cookie Policy", href: "#cookies" },
        { label: "Security", href: "#security" },
        { label: "Compliance", href: "#compliance" },
      ],
    },
  }

  return (
    <footer className="border-t border-gray-800 bg-gray-900/95 backdrop-blur-lg">
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
                className="h-10 w-auto object-contain sm:h-12 md:h-14"
              />
            </Link>
            <p className="mt-2 text-xs sm:text-sm text-gray-400">
              Universal EUDI Wallet Verification Platform
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(sections).map(([key, section]) => (
            <div key={key}>
              <h4 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-white">
                {section.title}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-gray-400 transition-colors hover:text-teal-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-400 md:flex-row md:text-left">
          <div className="flex items-center gap-4">
            <Image
              src="/images/synapsys-logo.png"
              alt="Synapsys"
              width={100}
              height={32}
              className="h-6 w-auto object-contain opacity-80"
            />
            <p>© {new Date().getFullYear()} Synapsys. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs">
              eIDAS 2.0 | ISO 27001 | NIS2 | GDPR Compliant
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

