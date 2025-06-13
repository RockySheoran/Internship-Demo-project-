"use server"

import { revalidatePath } from "next/cache"

// In a real app, these functions would interact with a database
// For now, we'll just simulate the actions with delays

export async function loginUser(credentials: { email: string; password: string }) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, we would validate credentials against a database
  // For demo purposes, we'll accept any email that ends with @example.com
  if (!credentials.email.endsWith("@example.com")) {
    throw new Error("Invalid credentials")
  }

  // In a real app, we would set a session cookie or token
  return { success: true }
}

export async function registerUser(userData: { name: string; email: string; password: string }) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, we would create a new user in the database
  // For demo purposes, we'll accept any valid-looking data
  if (!userData.email.includes("@") || userData.password.length < 6) {
    throw new Error("Invalid user data")
  }

  return { success: true }
}

export async function createBooking(bookingData: {
  propertyId: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
}) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real app, we would create a booking in the database
  // and check for availability, user authentication, etc.

  // Revalidate the bookings page to show the new booking
  revalidatePath("/bookings")

  return {
    _id: Math.random().toString(36).substring(2, 15),
    ...bookingData,
    userId: "user123",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  }
}

export async function createListing(listingData: any) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real app, we would create a listing in the database

  // Revalidate the listings page to show the new listing
  revalidatePath("/listings")

  return {
    _id: Math.random().toString(36).substring(2, 15),
    ...listingData,
    createdAt: new Date().toISOString(),
  }
}
