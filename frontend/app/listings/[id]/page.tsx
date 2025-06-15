"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BookingForm } from "@/components/forms/booking-form"
import { ReviewsList } from "@/components/sections/reviews-list"
import { HostProfile } from "@/components/cards/host-profile"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Heart,
  Share,
  ArrowLeft,
  Calendar,
  Shield,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchListing()
  }, [params.id])

  const fetchListing = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setListing(data.listing)
      } else {
        router.push("/listings")
      }
    } catch (error) {
      console.error("Error fetching listing:", error)
      router.push("/listings")
    } finally {
      setLoading(false)
    }
  }

  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    parking: Car,
    kitchen: Coffee,
    tv: Tv,
    airConditioning: Wind,
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title,
          text: listing?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // TODO: Implement API call to add/remove from favorites
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-44 w-full rounded-lg" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
              <div>
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!listing) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
            <Button onClick={() => router.push("/listings")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to listings
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-current text-yellow-500" />
                    <span className="font-medium">{listing.rating?.overall || "New"}</span>
                    {listing.reviewCount > 0 && <span className="ml-1">({listing.reviewCount} reviews)</span>}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {listing.location?.city}, {listing.location?.country}
                    </span>
                  </div>
                  {listing.verified && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFavorite}
                  className={cn(isFavorite && "text-red-500")}
                >
                  <Heart className={cn("h-4 w-4 mr-2", isFavorite && "fill-current")} />
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 rounded-xl overflow-hidden">
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src={listing.images?.[selectedImageIndex]?.url || "/placeholder.svg?height=500&width=800"}
                alt={listing.images?.[selectedImageIndex]?.caption || listing.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {listing.images?.slice(1, 5).map((image: any, index: number) => (
                <div
                  key={index}
                  className="relative h-44 lg:h-60 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedImageIndex(index + 1)}
                >
                  <Image
                    src={image.url || "/placeholder.svg?height=240&width=400"}
                    alt={image.caption || `${listing.title} - Image ${index + 2}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {listing.type} hosted by {listing.host?.name}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {listing.maxGuests} guests
                        </span>
                        <span className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {listing.bedrooms} bedrooms
                        </span>
                        <span className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {listing.bathrooms} bathrooms
                        </span>
                      </div>
                    </div>

                    {listing.host?.hostInfo?.superhost && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        Superhost
                      </Badge>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About this place</h3>
                      <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
                    </div>

                    {listing.instantBook && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">Instant Book</p>
                          <p className="text-sm text-green-600 dark:text-green-300">
                            Book without waiting for host approval
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">What this place offers</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {listing.amenities?.map((amenity: string) => {
                      const IconComponent = amenityIcons[amenity] || Wifi
                      return (
                        <div key={amenity} className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                          <span className="capitalize">{amenity.replace(/([A-Z])/g, " $1").trim()}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* House Rules */}
              {listing.houseRules && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">House rules</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Check-in</span>
                        <span className="font-medium">{listing.houseRules.checkIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out</span>
                        <span className="font-medium">{listing.houseRules.checkOut}</span>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Smoking</span>
                          <span className={listing.houseRules.smokingAllowed ? "text-green-600" : "text-red-600"}>
                            {listing.houseRules.smokingAllowed ? "Allowed" : "Not allowed"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pets</span>
                          <span className={listing.houseRules.petsAllowed ? "text-green-600" : "text-red-600"}>
                            {listing.houseRules.petsAllowed ? "Allowed" : "Not allowed"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Parties</span>
                          <span className={listing.houseRules.partiesAllowed ? "text-green-600" : "text-red-600"}>
                            {listing.houseRules.partiesAllowed ? "Allowed" : "Not allowed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Host Profile */}
              <HostProfile host={listing.host} />

              {/* Reviews */}
              <ReviewsList listingId={listing._id} rating={listing.rating} reviewCount={listing.reviewCount} />
            </div>

            {/* Right Column - Booking */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <BookingForm listing={listing} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
