"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { PropertyType } from "@/lib/types"
import { addDays, differenceInDays, format } from "date-fns"
import { createBooking } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

interface BookingFormProps {
  property: PropertyType
}

export function BookingForm({ property }: BookingFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date | undefined
  }>({
    from: new Date(),
    to: addDays(new Date(), 5),
  })

  const [guests, setGuests] = useState(1)

  // Calculate number of nights
  const nights = dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0

  // Calculate total price
  const subtotal = property.price * nights
  const serviceFee = Math.round(subtotal * 0.12)
  const total = subtotal + serviceFee

  const handleBooking = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Please select check-in and check-out dates",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, we would check if the user is logged in first
      // and redirect to login if not

      const booking = {
        propertyId: property._id,
        checkIn: format(dateRange.from, "yyyy-MM-dd"),
        checkOut: format(dateRange.to, "yyyy-MM-dd"),
        guests,
        totalPrice: total,
      }

      await createBooking(booking)

      toast({
        title: "Booking successful!",
        description: "Your booking has been confirmed.",
      })

      // Redirect to bookings page
      router.push("/bookings")
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-baseline">
          <div className="text-2xl font-bold">${property.price}</div>
          <div className="text-muted-foreground">night</div>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-medium">★ {property.rating}</span>
          <span className="mx-1">•</span>
          <span className="text-muted-foreground">{property.reviews.length} reviews</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-4 border-r">
              <div className="text-xs font-medium">CHECK-IN</div>
              <div>{dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Select date"}</div>
            </div>
            <div className="p-4">
              <div className="text-xs font-medium">CHECKOUT</div>
              <div>{dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "Select date"}</div>
            </div>
          </div>
          <Separator />
          <div className="p-4">
            <div className="text-xs font-medium mb-2">GUESTS</div>
            <Input
              type="number"
              min={1}
              max={property.maxGuests}
              value={guests}
              onChange={(e) => setGuests(Number.parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => setDateRange(range as any)}
            numberOfMonths={1}
            disabled={(date) => date < new Date()}
            className="[&>div]:grid [&>div]:grid-cols-1"
          />
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleBooking}
          disabled={isLoading || !dateRange.to || nights === 0}
        >
          {isLoading ? "Processing..." : "Reserve"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">You won't be charged yet</p>

        <div className="space-y-2">
          <div className="flex justify-between">
            <div>
              ${property.price} x {nights} nights
            </div>
            <div>${subtotal}</div>
          </div>
          <div className="flex justify-between">
            <div>Service fee</div>
            <div>${serviceFee}</div>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <div>Total</div>
            <div>${total}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
