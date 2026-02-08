"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { categories, products, type Product } from "@/lib/products";
import { ShopFilters } from "@/components/shop/filters";
import { ChevronLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Newest", value: "newest" },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = categories.find((c) => c.slug === slug);

  // State
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtering Logic
  useEffect(() => {
    if (!category) return;

    // 1. Category Hierarchy Filtering
    let filtered = products.filter((p) => {
      // Direct match
      if (p.category === slug) return true;
      
      // If current category is a parent, include children
      // Find all categories where parentId === current category id
      const childCategories = categories.filter(c => c.parentId === category.id);
      const childIds = childCategories.map(c => c.id);
      
      return childIds.includes(p.category);
    });

    // 2. Price Filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // 3. Stock Filter
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // 4. Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [slug, sortBy, priceRange, inStockOnly, category]);

  if (!mounted) return null;

  if (!category) {
    return (
      <main className="container mx-auto px-4 py-20 text-center pt-32">
        <h1 className="text-2xl font-serif text-foreground mb-4">
          Category Not Found
        </h1>
        <Link href="/shop" className="text-primary hover:underline">
          Return to Shop
        </Link>
      </main>
    );
  }

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[30vh] md:h-[40vh] overflow-hidden pt-16">
        <div className="absolute inset-0 bg-secondary/80" />
        {/* Abstract Pattern */}
         <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%23000000' fillOpacity='0.4'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              {category.name}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {category.description}
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb / Back */}
        <div className="mb-8 flex items-center justify-between">
           <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>

            {/* Mobile Filter Trigger */}
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <ShopFilters
                    categories={categories}
                    activeCategorySlug={slug}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    inStockOnly={inStockOnly}
                    setInStockOnly={setInStockOnly}
                    onClearFilters={clearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
             <ShopFilters
                categories={categories}
                activeCategorySlug={slug}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                onClearFilters={clearFilters}
              />
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                 <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                 <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-transparent border border-input rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
                <div className="text-center py-20 border rounded-lg bg-secondary/20">
                  <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
                  <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

