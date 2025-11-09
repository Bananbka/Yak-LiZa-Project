import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "E-Commerce App | Лабораторна робота",
  description: "E-commerce застосунок на базі Platzi Fake Store API",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className={`${GeistSans.className} antialiased min-h-screen flex flex-col bg-background`}>
        <ReduxProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}