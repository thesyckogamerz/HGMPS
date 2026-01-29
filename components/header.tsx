"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, ShoppingBag, Search, ChevronDown, Sparkles, LogOut, LayoutDashboard, User as UserIcon, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { categories } from '@/lib/products'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

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
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (headerRef.current && isScrolled) {
        const rect = headerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
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

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isSearchActive])

  const handleCategoryHover = (show: boolean) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    if (show) {
      setShowCategories(true)
    } else {
      timeoutRef.current = setTimeout(() => {
        setShowCategories(false)
      }, 200) // Small delay for smoother exit
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
      {/* Animated gradient border effect */}
      {isScrolled && (
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(600px at var(--mouse-x) var(--mouse-y), rgba(212, 175, 55, 0.08), transparent 80%)`
          }}
        />
      )}

      {/* Search Overlay */}
      <div className={cn(
        "absolute inset-x-0 top-0 bg-white shadow-lg transition-all duration-300 ease-in-out z-50 flex items-center h-20 md:h-24",
        isSearchActive ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-full invisible"
      )}>
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-3xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search for products..." 
              className="w-full pl-12 pr-4 h-12 text-lg border-none bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
            />
          </form>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSearchActive(false)}
            className="shrink-0"
            suppressHydrationWarning
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo with enhanced animation */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group relative overflow-visible"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />
              <span className={cn(
                "text-2xl md:text-3xl font-serif font-bold tracking-wider transition-all duration-500 relative",
                isScrolled 
                  ? "text-taupe drop-shadow-sm" 
                  : "text-taupe-dark drop-shadow-lg"
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-gold relative group py-2",
                isScrolled ? "text-foreground/90" : "text-taupe-dark"
              )}
            >
              <span className="relative z-10">Home</span>
              <span className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent rounded-lg scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-gold to-amber-200 group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out" />
            </Link>
            
            {/* Enhanced Categories Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => handleCategoryHover(true)}
              onMouseLeave={() => handleCategoryHover(false)}
            >
              <button
                suppressHydrationWarning
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-gold flex items-center gap-1.5 py-2 px-4 rounded-lg group relative overflow-hidden",
                  isScrolled ? "text-foreground/90 hover:bg-sand-light/50" : "text-taupe-dark hover:bg-white/10"
                )}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent rounded-lg scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
                <span className="relative z-10">Collections</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-all duration-500 relative z-10",
                  showCategories && "rotate-180 text-gold"
                )} />
              </button>
              
              {/* Professional Mega Menu */}
              <div className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[680px] bg-white/98 backdrop-blur-2xl rounded-3xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden transition-all duration-500 ease-out",
                showCategories 
                  ? "opacity-100 visible translate-y-0 scale-100" 
                  : "opacity-0 invisible -translate-y-6 scale-95 pointer-events-none"
              )}>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-amber-50/30 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                
                {/* Header */}
                <div className="relative px-6 pt-5 pb-3 border-b border-sand-light/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-taupe-dark flex items-center gap-2">
                        <span className="w-1 h-4 bg-gradient-to-b from-gold to-amber-400 rounded-full" />
                        Explore Collections
                      </h3>
                      <p className="text-xs text-muted-foreground/70 mt-1">Discover our curated wellness categories</p>
                    </div>
                    <div className="text-xs font-medium text-gold bg-gold/10 px-3 py-1.5 rounded-full">
                      {categories.length} Categories
                    </div>
                  </div>
                </div>
                
                {/* Category Grid */}
                <div className="relative p-4 max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((category, index) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.id}`}
                        className="group/cat relative flex flex-col gap-2 p-4 rounded-2xl hover:bg-gradient-to-br hover:from-sand-light/60 hover:to-amber-50/40 transition-all duration-300 animate-fade-up border border-transparent hover:border-gold/20 hover:shadow-lg"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        {/* Icon Container */}
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-sand-light/80 to-amber-50/60 flex items-center justify-center group-hover/cat:from-gold/15 group-hover/cat:to-amber-100/50 transition-all duration-300 group-hover/cat:shadow-md group-hover/cat:scale-105">
                          <span className="text-2xl transition-transform duration-300 group-hover/cat:scale-110 relative z-10">
                            {category.icon}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/20 rounded-xl opacity-0 group-hover/cat:opacity-100 transition-opacity duration-300" />
                        </div>
                        
                        {/* Category Info */}
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-foreground group-hover/cat:text-taupe-dark transition-colors leading-tight mb-1">
                            {category.name}
                          </h4>
                          <p className="text-[11px] text-muted-foreground/60 line-clamp-2 leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                        
                        {/* Product Count Badge */}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground/70 font-medium">
                            {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
                          </span>
                          <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-muted-foreground/40 group-hover/cat:text-gold group-hover/cat:translate-x-0.5 transition-all duration-300" />
                        </div>
                        
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/0 via-transparent to-amber-200/0 opacity-0 group-hover/cat:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Footer with CTA */}
                <div className="relative px-6 py-4 bg-gradient-to-t from-sand-light/30 to-transparent border-t border-sand-light/40">
                  <Link 
                    href="/products"
                    className="flex items-center justify-center gap-2 text-sm font-medium text-taupe hover:text-taupe-dark transition-colors group/footer"
                  >
                    <span>View All Products</span>
                    <ChevronDown className="h-4 w-4 -rotate-90 group-hover/footer:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/products"
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-gold relative group py-2",
                isScrolled ? "text-foreground/90" : "text-taupe-dark"
              )}
            >
              <span className="relative z-10">All Products</span>
              <span className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent rounded-lg scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-gold to-amber-200 group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out" />
            </Link>
            
            {['About', 'Contact'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-gold relative group py-2",
                  isScrolled ? "text-foreground/90" : "text-taupe-dark"
                )}
              >
                <span className="relative z-10">{item}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent rounded-lg scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-gold to-amber-200 group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out" />
              </Link>
            ))}
          </nav>

          {/* Actions with enhanced interactions */}
          <div className="flex items-center gap-1 md:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all duration-300 group/search",
                isScrolled 
                  ? "hover:bg-sand-light/50 hover:shadow-sm" 
                  : "hover:bg-white/20 hover:shadow-gold/10"
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
                      isScrolled 
                        ? "hover:bg-sand-light/50 hover:shadow-sm" 
                        : "hover:bg-white/20 hover:shadow-gold/10"
                    )}
                    suppressHydrationWarning
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white/50 shadow-sm transition-transform duration-300 group-hover/account:scale-110">
                      {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="sr-only">Account Menu</span>
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
                  <DropdownMenuItem onClick={() => router.push('/admin')} className="rounded-xl flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-sand-light/50 focus:bg-sand-light/50 transition-colors">
                    <LayoutDashboard className="h-4 w-4 text-olive" />
                    <span className="text-sm font-medium">Admin Portal</span>
                  </DropdownMenuItem>
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
                    isScrolled 
                      ? "hover:bg-sand-light/50 hover:shadow-sm" 
                      : "hover:bg-white/20 hover:shadow-gold/10"
                  )}
                  suppressHydrationWarning
                >
                  <UserIcon className={cn(
                    "h-5 w-5 transition-all duration-500",
                    isScrolled ? "text-foreground/80 group-hover/account:text-gold" : "text-taupe-dark",
                    "group-hover/account:scale-110"
                  )} />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>
            )}

            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full transition-all duration-300 group/wishlist relative",
                  isScrolled 
                    ? "hover:bg-sand-light/50 hover:shadow-sm" 
                    : "hover:bg-white/20 hover:shadow-gold/10"
                )}
                suppressHydrationWarning
              >
                <Heart className={cn(
                  "h-5 w-5 transition-all duration-500",
                  isScrolled ? "text-foreground/80 group-hover/wishlist:text-red-500" : "text-taupe-dark",
                  "group-hover/wishlist:scale-110"
                )} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-white/50">
                    {wishlist.length}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all duration-300 group/cart relative",
                isScrolled 
                  ? "hover:bg-sand-light/50 hover:shadow-sm" 
                  : "hover:bg-white/20 hover:shadow-gold/10"
              )}
              onClick={() => setIsOpen(true)}
              suppressHydrationWarning
            >
              <ShoppingBag className={cn(
                "h-5 w-5 transition-all duration-500",
                isScrolled ? "text-foreground/80 group-hover/cart:text-gold" : "text-taupe-dark",
                "group-hover/cart:scale-110"
              )} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-gold to-amber-500 text-xs font-semibold flex items-center justify-center text-white animate-bounce-in shadow-lg">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>

            {/* Enhanced Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "lg:hidden rounded-full transition-all duration-300 group/menu",
                    isScrolled 
                      ? "hover:bg-sand-light/50 hover:shadow-sm" 
                      : "hover:bg-white/20 hover:shadow-gold/10"
                  )}
                  suppressHydrationWarning
                >
                  <Menu className={cn(
                    "h-5 w-5 transition-all duration-500",
                    isScrolled ? "text-foreground/80 group-hover/menu:text-gold" : "text-taupe-dark",
                    "group-hover/menu:scale-110"
                  )} />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[320px] sm:w-[380px] bg-gradient-to-b from-cream to-white border-l border-sand-light/30 p-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-amber-50/30" />
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="relative flex flex-col h-full pt-10">
                  {/* Sheet Header */}
                  <div className="px-6 pb-6 border-b border-sand-light/50">
                    <div className="flex items-center justify-between mb-4">
                      <Link 
                        href="/" 
                        className="text-2xl font-serif font-bold text-taupe hover:text-taupe-dark transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        AUREXA
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-sand-light/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                        suppressHydrationWarning
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground/80">Curated luxury for refined living</p>
                  </div>
                  
                  {/* Navigation Items */}
                  <nav className="flex-1 overflow-y-auto py-6 px-6">
                    <div className="space-y-1">
                      <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between text-lg font-medium py-4 px-4 rounded-xl hover:bg-sand-light/50 transition-all duration-300 group/item"
                      >
                        <span className="group-hover/item:text-taupe-dark transition-colors">
                          Home
                        </span>
                        <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground/50 group-hover/item:text-gold transition-all duration-300" />
                      </Link>
                      <Link
                        href="/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between text-lg font-medium py-4 px-4 rounded-xl hover:bg-sand-light/50 transition-all duration-300 group/item"
                      >
                        <span className="group-hover/item:text-taupe-dark transition-colors">
                          All Products
                        </span>
                        <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground/50 group-hover/item:text-gold transition-all duration-300" />
                      </Link>
                      {['About', 'Contact'].map((item) => (
                        <Link
                          key={item}
                          href={`/${item.toLowerCase()}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between text-lg font-medium py-4 px-4 rounded-xl hover:bg-sand-light/50 transition-all duration-300 group/item"
                        >
                          <span className="group-hover/item:text-taupe-dark transition-colors">
                            {item}
                          </span>
                          <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground/50 group-hover/item:text-gold transition-all duration-300" />
                        </Link>
                      ))}
                    </div>
                    
                    {/* Categories Section */}
                    <div className="mt-8 pt-6 border-t border-sand-light/50">
                      <p className="text-xs font-semibold text-taupe/80 uppercase tracking-wider mb-4 px-4 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gold" />
                        Collections
                      </p>
                      
                      <div className="grid gap-1">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/category/${category.id}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-sand-light/50 transition-all duration-300 group/cat"
                          >
                            <div className="relative">
                              <span className="text-xl transition-transform duration-300 group-hover/cat:scale-110">
                                {category.icon}
                              </span>
                              <div className="absolute inset-0 bg-gold/20 rounded-full scale-0 group-hover/cat:scale-100 transition-transform duration-300" />
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-medium group-hover/cat:text-taupe-dark transition-colors">
                                {category.name}
                              </span>
                              <p className="text-xs text-muted-foreground/70 mt-0.5">
                                {category.productCount} items
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </nav>
                  
                  {/* Footer Actions */}
                  <div className="p-6 border-t border-sand-light/50 bg-gradient-to-t from-white to-transparent">
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      className="w-full bg-gradient-to-r from-taupe to-taupe-dark hover:from-taupe-dark hover:to-taupe text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                      suppressHydrationWarning
                    >
                      <UserIcon className="h-4 w-4 mr-2 transition-transform duration-300 group-hover/btn:scale-110" />
                      Sign In to Your Account
                    </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground/70 mt-3">
                      Exclusive member benefits await
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}