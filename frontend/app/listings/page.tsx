"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { SearchBar } from "@/components/search/search-bar"
import { PropertyFilters } from "@/components/filters/property-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, MapPin, Calendar, Users, Filter, Grid, List, Map } from "lucide-react"

/**
 * Enhanced Listings Page Component
 * Advanced property search and filtering with multiple view modes
 */
export default function ListingsPage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [sortBy, setSortBy] = useState("recommended")
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // Extract search parameters
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
      
      // Add search parameters
      if (location) params.append("location", location)
      if (checkIn) params.append("checkIn", checkIn)
      if (checkOut) params.append("checkOut", checkOut)
      if (guests) params.append("guests", guests)
      
      // Add filters
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
    setCurrentPage(1) // Reset to first page when filters change
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
          {/* Search Header */}
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

              {/* View Mode Toggle */}
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

            {/* Enhanced Search Bar */}
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
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24 space-y-6">
                <PropertyFilters onFiltersChange={handleFiltersChange} />
                
                {/* Sort Options */}
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

            {/* Mobile Filters */}
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
                        { value: "newest",\
