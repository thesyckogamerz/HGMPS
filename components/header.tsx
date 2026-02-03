"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Search, Sparkles, LogOut, LayoutDashboard, User as UserIcon, Heart, ChevronDown, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { categories } from '@/lib/products'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { SearchBar } from './header/search-bar'
import { MegaMenu } from './header/mega-menu'
import { NavLinks } from './header/nav-links'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { totalItems, setIsOpen } = useCart()
  const { wishlist } = useWishlist()
  const headerRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (headerRef.current && isScrolled) {
        const rect = headerRef.current.getBoundingClientRect()
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    headerRef.current?.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      headerRef.current?.removeEventListener('mousemove', handleMouseMove)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isScrolled])

  const handleCategoryHover = (show: boolean) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (show) {
      setShowCategories(true)
    } else {
      timeoutRef.current = setTimeout(() => setShowCategories(false), 200)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchActive(false)
      setSearchQuery('')
    }
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        isScrolled
          ? "bg-white/98 backdrop-blur-xl shadow-glass py-2 border-b border-white/20"
          : "bg-gradient-to-b from-white/10 to-transparent py-4"
      )}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      } as React.CSSProperties}
    >
      {isScrolled && (
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(600px at var(--mouse-x) var(--mouse-y), rgba(212, 175, 55, 0.08), transparent 80%)`
          }}
        />
      )}

      <SearchBar 
        isActive={isSearchActive}
        onClose={() => setIsSearchActive(false)}
        onSubmit={handleSearchSubmit}
        query={searchQuery}
        setQuery={setSearchQuery}
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group relative overflow-visible">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />
              <span className={cn(
                "text-2xl md:text-3xl font-serif font-bold tracking-wider transition-all duration-500 relative",
                isScrolled ? "text-taupe drop-shadow-sm" : "text-taupe-dark drop-shadow-lg"
              )}>
                AUREXA
                <Sparkles className="absolute -top-1 -right-3 h-3 w-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-gold to-amber-200 group-hover:w-full transition-all duration-500 ease-out" />
            </div>
            <span className={cn(
              "text-xs font-medium tracking-widest uppercase transition-all duration-500 hidden md:block",
              isScrolled ? "text-muted-foreground/80" : "text-taupe-dark/90"
            )}>
              Luxury Living
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <NavLinks isScrolled={isScrolled} />
            <MegaMenu 
              isVisible={showCategories}
              onMouseEnter={() => handleCategoryHover(true)}
              onMouseLeave={() => handleCategoryHover(false)}
            />
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all duration-300 group/search",
                isScrolled ? "hover:bg-sand-light/50 hover:shadow-sm" : "hover:bg-white/20 hover:shadow-gold/10"
              )}
              onClick={() => setIsSearchActive(true)}
              suppressHydrationWarning
            >
              <Search className={cn(
                "h-5 w-5 transition-transform duration-500",
                isScrolled ? "text-foreground/80 group-hover/search:text-gold" : "text-taupe-dark",
                isSearchActive && "rotate-90"
              )} />
              <span className="sr-only">Search</span>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full transition-all duration-300 hidden md:flex group/account",
                      isScrolled ? "hover:bg-sand-light/50 hover:shadow-sm" : "hover:bg-white/20 hover:shadow-gold/10"
                    )}
                    suppressHydrationWarning
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white/50 shadow-sm transition-transform duration-300 group-hover/account:scale-110">
                      {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 border-sand-light/30 shadow-xl backdrop-blur-xl bg-white/95">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-taupe-dark">{user.user_metadata?.full_name || 'User'}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{user.email || user.user_metadata?.phone_number}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-sand-light/40" />
                  <DropdownMenuItem onClick={() => router.push('/account')} className="rounded-xl flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-sand-light/50 focus:bg-sand-light/50 transition-colors">
                    <UserIcon className="h-4 w-4 text-taupe" />
                    <span className="text-sm font-medium">My Account</span>
                  </DropdownMenuItem>
                  {user?.email?.toLowerCase() === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'HGMPS@gmail.com').toLowerCase() && (
                    <DropdownMenuItem onClick={() => router.push('/admin')} className="hidden md:flex rounded-xl items-center gap-2 px-3 py-2 cursor-pointer hover:bg-sand-light/50 focus:bg-sand-light/50 transition-colors">
                      <LayoutDashboard className="h-4 w-4 text-olive" />
                      <span className="text-sm font-medium">Admin Portal</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-sand-light/40" />
                  <DropdownMenuItem 
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push('/');
                    }} 
                    className="rounded-xl flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full transition-all duration-300 hidden md:flex group/account",
                    isScrolled ? "hover:bg-sand-light/50 hover:shadow-sm" : "hover:bg-white/20 hover:shadow-gold/10"
                  )}
                  suppressHydrationWarning
                >
                  <UserIcon className={cn(
                    "h-5 w-5 transition-all duration-500",
                    isScrolled ? "text-foreground/80 group-hover/account:text-gold" : "text-taupe-dark"
                  )} />
                </Button>
              </Link>
            )}

            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full transition-all duration-300 group/wishlist relative",
                  isScrolled ? "hover:bg-sand-light/50 hover:shadow-sm" : "hover:bg-white/20 hover:shadow-gold/10"
                )}
                suppressHydrationWarning
              >
                <Heart className={cn(
                  "h-5 w-5 transition-all duration-500",
                  isScrolled ? "text-foreground/80 group-hover/wishlist:text-red-500" : "text-taupe-dark"
                )} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-white/50">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all duration-300 group/cart relative",
                isScrolled ? "hover:bg-sand-light/50 hover:shadow-sm" : "hover:bg-white/20 hover:shadow-gold/10"
              )}
              onClick={() => setIsOpen(true)}
              suppressHydrationWarning
            >
              <ShoppingBag className={cn(
                "h-5 w-5 transition-all duration-500",
                isScrolled ? "text-foreground/80 group-hover/cart:text-gold" : "text-taupe-dark"
              )} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-gold to-amber-500 text-xs font-semibold flex items-center justify-center text-white animate-bounce-in shadow-lg">
                  {totalItems}
                </span>
              )}
            </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "lg:hidden rounded-full transition-all duration-300 group/menu",
                    isScrolled ? "hover:bg-sand-light/50 hover:shadow-sm" : "hover:bg-white/20 hover:shadow-gold/10"
                  )}
                  suppressHydrationWarning
                >
                  <Menu className={cn(
                    "h-5 w-5 transition-all duration-500",
                    isScrolled ? "text-foreground/80 group-hover/menu:text-gold" : "text-taupe-dark"
                  )} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[380px] bg-gradient-to-b from-cream to-white border-l border-sand-light/30 p-0 overflow-hidden">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="relative flex flex-col h-full pt-10">
                  <div className="px-6 pb-6 border-b border-sand-light/50">
                    <div className="flex items-center justify-between mb-4">
                      <Link href="/" className="text-2xl font-serif font-bold text-taupe" onClick={() => setIsMobileMenuOpen(false)}>AUREXA</Link>
                      <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} suppressHydrationWarning><X className="h-5 w-5" /></Button>
                    </div>
                  </div>
                  <nav className="flex-1 overflow-y-auto py-6 px-6">
                    <div className="space-y-1">
                      <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-lg font-medium py-4 px-4 rounded-xl hover:bg-sand-light/50 transition-all duration-300">Home <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground/50" /></Link>
                      <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-lg font-medium py-4 px-4 rounded-xl hover:bg-sand-light/50 transition-all duration-300">All Products <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground/50" /></Link>
                      {['About', 'Contact'].map((item) => (
                        <Link key={item} href={`/${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-lg font-medium py-4 px-4 rounded-xl hover:bg-sand-light/50 transition-all duration-300">{item} <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground/50" /></Link>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-sand-light/50">
                      <p className="text-xs font-semibold text-taupe/80 uppercase tracking-wider mb-4 px-4 flex items-center gap-2">Collections</p>
                      <div className="grid gap-1">
                        {categories.map((category) => (
                          <Link key={category.id} href={`/category/${category.id}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-sand-light/50 transition-all duration-300 group/cat">
                            <span className="text-xl">{category.icon}</span>
                            <div className="flex-1">
                              <span className="text-sm font-medium">{category.name}</span>
                              <p className="text-xs text-muted-foreground/70 mt-0.5">{category.productCount} items</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}