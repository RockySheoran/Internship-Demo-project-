"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Search, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onClose?: () => void
}

export function SearchBar({ onClose }: SearchBarProps) {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [guests, setGuests] = useState("1")
  const [date, setDate] = useState<Date>()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Build query parameters
    const params = new URLSearchParams()
    if (location) params.append("location", location)
    if (guests) params.append("guests", guests)
    if (date) params.append("date", format(date, "yyyy-MM-dd"))

    // Navigate to listings page with search params
    router.push(`/listings?${params.toString()}`)

    // Close search if provided
    if (onClose) onClose()
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where are you going?"
          className="pl-10 rounded-l-md rounded-r-none border-r-0"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[180px] justify-start text-left font-normal rounded-none border-r-0",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      <Input
        type="number"
        min="1"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        placeholder="Guests"
        className="max-w-[80px] rounded-none border-r-0"
      />

      <Button type="submit" className="rounded-l-none">
        Search
      </Button>

      {onClose && (
        <Button type="button" variant="ghost" size="icon" className="ml-2" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close search</span>
        </Button>
      )}
    </form>
  )
}
