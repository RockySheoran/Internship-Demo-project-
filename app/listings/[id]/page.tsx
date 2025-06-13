import Image from "next/image"
import { notFound } from "next/navigation"
import { getListingById } from "@/lib/data"
import { BookingForm } from "@/components/booking-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, User, Wifi, Car, Snowflake, Utensils, PawPrint, Share2, Heart } from "lucide-react"

export default async function ListingPage({ params }: { params: { id: string } }) {
  const property = await getListingById(params.id)

  if (!property) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-primary text-primary mr-1" />
            <span className="font-medium">{property.rating}</span>
            <span className="text-muted-foreground ml-1">({property.reviews.length} reviews)</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {property.location.city}, {property.location.country}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
        <div className="lg:col-span-2 rounded-lg overflow-hidden aspect-[16/9]">
          <Image
            src={property.images[0] || "/placeholder.svg?height=600&width=800"}
            alt={property.title}
            width={800}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden lg:grid grid-cols-2 gap-2">
          {property.images.slice(1, 5).map((image, index) => (
            <div key={index} className="rounded-lg overflow-hidden aspect-square">
              <Image
                src={image || `/placeholder.svg?height=300&width=300&text=Image ${index + 2}`}
                alt={`${property.title} - Image ${index + 2}`}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {property.type} hosted by {property.host.name}
              </h2>
              <p className="text-muted-foreground">
                {property.bedrooms} bedroom{property.bedrooms !== 1 ? "s" : ""} •{property.bathrooms} bathroom
                {property.bathrooms !== 1 ? "s" : ""} • Up to {property.maxGuests} guest
                {property.maxGuests !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">About this place</h3>
            <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">What this place offers</h3>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities.includes("wifi") && (
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  <span>WiFi</span>
                </div>
              )}
              {property.amenities.includes("parking") && (
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  <span>Free parking</span>
                </div>
              )}
              {property.amenities.includes("airConditioning") && (
                <div className="flex items-center gap-2">
                  <Snowflake className="h-5 w-5" />
                  <span>Air conditioning</span>
                </div>
              )}
              {property.amenities.includes("kitchen") && (
                <div className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  <span>Kitchen</span>
                </div>
              )}
              {property.amenities.includes("petFriendly") && (
                <div className="flex items-center gap-2">
                  <PawPrint className="h-5 w-5" />
                  <span>Pet friendly</span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reviews</h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                <span className="font-medium">{property.rating}</span>
                <span className="text-muted-foreground ml-1">({property.reviews.length} reviews)</span>
              </div>
            </div>

            <div className="space-y-6">
              {property.reviews.slice(0, 3).map((review, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{review.user}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}

              {property.reviews.length > 3 && (
                <Button variant="outline" className="w-full">
                  Show all {property.reviews.length} reviews
                </Button>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Location</h3>
            <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Map view</span>
            </div>
            <p className="mt-4 text-muted-foreground">
              {property.location.address}, {property.location.city}, {property.location.country}
            </p>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Hosted by {property.host.name}</h3>
                <p className="text-sm text-muted-foreground">Joined in {property.host.joinedDate}</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">{property.host.description}</p>
            <Button variant="outline">Contact host</Button>
          </div>
        </div>

        <div className="lg:w-[380px] shrink-0">
          <div className="sticky top-24">
            <BookingForm property={property} />
          </div>
        </div>
      </div>
    </div>
  )
}
