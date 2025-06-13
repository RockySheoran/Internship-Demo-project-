import type { PropertyType } from "./types"

// Mock data for properties
const mockProperties: PropertyType[] = [
  {
    _id: "1",
    title: "Luxury Villa with Ocean View",
    description:
      "Experience the ultimate luxury in this stunning villa overlooking the Pacific Ocean. This spacious property features floor-to-ceiling windows, a private infinity pool, and direct beach access.\n\nThe villa includes 4 bedrooms, each with an en-suite bathroom, a fully equipped gourmet kitchen, and a spacious living area perfect for entertaining. Enjoy breathtaking sunsets from the expansive terrace or take a short walk to the beach for a day of sun and surf.",
    type: "Villa",
    price: 350,
    location: {
      address: "123 Ocean Drive",
      city: "Malibu",
      state: "California",
      country: "United States",
      coordinates: {
        lat: 34.0259,
        lng: -118.7798,
      },
    },
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    amenities: ["wifi", "pool", "parking", "airConditioning", "petFriendly", "kitchen"],
    images: [
      "/placeholder.svg?height=600&width=800&text=Ocean View Villa",
      "/placeholder.svg?height=300&width=300&text=Living Room",
      "/placeholder.svg?height=300&width=300&text=Bedroom",
      "/placeholder.svg?height=300&width=300&text=Kitchen",
      "/placeholder.svg?height=300&width=300&text=Pool",
    ],
    host: {
      _id: "h1",
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=100&width=100&text=SJ",
      joinedDate: "2018",
      description:
        "Hi, I'm Sarah! I love sharing my beautiful properties with travelers from around the world. I'm always available to help make your stay perfect.",
    },
    rating: 4.9,
    reviews: [
      {
        user: "Michael B.",
        rating: 5,
        comment:
          "Absolutely stunning property! The views were incredible and the house was immaculate. Sarah was a fantastic host.",
        date: "June 2023",
      },
      {
        user: "Jennifer L.",
        rating: 5,
        comment:
          "We had the most amazing vacation at this villa. The location is perfect and the amenities are top-notch.",
        date: "May 2023",
      },
      {
        user: "David W.",
        rating: 4,
        comment:
          "Beautiful property with amazing views. The only small issue was the WiFi was a bit spotty, but otherwise perfect.",
        date: "April 2023",
      },
    ],
    featured: true,
    instantBook: true,
  },
  {
    _id: "2",
    title: "Modern Downtown Apartment",
    description:
      "Stay in the heart of the city in this stylish modern apartment. Located in the downtown district, you'll be steps away from restaurants, shopping, and entertainment.",
    type: "Apartment",
    price: 120,
    location: {
      address: "456 Main Street",
      city: "New York",
      state: "New York",
      country: "United States",
      coordinates: {
        lat: 40.7128,
        lng: -74.006,
      },
    },
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: ["wifi", "airConditioning", "kitchen"],
    images: [
      "/placeholder.svg?height=600&width=800&text=Downtown Apartment",
      "/placeholder.svg?height=300&width=300&text=Living Area",
      "/placeholder.svg?height=300&width=300&text=Bedroom",
      "/placeholder.svg?height=300&width=300&text=Kitchen",
    ],
    host: {
      _id: "h2",
      name: "Alex Chen",
      image: "/placeholder.svg?height=100&width=100&text=AC",
      joinedDate: "2020",
      description: "Hello! I'm Alex, a New York native who loves sharing the best of the city with my guests.",
    },
    rating: 4.7,
    reviews: [
      {
        user: "Emma S.",
        rating: 5,
        comment: "Perfect location and beautiful apartment. Alex was very responsive and helpful.",
        date: "July 2023",
      },
      {
        user: "Robert T.",
        rating: 4,
        comment: "Great place in the heart of the city. A bit noisy at night but that's expected in downtown.",
        date: "June 2023",
      },
    ],
    featured: false,
    instantBook: true,
  },
  {
    _id: "3",
    title: "Cozy Mountain Cabin",
    description:
      "Escape to this charming cabin nestled in the mountains. Perfect for a romantic getaway or a peaceful retreat from the city. Enjoy hiking trails, stunning views, and cozy evenings by the fireplace.",
    type: "Cabin",
    price: 95,
    location: {
      address: "789 Pine Road",
      city: "Aspen",
      state: "Colorado",
      country: "United States",
      coordinates: {
        lat: 39.1911,
        lng: -106.8175,
      },
    },
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    amenities: ["wifi", "parking", "petFriendly", "kitchen"],
    images: [
      "/placeholder.svg?height=600&width=800&text=Mountain Cabin",
      "/placeholder.svg?height=300&width=300&text=Living Room",
      "/placeholder.svg?height=300&width=300&text=Bedroom",
      "/placeholder.svg?height=300&width=300&text=Kitchen",
    ],
    host: {
      _id: "h3",
      name: "Mark Wilson",
      image: "/placeholder.svg?height=100&width=100&text=MW",
      joinedDate: "2019",
      description: "I'm Mark, an outdoor enthusiast who loves sharing the beauty of the mountains with my guests.",
    },
    rating: 4.8,
    reviews: [
      {
        user: "Lisa K.",
        rating: 5,
        comment: "Such a peaceful retreat! The cabin was clean, cozy, and had everything we needed.",
        date: "August 2023",
      },
      {
        user: "James M.",
        rating: 5,
        comment: "Perfect mountain getaway. We loved the hiking trails nearby and the fireplace in the evening.",
        date: "July 2023",
      },
      {
        user: "Sophia R.",
        rating: 4,
        comment: "Beautiful cabin with great views. The kitchen was well-equipped for cooking meals.",
        date: "June 2023",
      },
    ],
    featured: true,
    instantBook: false,
  },
  {
    _id: "4",
    title: "Beachfront Bungalow",
    description:
      "Wake up to the sound of waves in this beautiful beachfront bungalow. Step directly onto the sand from your private patio.",
    type: "Bungalow",
    price: 180,
    location: {
      address: "101 Beach Road",
      city: "Miami",
      state: "Florida",
      country: "United States",
      coordinates: {
        lat: 25.7617,
        lng: -80.1918,
      },
    },
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    amenities: ["wifi", "airConditioning", "parking", "pool"],
    images: [
      "/placeholder.svg?height=600&width=800&text=Beach Bungalow",
      "/placeholder.svg?height=300&width=300&text=Patio",
      "/placeholder.svg?height=300&width=300&text=Bedroom",
      "/placeholder.svg?height=300&width=300&text=Beach View",
    ],
    host: {
      _id: "h4",
      name: "Maria Rodriguez",
      image: "/placeholder.svg?height=100&width=100&text=MR",
      joinedDate: "2021",
      description: "Hola! I'm Maria and I love the beach lifestyle. I'm here to make your vacation perfect!",
    },
    rating: 4.6,
    reviews: [
      {
        user: "Thomas H.",
        rating: 5,
        comment: "Amazing location right on the beach! The bungalow was clean and comfortable.",
        date: "July 2023",
      },
      {
        user: "Olivia P.",
        rating: 4,
        comment: "Great stay! Loved being able to walk right onto the beach.",
        date: "June 2023",
      },
    ],
    featured: false,
    instantBook: true,
  },
  {
    _id: "5",
    title: "Historic Downtown Loft",
    description:
      "Stay in this beautifully renovated loft in a historic building. High ceilings, exposed brick, and modern amenities make this a unique urban retreat.",
    type: "Loft",
    price: 135,
    location: {
      address: "202 Main Street",
      city: "Chicago",
      state: "Illinois",
      country: "United States",
      coordinates: {
        lat: 41.8781,
        lng: -87.6298,
      },
    },
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 3,
    amenities: ["wifi", "airConditioning", "kitchen"],
    images: [
      "/placeholder.svg?height=600&width=800&text=Historic Loft",
      "/placeholder.svg?height=300&width=300&text=Living Area",
      "/placeholder.svg?height=300&width=300&text=Bedroom",
      "/placeholder.svg?height=300&width=300&text=Kitchen",
    ],
    host: {
      _id: "h5",
      name: "Daniel Brown",
      image: "/placeholder.svg?height=100&width=100&text=DB",
      joinedDate: "2019",
      description: "I'm Daniel, an architect with a passion for historic buildings and design.",
    },
    rating: 4.7,
    reviews: [
      {
        user: "Natalie C.",
        rating: 5,
        comment: "Gorgeous loft with so much character! Perfect location for exploring the city.",
        date: "August 2023",
      },
      {
        user: "Kevin M.",
        rating: 4,
        comment: "Really cool space in a great location. Comfortable bed and all the amenities we needed.",
        date: "July 2023",
      },
    ],
    featured: true,
    instantBook: false,
  },
]

// Function to get all listings with optional filters
export async function getListings(filters?: Record<string, any>) {
  // In a real app, this would be a database query
  // For now, we'll just filter the mock data

  let filteredListings = [...mockProperties]

  if (filters) {
    // Filter by location
    if (filters.location) {
      const location = filters.location.toString().toLowerCase()
      filteredListings = filteredListings.filter(
        (property) =>
          property.location.city.toLowerCase().includes(location) ||
          property.location.country.toLowerCase().includes(location) ||
          property.location.state.toLowerCase().includes(location),
      )
    }

    // Filter by number of guests
    if (filters.guests) {
      const guests = Number(filters.guests)
      filteredListings = filteredListings.filter((property) => property.maxGuests >= guests)
    }

    // Filter by price range
    if (filters.minPrice || filters.maxPrice) {
      const minPrice = Number(filters.minPrice) || 0
      const maxPrice = Number(filters.maxPrice) || Number.POSITIVE_INFINITY
      filteredListings = filteredListings.filter((property) => property.price >= minPrice && property.price <= maxPrice)
    }

    // Filter by amenities
    const amenities = ["wifi", "pool", "parking", "airConditioning", "petFriendly"]
    amenities.forEach((amenity) => {
      if (filters[amenity] === "true") {
        filteredListings = filteredListings.filter((property) => property.amenities.includes(amenity))
      }
    })

    // Filter by property type
    const propertyTypes = ["house", "apartment", "villa", "cabin"]
    const selectedTypes = propertyTypes.filter((type) => filters[type] === "true")
    if (selectedTypes.length > 0) {
      filteredListings = filteredListings.filter((property) => selectedTypes.includes(property.type.toLowerCase()))
    }
  }

  return filteredListings
}

// Function to get a single listing by ID
export async function getListingById(id: string) {
  // In a real app, this would be a database query
  return mockProperties.find((property) => property._id === id)
}
