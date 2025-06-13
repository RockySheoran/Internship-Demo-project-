export interface PropertyType {
  _id: string
  title: string
  description: string
  type: string
  price: number
  location: {
    address: string
    city: string
    state: string
    country: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  bedrooms: number
  bathrooms: number
  maxGuests: number
  amenities: string[]
  images: string[]
  host: {
    _id: string
    name: string
    image: string
    joinedDate: string
    description: string
  }
  rating: number
  reviews: {
    user: string
    rating: number
    comment: string
    date: string
  }[]
  featured: boolean
  instantBook: boolean
}

export interface BookingType {
  _id: string
  propertyId: string
  userId: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt: string
}

export interface UserType {
  _id: string
  name: string
  email: string
  image?: string
  role: "user" | "host" | "admin"
  createdAt: string
}
