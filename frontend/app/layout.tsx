import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { NotificationProvider } from "@/components/providers/notification-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: {
    default: "StayFinder | Find Your Perfect Stay Anywhere",
    template: "%s | StayFinder",
  },
  description:
    "Discover and book unique accommodations worldwide. From cozy apartments to luxury villas, find your perfect stay with StayFinder.",
  keywords: ["accommodation", "booking", "travel", "vacation rental", "hotels", "apartments", "villas"],
  authors: [{ name: "StayFinder Team", url: "https://stayfinder.com" }],
  creator: "StayFinder",
  publisher: "StayFinder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "StayFinder - Your Perfect Stay Awaits",
    description: "Discover and book unique accommodations worldwide",
    siteName: "StayFinder",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StayFinder - Find Your Perfect Stay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StayFinder - Your Perfect Stay Awaits",
    description: "Discover and book unique accommodations worldwide",
    images: ["/og-image.jpg"],
    creator: "@stayfinder",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, poppins.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AuthProvider>
              <NotificationProvider>
                <div className="relative flex min-h-screen flex-col">{children}</div>
                <Toaster />
              </NotificationProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
