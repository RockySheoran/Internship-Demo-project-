"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { SearchBar } from "@/components/search/search-bar"
import { NotificationBell } from "@/components/ui/notification-bell"
import { Menu, Search, User, Home, Calendar, Settings, LogOut, Plus, Heart, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Header Component
 * Main navigation header with authentication, search, and user menu
 */
export function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated, isHost } = useAuth()

  const isHomePage = pathname === "/"

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation items
  const navItems = [
    { href: "/listings", label: "Explore", icon: Search },
    { href: "/experiences", label: "Experiences", icon: Calendar },
    { href: "/help", label: "Help", icon: MessageCircle },
  ]

  // User menu items
  const userMenuItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/bookings", label: "My Bookings", icon: Calendar },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  const hostMenuItems = [
    { href: "/host/dashboard", label: "Host Dashboard", icon: Home },
    { href: "/host/listings", label: "My Listings", icon: Home },
    { href: "/host/bookings", label: "Reservations", icon: Calendar },
    { href: "/host/earnings", label: "Earnings", icon: Plus },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
          : "bg-background",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StayFinder
            </span>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        {!isHomePage && (
          <div className="hidden md:flex flex-1 items-center justify-center max-w-2xl mx-8">
            {showSearch ? (
              <div className="w-full">
                <SearchBar onClose={() => setShowSearch(false)} />
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full max-w-md justify-start text-muted-foreground hover:shadow-md transition-shadow"
                onClick={() => setShowSearch(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>Where are you going?</span>
              </Button>
            )}
          </div>
        )}

        {/* Navigation - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Navigation Links */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  pathname?.startsWith(item.href) && "text-foreground bg-muted",
                )}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          {/* Host Link */}
          {!isHost && (
            <Button variant="ghost" asChild>
              <Link href="/become-a-host" className="font-medium">
                Become a host
              </Link>
            </Button>
          )}

          {/* Theme Toggle */}
          <ModeToggle />

          {/* User Authentication */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <NotificationBell />

              {/* Host Quick Actions */}
              {isHost && (
                <Button size="sm" variant="outline" asChild>
                  <Link href="/host/listings/new">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Listing
                  </Link>
                </Button>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isHost && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-green-500">
                        <span className="sr-only">Host</span>
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />

                  {/* User Menu Items */}
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="cursor-pointer">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  {/* Host Menu Items */}
                  {isHost && (
                    <>
                      <DropdownMenuSeparator />
                      {hostMenuItems.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link href={item.href} className="cursor-pointer">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                {/* User Info */}
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3 pb-4 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      {isHost && (
                        <Badge variant="secondary" className="mt-1">
                          Host
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pb-4 border-b">
                    <Button asChild className="w-full">
                      <Link href="/auth/register">Sign up</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/auth/login">Log in</Link>
                    </Button>
                  </div>
                )}

                {/* Navigation */}
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Button key={item.href} variant="ghost" asChild className="justify-start">
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  ))}

                  {!isHost && (
                    <Button variant="ghost" asChild className="justify-start">
                      <Link href="/become-a-host">
                        <Plus className="mr-2 h-4 w-4" />
                        Become a host
                      </Link>
                    </Button>
                  )}
                </nav>

                {/* User Menu - Mobile */}
                {isAuthenticated && (
                  <>
                    <div className="border-t pt-4">
                      <div className="flex flex-col space-y-2">
                        {userMenuItems.map((item) => (
                          <Button key={item.href} variant="ghost" asChild className="justify-start">
                            <Link href={item.href}>
                              <item.icon className="mr-2 h-4 w-4" />
                              {item.label}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {isHost && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium mb-2 text-muted-foreground">Host Menu</p>
                        <div className="flex flex-col space-y-2">
                          {hostMenuItems.map((item) => (
                            <Button key={item.href} variant="ghost" asChild className="justify-start">
                              <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <Button variant="ghost" onClick={handleLogout} className="justify-start w-full text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </>
                )}

                {/* Theme Toggle - Mobile */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
