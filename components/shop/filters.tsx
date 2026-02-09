"use client"

import Link from "next/link"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Category } from "@/lib/products"

interface FilterProps {
  categories: Category[]
  activeCategorySlug?: string
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  inStockOnly: boolean
  setInStockOnly: (inStock: boolean) => void
  onClearFilters: () => void
  className?: string
}

export function ShopFilters({
  categories,
  activeCategorySlug,
  priceRange,
  setPriceRange,
  inStockOnly,
  setInStockOnly,
  onClearFilters,
  className,
}: FilterProps) {

  // Group categories by parent
  const parentCategories = categories.filter(c => !c.parentId)
  const getChildCategories = (parentId: string) => categories.filter(c => c.parentId === parentId)

  return (
    <div className={cn("space-y-8", className)}>
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-medium">Categories</h3>
        <div className="space-y-2">
          {parentCategories.map(parent => {
            const children = getChildCategories(parent.id)
            const isActive = parent.slug === activeCategorySlug
            const isChildActive = children.some(c => c.slug === activeCategorySlug)
            const isOpen = isActive || isChildActive

            return (
              <div key={parent.id} className="space-y-2">
                <Link
                  href={`/category/${parent.slug}`}
                  className={cn(
                    "flex items-center justify-between text-sm transition-colors hover:text-primary",
                    isActive ? "font-semibold text-primary" : "text-muted-foreground"
                  )}
                >
                  {parent.name}
                  {/* {children.length > 0 && (
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")} />
                  )} */}
                </Link>
                
                {/* Subcategories (always show for now, or collapsible) */}
                {children.length > 0 && (
                  <div className={cn("ml-4 space-y-2 border-l border-border pl-4", isOpen ? "block" : "hidden")}>
                    {children.map(child => (
                      <Link
                        key={child.id}
                        href={`/category/${child.slug}`}
                        className={cn(
                          "block text-sm transition-colors hover:text-primary",
                          child.slug === activeCategorySlug
                            ? "font-medium text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-medium">Price Range</h3>
        <div className="pt-2">
           <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Rs. {priceRange[0]}</span>
              <span>Rs. {priceRange[1]}</span>
            </div>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-medium">Availability</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={cn(
            "w-5 h-5 rounded border border-input flex items-center justify-center transition-colors",
            inStockOnly ? "bg-primary border-primary text-white" : "group-hover:border-primary"
          )}>
            {inStockOnly && <Check className="h-3 w-3" />}
          </div>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="hidden"
          />
          <span className="text-sm text-muted-foreground group-hover:text-foreground">
            In Stock Only
          </span>
        </label>
      </div>

      {/* Clear Filters */}
      {(inStockOnly || priceRange[0] > 0 || priceRange[1] < 10000) && (
        <Button
          variant="outline"
          className="w-full"
          onClick={onClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
