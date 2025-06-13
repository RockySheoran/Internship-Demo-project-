import { SearchBar } from "@/components/search-bar"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { getListings } from "@/lib/data"

export default async function Home() {
  const listings = await getListings()

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative py-20 bg-muted rounded-3xl overflow-hidden mb-12">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find your perfect stay anywhere in the world</h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Discover unique places to stay, private homes, and amazing experiences around the globe.
            </p>
            <SearchBar />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center opacity-20 md:opacity-80"></div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Places to Stay</h2>
          <Button variant="outline">View all</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.slice(0, 8).map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Destinations</h2>
          <Button variant="outline">Explore more</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["New York", "Paris", "Tokyo", "London"].map((city) => (
            <div key={city} className="relative h-60 rounded-lg overflow-hidden group">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all z-10"></div>
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=300')] bg-cover bg-center"></div>
              <div className="absolute bottom-0 left-0 p-4 z-20">
                <h3 className="text-white text-xl font-bold">{city}</h3>
                <p className="text-white/80 text-sm">100+ properties</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-muted rounded-3xl">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-bold mb-4">Become a Host</h2>
            <p className="text-muted-foreground mb-6">
              Earn extra income and unlock new opportunities by sharing your space.
            </p>
            <Button size="lg">Learn more</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
