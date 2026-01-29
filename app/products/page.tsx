"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { categories } from "@/lib/products";
import { getAllProducts } from "@/lib/products-db";
import type { Product } from "@/lib/cart-context";
import { SlidersHorizontal, X, Check, Grid3X3, LayoutGrid, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Newest", value: "newest" },
];

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [gridView, setGridView] = useState<"compact" | "large">("large");
  const [isVisible, setIsVisible] = useState(false);

  // Fetch products from database on mount
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

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
        // Sort by badge presence (badge products first)
        filtered.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
        break;
      default:
        // Featured sort - products with badges come first
        filtered.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [sortBy, selectedCategories, priceRange, inStockOnly]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || inStockOnly || priceRange[1] < 10000;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-[30vh] md:h-[40vh] overflow-hidden bg-gradient-to-br from-sand-light via-cream to-sand pt-16">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%238B7355' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
          <h1
            className={`text-4xl md:text-6xl font-serif text-taupe-dark mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            All Products
          </h1>
          <p
            className={`text-muted-foreground max-w-xl transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Explore our complete collection of natural wellness products
          </p>
          <p
            className={`mt-4 text-sm text-taupe transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {filteredProducts.length} of {products.length} Products
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </Button>

              {/* View Toggle */}
              <div className="hidden md:flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setGridView("large")}
                  className={`p-2 transition-colors ${
                    gridView === "large"
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridView("compact")}
                  className={`p-2 transition-colors ${
                    gridView === "compact"
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>

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
              showFilters ? "max-h-60 mt-4" : "max-h-0"
            }`}
          >
            <div className="space-y-4 pb-2">
              {/* Category Pills */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Categories:
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedCategories.includes(cat.id)
                          ? "bg-primary text-white border-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="hidden sm:inline">{cat.name}</span>
                      {selectedCategories.includes(cat.id) && (
                        <Check className="w-3 h-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-muted-foreground">
                    Max Price:
                  </label>
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
                  <span className="text-sm min-w-[80px]">
                    Rs. {priceRange[1]}
                  </span>
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

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div
            className={`grid gap-4 md:gap-6 ${
              gridView === "compact"
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up opacity-0"
                style={{
                  animationDelay: `${index * 30}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <ProductCard product={product} compact={gridView === "compact"} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters to find what you&apos;re looking for.
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
