"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { categories, products, type Product } from "@/lib/products";
import { ChevronLeft, SlidersHorizontal, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let filtered = products.filter((p) => p.category === slug);

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

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
  }, [slug, sortBy, priceRange, inStockOnly]);

  if (!category) {
    return (
      <main className="container mx-auto px-4 py-20 text-center pt-24">
        <h1 className="text-2xl font-serif text-foreground mb-4">
          Category Not Found
        </h1>
        <Link href="/" className="text-primary hover:underline">
          Return to Home
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div
        ref={headerRef}
        className="relative h-[40vh] md:h-[50vh] overflow-hidden pt-16"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-taupe/80 to-taupe-dark/90" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div
            className={`flex items-center gap-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-4xl">
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">
                {category.name}
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-xl">
                {category.description}
              </p>
            </div>
          </div>
          <p
            className={`mt-4 text-white/60 text-sm transition-all duration-900 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {filteredProducts.length} Products
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {(inStockOnly || priceRange[0] > 0 || priceRange[1] < 10000) && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-transparent border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Expandable Filters */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showFilters ? "max-h-40 mt-4" : "max-h-0"
            }`}
          >
            <div className="flex flex-wrap gap-4 pb-2">
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">Price:</label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-32 accent-primary"
                />
                <span className="text-sm">Up to Rs. {priceRange[1]}</span>
              </div>

              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-all ${
                  inStockOnly
                    ? "bg-primary text-white border-primary"
                    : "border-border hover:border-primary"
                }`}
              >
                {inStockOnly && <Check className="w-3 h-3" />}
                In Stock Only
              </button>

              {(inStockOnly || priceRange[1] < 10000) && (
                <button
                  onClick={() => {
                    setPriceRange([0, 10000]);
                    setInStockOnly(false);
                  }}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              No products match your filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setPriceRange([0, 10000]);
                setInStockOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
