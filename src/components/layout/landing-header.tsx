"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#compliance", label: "Compliance" },
    { href: "#tech", label: "Technology" },
    { href: "https://docs.synapsys.io", label: "Docs", external: true },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-coral-200/30 glass-white bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <Image
            src="/images/synapsys-logo.png"
            alt="Synapsys"
            width={240}
            height={80}
            className="h-12 w-auto object-contain sm:h-16 md:h-20"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons - Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button
            size="sm"
              className="bg-gradient-coral-amber text-gray-800 hover:opacity-90 glow-coral border border-coral-300/40"
            asChild
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                className="text-sm font-medium text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 border-t pt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="w-full bg-gradient-coral-amber text-gray-800 glow-coral"
                asChild
              >
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

