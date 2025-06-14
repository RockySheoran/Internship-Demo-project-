"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

// User interface definition
interface User {
  _id: string
  name: string
  email: string
  role: "user" | "host" | "admin"
  avatar?: string
  phone?: string
  verified: boolean
  createdAt: string
}

// Authentication context interface
interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isAuthenticated: boolean
  isHost: boolean
  isAdmin: boolean
}

// Registration data interface
interface RegisterData {
  name: string
  email: string
  password: string
  role?: "user" | "host"
}

// Create authentication context
const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Authentication Provider Component
 * Manages user authentication state and provides auth methods
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // API base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  /**
   * Initialize authentication state from localStorage
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("stayfinder_token")
        const savedUser = localStorage.getItem("stayfinder_user")

        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))

          // Verify token is still valid
          await verifyToken(savedToken)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        // Clear invalid data
        localStorage.removeItem("stayfinder_token")
        localStorage.removeItem("stayfinder_user")
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  /**
   * Verify token validity with backend
   */
  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      })

      if (!response.ok) {
        throw new Error("Token verification failed")
      }

      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error("Token verification error:", error)
      logout()
    }
  }

  /**
   * Login function
   */
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          toast({
            title: "Login Failed",
            description: data.error || "Invalid credentials",
            variant: "destructive",
          })
          return false
        }

        // Store authentication data
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem("stayfinder_token", data.token)
        localStorage.setItem("stayfinder_user", JSON.stringify(data.user))

        toast({
          title: "Welcome back!",
          description: `Hello ${data.user.name}, you're successfully logged in.`,
        })

        return true
      } catch (error) {
        console.error("Login error:", error)
        toast({
          title: "Login Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
        return false
      }
    },
    [API_URL],
  )

  /**
   * Registration function
   */
  const register = useCallback(
    async (userData: RegisterData): Promise<boolean> => {
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })

        const data = await response.json()

        if (!response.ok) {
          toast({
            title: "Registration Failed",
            description: data.error || "Failed to create account",
            variant: "destructive",
          })
          return false
        }

        // Auto-login after successful registration
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem("stayfinder_token", data.token)
        localStorage.setItem("stayfinder_user", JSON.stringify(data.user))

        toast({
          title: "Account Created!",
          description: `Welcome to StayFinder, ${data.user.name}!`,
        })

        return true
      } catch (error) {
        console.error("Registration error:", error)
        toast({
          title: "Registration Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
        return false
      }
    },
    [API_URL],
  )

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("stayfinder_token")
    localStorage.removeItem("stayfinder_user")

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })

    router.push("/")
  }, [router])

  /**
   * Update user data
   */
  const updateUser = useCallback(
    (userData: Partial<User>) => {
      if (user) {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        localStorage.setItem("stayfinder_user", JSON.stringify(updatedUser))
      }
    },
    [user],
  )

  // Computed properties
  const isAuthenticated = !!user && !!token
  const isHost = user?.role === "host" || user?.role === "admin"
  const isAdmin = user?.role === "admin"

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    isHost,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
