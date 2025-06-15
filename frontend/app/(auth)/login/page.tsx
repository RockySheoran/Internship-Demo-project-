"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/providers/auth-provider"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github, Chrome, AlertCircle, CheckCircle, Home } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Enhanced Login Page Component
 * Professional authentication with advanced features
 */
export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated, loading: authLoading } = useAuth()

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loginAttempts, setLoginAttempts] = useState(0)

  // Redirect URL after login
  const redirectTo = searchParams.get("redirect") || "/"
  const message = searchParams.get("message")

  /**
   * Redirect if already authenticated
   */
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, authLoading, router, redirectTo])

  /**
   * Handle form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setLoginAttempts((prev) => prev + 1)

    try {
      const success = await login(formData.email, formData.password)

      if (success) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem("stayfinder_remember", "true")
        }

        router.push(redirectTo)
      } else {
        setErrors({ general: "Invalid email or password" })
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "Something went wrong. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Demo login function
   */
  const handleDemoLogin = async (role: "user" | "host") => {
    const demoCredentials = {
      user: { email: "demo@user.com", password: "password123" },
      host: { email: "demo@host.com", password: "password123" },
    }

    setFormData(demoCredentials[role])
    setIsLoading(true)

    const success = await login(demoCredentials[role].email, demoCredentials[role].password)

    if (success) {
      router.push(redirectTo)
    }
    setIsLoading(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Home className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome back to StayFinder</h1>
            <p className="text-xl opacity-90 mb-8 max-w-md">
              Continue your journey to discover amazing places and create unforgettable memories.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">2M+</div>
                <div className="text-sm opacity-80">Happy Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold">100k+</div>
                <div className="text-sm opacity-80">Properties</div>
              </div>
              <div>
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-sm opacity-80">Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                  <Home className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
              <CardDescription className="text-base">Sign in to your account to continue</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Success/Error Messages */}
              {message && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {errors.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Demo Login Buttons */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">Quick Demo Access:</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin("user")}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    Demo User
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin("host")}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    Demo Host
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className={cn("pl-10 h-11", errors.email && "border-red-500 focus-visible:ring-red-500")}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className={cn("pl-10 pr-10 h-11", errors.password && "border-red-500 focus-visible:ring-red-500")}
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me for 30 days
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Social Login */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or sign in with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" disabled={isLoading} className="w-full h-11">
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" disabled={isLoading} className="w-full h-11">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </div>

              {/* Rate Limiting Warning */}
              {loginAttempts >= 3 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Multiple failed attempts detected. Please wait a moment before trying again.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href={`/auth/register${redirectTo !== "/" ? `?redirect=${redirectTo}` : ""}`}
                  className="text-blue-600 hover:text-blue-500 font-medium hover:underline"
                >
                  Create one now
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
