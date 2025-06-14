import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { NotificationProvider } from "@/components/providers/notification-provider"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StayFinder | Find Your Perfect Stay Anywhere",
  description:
    "Book unique places to stay and amazing experiences around the world. From cozy apartments to luxury villas.",
  keywords: "accommodation, booking, travel, vacation rental, airbnb alternative",
  authors: [{ name: "StayFinder Team" }],
  openGraph: {
    title: "StayFinder - Your Perfect Stay Awaits",
    description: "Discover and book unique accommodations worldwide",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Theme Provider for Dark/Light Mode */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Authentication Context Provider */}
          <AuthProvider>
            {/* Real-time Notifications Provider */}
            <NotificationProvider>
              <div className="flex min-h-screen flex-col">
                {/* Global Header Navigation */}
                <Header />

                {/* Main Content Area */}
                <main className="flex-1">{children}</main>

                {/* Global Footer */}
                <Footer />
              </div>

              {/* Toast Notifications */}
              <Toaster />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
