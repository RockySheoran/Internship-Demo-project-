import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Heart, MapPin } from "lucide-react"

interface PropertyCardProps {
  property: {
    _id: string
    title: string
    location: {
      city: string
      country: string
    }
    price: number
    images: string[]
    rating: number
    reviewCount: number
    type: string
    featured?: boolean
    instantBook?: boolean
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
      <div className="relative">
        <Link href={`/listings/${property._id}`}>
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src={property.images[0] || "/placeholder.svg?height=400&width=400"}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">Featured</Badge>
          )}
          {property.instantBook && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
              Instant Book
            </Badge>
          )}
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 transition-colors"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4 space-y-3">
        <Link href={`/listings/${property._id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-blue-600 transition-colors">{property.title}</h3>
        </Link>

        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span>
            {property.location.city}, {property.location.country}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{property.rating}</span>
            <span className="text-muted-foreground text-sm">({property.reviewCount})</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">${property.price}</div>
            <div className="text-muted-foreground text-sm">per night</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
