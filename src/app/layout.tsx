import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { siteConfig } from "@/config/site"
import { Providers } from "@/components/providers/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
})

// JetBrains Mono para datos técnicos
const jetbrainsMono = {
  variable: "--font-mono",
  style: "normal",
  weight: "400",
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "EUDI Wallet",
    "eIDAS 2.0",
    "OpenID4VP",
    "digital identity",
    "verification",
    "relying party",
  ],
  authors: [{ name: "Synapsys Team" }],
  creator: "Synapsys",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
            }
          `
        }} />
      </head>
      <body className="font-sans antialiased relative">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
