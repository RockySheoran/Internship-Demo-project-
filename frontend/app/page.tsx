import { Suspense } from "react"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedListings } from "@/components/sections/featured-listings"
import { PopularDestinations } from "@/components/sections/popular-destinations"
import { HostSection } from "@/components/sections/host-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { StatsSection } from "@/components/sections/stats-section"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

/**
 * Homepage Component
 * Main landing page with hero section, featured listings, and promotional content
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <HeroSection />

      <div className="container mx-auto px-4 space-y-20 py-16">
        {/* Featured Properties Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedListings />
        </Suspense>

        {/* Popular Destinations */}
        <PopularDestinations />

        {/* Platform Statistics */}
        <StatsSection />

        {/* Customer Testimonials */}
        <TestimonialsSection />

        {/* Host Promotion Section */}
        <HostSection />
      </div>
    </div>
  )
}
