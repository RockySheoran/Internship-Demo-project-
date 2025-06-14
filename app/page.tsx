import { HeroSection } from "@/components/hero-section"
import { FeaturedListings } from "@/components/featured-listings"
import { PopularDestinations } from "@/components/popular-destinations"
import { HostSection } from "@/components/host-section"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 space-y-16 py-16">
        <FeaturedListings />
        <PopularDestinations />
        <HostSection />
      </div>
    </div>
  )
}
