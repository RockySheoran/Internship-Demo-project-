"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./mode-toggle"
import { SearchBar } from "./search-bar"

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const pathname = usePathname()

  const isHomePage = pathname === "/"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">StayFinder</span>
          </Link>
        </div>

        {!isHomePage && (
          <div className="hidden md:flex flex-1 items-center justify-center">
            {showSearch ? (
              <div className="w-full max-w-md">
                <SearchBar onClose={() => setShowSearch(false)} />
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full max-w-md justify-start text-muted-foreground"
                onClick={() => setShowSearch(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>Where are you going?</span>
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link
                href="/listings"
                className={cn(pathname?.startsWith("/listings") ? "text-foreground" : "text-muted-foreground")}
              >
                Explore
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link
                href="/become-a-host"
                className={cn(pathname?.startsWith("/become-a-host") ? "text-foreground" : "text-muted-foreground")}
              >
                Become a host
              </Link>
            </Button>
            <ModeToggle />
            <Button variant="outline" size="icon" asChild>
              <Link href="/auth/login">
                <User className="h-4 w-4" />
                <span className="sr-only">User account</span>
              </Link>
            </Button>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/listings" className="text-lg font-medium">
                  Explore
                </Link>
                <Link href="/become-a-host" className="text-lg font-medium">
                  Become a host
                </Link>
                <Link href="/auth/login" className="text-lg font-medium">
                  Login
                </Link>
                <Link href="/auth/register" className="text-lg font-medium">
                  Register
                </Link>
                <div className="mt-2">
                  <ModeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
