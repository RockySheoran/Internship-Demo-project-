import { SearchBar } from "@/components/search/search-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Home, Award } from "lucide-react"

/**
 * Hero Section Component
 * Main landing section with search functionality and key value propositions
 */
export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
      </div>

      {/* Floating Elements for Visual Appeal */}
      <div className="absolute top-20 left-10 animate-float">
        <Badge className="bg-white/80 text-blue-600 shadow-lg">
          <Star className="w-4 h-4 mr-1 fill-current" />
          4.9 Rating
        </Badge>
      </div>

      <div className="absolute top-32 right-16 animate-float-delayed">
        <Badge className="bg-white/80 text-purple-600 shadow-lg">
          <Users className="w-4 h-4 mr-1" />
          2M+ Users
        </Badge>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
              <Award className="w-4 h-4 mr-1" />
              #1 Booking Platform
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                perfect stay
              </span>{" "}
              anywhere in the world
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover unique places to stay, from cozy apartments to luxury villas. Book with confidence and create
              unforgettable memories.
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl mb-10 border backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
            <SearchBar />
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Home className="w-5 h-5 mr-2" />
              Start Exploring
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 text-lg px-8 py-4 h-auto hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Become a Host
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
              <span>4.9/5 from 50k+ reviews</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-blue-500" />
              <span>2M+ happy travelers</span>
            </div>
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-1 text-purple-500" />
              <span>100k+ unique properties</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
