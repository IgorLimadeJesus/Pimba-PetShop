import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// Vercel Analytics import removed for local/dev runs to prevent loading /_vercel/insights/script.js
import { AuthProvider } from "@/lib/auth-context"
import { ClientProvider } from "@/lib/client-context"
import { UserProvider } from "@/lib/user-context"
import Providers from "./providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
        {/* Only enable Vercel Analytics when running in production and when explicitly enabled by env var.
            This avoids 404/blocked script noise during local development. Set NEXT_PUBLIC_VERCEL_ANALYTICS=1
            in production if you want analytics enabled. */}
        {/* Vercel Analytics disabled for local runs to avoid 404/blocked requests */}
      </body>
    </html>
  )
}
