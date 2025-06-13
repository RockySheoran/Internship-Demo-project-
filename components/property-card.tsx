import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { PropertyType } from "@/lib/types"

interface PropertyCardProps {
  property: PropertyType
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/listings/${property._id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={property.images[0] || "/placeholder.svg?height=400&width=400"}
            alt={property.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          {property.featured && <Badge className="absolute top-2 left-2 z-10">Featured</Badge>}
          {property.instantBook && (
            <Badge variant="secondary" className="absolute top-2 right-2 z-10">
              Instant Book
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium line-clamp-1">{property.title}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
              <span className="text-sm">{property.rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {property.location.city}, {property.location.country}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {property.type} • {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div>
            <span className="font-semibold">${property.price}</span>
            <span className="text-muted-foreground text-sm"> / night</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
