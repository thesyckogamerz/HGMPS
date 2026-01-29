"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, ShoppingBag, User, Heart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems, setIsOpen } = useCart()
  const { wishlist } = useWishlist()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const isActive = (path: string) => pathname === path

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <nav className="flex items-center justify-around h-16 bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl px-2">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
              isActive("/") ? "text-gold scale-110" : "text-muted-foreground hover:text-gold/70"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Home</span>
            {isActive("/") && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-gold" />}
          </Link>

          <button
            onClick={() => setIsSearchOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
              isSearchOpen ? "text-gold scale-110" : "text-muted-foreground hover:text-gold/70"
            )}
            suppressHydrationWarning
          >
            <Search className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Search</span>
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground relative group"
            suppressHydrationWarning
          >
            <div className="relative transition-transform duration-300 group-active:scale-90">
              <ShoppingBag className="h-6 w-6 text-taupe" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-white/50">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">Cart</span>
          </button>

          <Link
            href="/wishlist"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
              isActive("/wishlist") ? "text-gold scale-110" : "text-muted-foreground hover:text-gold/70"
            )}
          >
            <div className="relative">
              <Heart className={cn("h-5 w-5", isActive("/wishlist") && "fill-gold")} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </div>
            <span className="text-[10px] font-semibold">Wishlist</span>
            {isActive("/wishlist") && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-gold" />}
          </Link>

          <Link
            href="/account"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
              isActive("/account") ? "text-gold scale-110" : "text-muted-foreground hover:text-gold/70"
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Account</span>
            {isActive("/account") && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-gold" />}
          </Link>
        </nav>
      </div>

      {/* Mobile Search Sheet */}
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0">
          <SheetHeader className="px-4 py-4 border-b">
            <SheetTitle>Search Products</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-12 text-lg bg-secondary/50"
                suppressHydrationWarning
              />
              <div className="mt-4 flex justify-end">
                 <Button type="submit" className="bg-gold text-white hover:bg-gold/90 w-full" suppressHydrationWarning>
                    Search
                 </Button>
              </div>
            </form>
            
            <div className="mt-8">
              <p className="text-sm font-medium text-muted-foreground mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Ashwagandha", "Sleep", "Immunity", "Energy", "Skin"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term)
                      // Optional: auto-submit
                    }}
                    className="px-3 py-1.5 bg-secondary rounded-full text-sm hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
