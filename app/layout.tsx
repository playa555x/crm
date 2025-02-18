import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { Providers } from "./providers"
import { AuthProvider } from "@/contexts/auth-context"

import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Solar CRM",
    template: "%s | Solar CRM",
  },
  description: "Integrated CRM and planning solution for the solar industry",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 overflow-y-auto pl-16 transition-all duration-300 ease-in-out">{children}</main>
              </div>
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}

