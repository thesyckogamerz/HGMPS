"use client"

import React, { useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  isActive: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  query: string
  setQuery: (query: string) => void
}

export function SearchBar({ isActive, onClose, onSubmit, query, setQuery }: SearchBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isActive && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isActive])

  return (
    <div className={cn(
      "absolute inset-x-0 top-0 bg-white shadow-lg transition-all duration-300 ease-in-out z-50 flex items-center h-20 md:h-24",
      isActive ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-full invisible"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <form onSubmit={onSubmit} className="flex-1 max-w-3xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search for products..." 
            className="w-full pl-12 pr-4 h-12 text-lg border-none bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            suppressHydrationWarning
          />
        </form>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="shrink-0"
          suppressHydrationWarning
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
