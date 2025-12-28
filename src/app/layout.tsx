import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synapsys - EUDI Wallet Relying Party Dashboard",
  description: "Enterprise-grade dashboard for EUDI wallet verification and management. Compliant with eIDAS 2.0, GDPR, NIS2, and ISO 27001.",
  keywords: ["EUDI", "wallet", "verification", "OpenID4VP", "eIDAS 2.0"],
  authors: [{ name: "Synapsys" }],
  creator: "Synapsys",
  publisher: "Synapsys",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Synapsys",
    title: "Synapsys - EUDI Wallet Relying Party Dashboard",
    description: "Enterprise-grade dashboard for EUDI wallet verification and management",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synapsys - EUDI Wallet Relying Party Dashboard",
    description: "Enterprise-grade dashboard for EUDI wallet verification and management",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
