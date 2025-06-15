import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedListings } from "@/components/sections/featured-listings"
import { PopularDestinations } from "@/components/sections/popular-destinations"
import { HostSection } from "@/components/sections/host-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { StatsSection } from "@/components/sections/stats-section"
import { NewsletterSection } from "@/components/sections/newsletter-section"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

/**
 * Homepage Component
 * Main landing page with comprehensive sections and features
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section with Advanced Search */}
        <HeroSection />

        {/* Main Content Sections */}
        <div className="container mx-auto px-4 space-y-24 py-20">
          {/* Featured Properties */}
          <Suspense fallback={<LoadingSpinner className="h-64" />}>
            <FeaturedListings />
          </Suspense>

          {/* Popular Destinations */}
          <PopularDestinations />

          {/* Platform Statistics */}
          <StatsSection />

          {/* Customer Testimonials */}
          <TestimonialsSection />

          {/* Host Promotion */}
          <HostSection />

          {/* Newsletter Signup */}
          <NewsletterSection />
        </div>
      </main>
      <Footer />
    </>
  )
}
