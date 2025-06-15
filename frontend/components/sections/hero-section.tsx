"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search/search-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Users, Home, Award, MapPin, Calendar, TrendingUp, Shield, Heart, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

/**
 * Hero Section Component
 * Enhanced landing section with animations, search, and value propositions
 */
export function HeroSection() {
  const [searchFocused, setSearchFocused] = useState(false)

  // Floating badges data
  const floatingBadges = [
    { icon: Star, text: "4.9 Rating", color: "from-yellow-500 to-orange-500", delay: 0 },
    { icon: Users, text: "2M+ Users", color: "from-blue-500 to-purple-500", delay: 0.2 },
    { icon: Home, text: "100k+ Properties", color: "from-green-500 to-emerald-500", delay: 0.4 },
    { icon: Shield, text: "Secure Booking", color: "from-purple-500 to-pink-500", delay: 0.6 },
  ]

  // Trust indicators
  const trustIndicators = [
    { icon: Star, value: "4.9/5", label: "from 50k+ reviews" },
    { icon: Users, value: "2M+", label: "happy travelers" },
    { icon: Home, value: "100k+", label: "unique properties" },
    { icon: TrendingUp, value: "98%", label: "booking success rate" },
  ]

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900" />
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Floating Elements */}
      {floatingBadges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: badge.delay, duration: 0.6 }}
          className={`absolute hidden lg:block ${
            index === 0
              ? "top-20 left-10"
              : index === 1
                ? "top-32 right-16"
                : index === 2
                  ? "bottom-40 left-16"
                  : "bottom-20 right-20"
          }`}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-3">
              <Badge className={`bg-gradient-to-r ${badge.color} text-white border-0`}>
                <badge.icon className="w-4 h-4 mr-1" />
                {badge.text}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Header Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2 text-sm">
              <Award className="w-4 h-4 mr-2" />
              #1 Booking Platform Worldwide
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Find your{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  perfect stay
                </span>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
              </span>{" "}
              anywhere in the world
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Discover unique places to stay, from cozy apartments to luxury villas. Book with confidence and create
              unforgettable memories with our trusted community.
            </p>
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-12"
          >
            <Card
              className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl border-0 transition-all duration-300 ${
                searchFocused ? "shadow-3xl scale-105" : ""
              }`}
            >
              <CardContent className="p-8">
                <SearchBar onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Call-to-Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300 group"
              asChild
            >
              <Link href="/listings">
                <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Exploring
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 text-lg px-8 py-4 h-auto hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 group"
              asChild
            >
              <Link href="/become-a-host">
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Become a Host
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center mb-2">
                  <indicator.icon className="w-5 h-5 mr-2 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {indicator.value}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{indicator.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-4"
          >
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link href="/destinations/popular">
                <MapPin className="w-4 h-4 mr-1" />
                Popular Destinations
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link href="/experiences">
                <Calendar className="w-4 h-4 mr-1" />
                Unique Experiences
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link href="/deals">
                <TrendingUp className="w-4 h-4 mr-1" />
                Special Deals
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
