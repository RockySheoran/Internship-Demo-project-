"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial values from URL params
  const initialPriceRange = [Number(searchParams.get("minPrice") || 0), Number(searchParams.get("maxPrice") || 1000)]

  const initialAmenities = {
    wifi: searchParams.get("wifi") === "true",
    pool: searchParams.get("pool") === "true",
    parking: searchParams.get("parking") === "true",
    airConditioning: searchParams.get("airConditioning") === "true",
    petFriendly: searchParams.get("petFriendly") === "true",
  }

  const initialPropertyTypes = {
    house: searchParams.get("house") === "true",
    apartment: searchParams.get("apartment") === "true",
    villa: searchParams.get("villa") === "true",
    cabin: searchParams.get("cabin") === "true",
  }

  // State for filters
  const [priceRange, setPriceRange] = useState<number[]>(initialPriceRange)
  const [amenities, setAmenities] = useState(initialAmenities)
  const [propertyTypes, setPropertyTypes] = useState(initialPropertyTypes)

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Price range
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    // Amenities
    Object.entries(amenities).forEach(([key, value]) => {
      if (value) {
        params.set(key, "true")
      } else {
        params.delete(key)
      }
    })

    // Property types
    Object.entries(propertyTypes).forEach(([key, value]) => {
      if (value) {
        params.set(key, "true")
      } else {
        params.delete(key)
      }
    })

    router.push(`/listings?${params.toString()}`)
  }

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 1000])
    setAmenities({
      wifi: false,
      pool: false,
      parking: false,
      airConditioning: false,
      petFriendly: false,
    })
    setPropertyTypes({
      house: false,
      apartment: false,
      villa: false,
      cabin: false,
    })

    // Keep only location, guests and date params
    const params = new URLSearchParams()
    if (searchParams.has("location")) params.set("location", searchParams.get("location")!)
    if (searchParams.has("guests")) params.set("guests", searchParams.get("guests")!)
    if (searchParams.has("date")) params.set("date", searchParams.get("date")!)

    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div className="bg-muted p-4 rounded-lg space-y-6">
      <h2 className="font-semibold text-lg">Filters</h2>

      <Accordion type="single" collapsible defaultValue="price" className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider value={priceRange} min={0} max={1000} step={10} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="property-type">
          <AccordionTrigger>Property Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {Object.entries(propertyTypes).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`property-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setPropertyTypes({
                        ...propertyTypes,
                        [key]: checked === true,
                      })
                    }
                  />
                  <Label htmlFor={`property-${key}`} className="capitalize">
                    {key}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="amenities">
          <AccordionTrigger>Amenities</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {Object.entries(amenities).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setAmenities({
                        ...amenities,
                        [key]: checked === true,
                      })
                    }
                  />
                  <Label htmlFor={`amenity-${key}`} className="capitalize">
                    {key === "wifi"
                      ? "WiFi"
                      : key === "airConditioning"
                        ? "Air Conditioning"
                        : key === "petFriendly"
                          ? "Pet Friendly"
                          : key}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-2 pt-4">
        <Button onClick={applyFilters} className="flex-1">
          Apply
        </Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  )
}
