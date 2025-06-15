"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SearchBar } from "@/components/search/search-bar"
import { PropertyCard } from "@/components/cards/property-card"
import { PropertyFilters } from "@/components/filters/property-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, MapPin, Calendar, Users, Filter, Grid, List, Map } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ListingsPage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [sortBy, setSortBy] = useState("recommended")
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const location = searchParams.get("location") || ""
  const checkIn = searchParams.get("checkIn") || ""
  const checkOut = searchParams.get("checkOut") || ""
  const guests = searchParams.get("guests") || "1"

  useEffect(() => {
    fetchListings()
  }, [searchParams, filters, sortBy, currentPage])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (location) params.append("location", location)
      if (checkIn) params.append("checkIn", checkIn)
      if (checkOut) params.append("checkOut", checkOut)
      if (guests) params.append("guests", guests)

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })

      params.append("sort", sortBy)
      params.append("page", currentPage.toString())

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings?${params.toString()}`)
      const data = await response.json()

      setListings(data.listings || [])
      setTotalResults(data.total || 0)
    } catch (error) {
      console.error("Error fetching listings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
    setCurrentPage(1)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {location ? `Stays in ${location}` : "Find your perfect stay"}
                </h1>
                {(checkIn || checkOut || guests !== "1") && (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    {checkIn && checkOut && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {checkIn} - {checkOut}
                      </Badge>
                    )}
                    {guests !== "1" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {guests} guest{Number.parseInt(guests) !== 1 ? "s" : ""}
                      </Badge>
                    )}
                    {location && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {location}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className="h-8 w-8 p-0"
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
              <CardContent className="p-6">
                <SearchBar
                  defaultLocation={location}
                  defaultCheckIn={checkIn}
                  defaultCheckOut={checkOut}
                  defaultGuests={Number.parseInt(guests)}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24 space-y-6">
                <PropertyFilters onFiltersChange={handleFiltersChange} />

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Sort by</h3>
                    <div className="space-y-2">
                      {[
                        { value: "recommended", label: "Recommended" },
                        { value: "price_low", label: "Price: Low to High" },
                        { value: "price_high", label: "Price: High to Low" },
                        { value: "rating", label: "Highest Rated" },
                        { value: "newest", label: "Newest" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={sortBy === option.value ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleSortChange(option.value)}
                          className="w-full justify-start"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>

            <div className="lg:hidden flex items-center gap-2 mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="space-y-6 mt-6">
                    <PropertyFilters onFiltersChange={handleFiltersChange} />
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Sort by</h3>
                    <div className="space-y-2">
                      {[
                        { value: "recommended", label: "Recommended" },
                        { value: "price_low", label: "Price: Low to High" },
                        { value: "price_high", label: "Price: High to Low" },
                        { value: "rating", label: "Highest Rated" },
                        { value: "newest", label: "Newest" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={sortBy === option.value ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleSortChange(option.value)}
                          className="w-full justify-start"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-muted-foreground">
                  {loading ? <Skeleton className="h-4 w-32" /> : `${totalResults} properties found`}
                </div>
              </div>

              {loading ? (
                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
                  )}
                >
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : listings.length > 0 ? (
                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
                  )}
                >
                  {listings.map((listing: any) => (
                    <PropertyCard key={listing.id} listing={listing} viewMode={viewMode} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
                    <Button onClick={() => window.location.reload()}>Clear all filters</Button>
                  </CardContent>
                </Card>
              )}

              {!loading && listings.length > 0 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>

                    {Array.from({ length: Math.min(5, Math.ceil(totalResults / 12)) }).map((_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      )
                    })}

                    <Button
                      variant="outline"
                      disabled={currentPage >= Math.ceil(totalResults / 12)}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
