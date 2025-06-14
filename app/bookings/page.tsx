"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar, MapPin, Users, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BookingsPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>
        <div className="space-y-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-32 h-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Bookings
          </h1>
          <p className="text-muted-foreground mt-2">Manage and track all your reservations</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">Start exploring amazing places to stay</p>
              <Button asChild>
                <Link href="/listings">Browse listings</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <Card key={booking._id} className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48 md:h-auto relative">
                      <Image
                        src={booking.listing.images[0] || "/placeholder.svg?height=200&width=300"}
                        alt={booking.listing.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{booking.listing.title}</h3>
                          <div className="flex items-center text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>
                              {booking.listing.location.city}, {booking.listing.location.country}
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                          <div>
                            <div className="text-sm text-muted-foreground">Check-in</div>
                            <div className="font-medium">{format(new Date(booking.checkIn), "MMM dd, yyyy")}</div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                          <div>
                            <div className="text-sm text-muted-foreground">Check-out</div>
                            <div className="font-medium">{format(new Date(booking.checkOut), "MMM dd, yyyy")}</div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-green-500" />
                          <div>
                            <div className="text-sm text-muted-foreground">Guests</div>
                            <div className="font-medium">{booking.guests}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center px-6 py-4 bg-gray-100 dark:bg-gray-800">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-black dark:text-white" />
                          <div>
                            <div className="text-sm text-muted-foreground">Total</div>
                            <div className="font-medium">${booking.totalPrice}</div>
                          </div>
                        </div>
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
