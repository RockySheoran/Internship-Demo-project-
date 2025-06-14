import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200&text=Hero Background')] bg-cover bg-center opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find your perfect stay anywhere in the world
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Discover unique places to stay, private homes, and amazing experiences around the globe.
          </p>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl mb-8 border">
            <SearchBar />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start exploring
            </Button>
            <Button size="lg" variant="outline" className="border-2">
              Become a host
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
