"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { products, categories } from "@/lib/products";
import { Search, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularSearches = [
    "Ashwagandha",
    "Immunity",
    "Sleep",
    "Collagen",
    "Turmeric",
    "Energy",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <section className="bg-sand-light/50 border-b border-border py-8 md:py-12 pt-24">
        <div className="container mx-auto px-4">
          <div
            className={`max-w-2xl mx-auto transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h1 className="text-2xl md:text-3xl font-serif text-foreground text-center mb-6">
              Search Products
            </h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, categories..."
                className="w-full pl-12 pr-12 py-4 border border-border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-card"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Popular Searches */}
            {!searchQuery && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="text-sm px-3 py-1 rounded-full bg-card border border-border hover:border-primary transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {searchQuery ? (
          <>
            {/* Results Count */}
            <p className="text-muted-foreground mb-6">
              {filteredProducts.length + filteredCategories.length} results for{" "}
              <span className="text-foreground font-medium">
                &quot;{searchQuery}&quot;
              </span>
            </p>

            {/* Category Results */}
            {filteredCategories.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-serif text-foreground mb-4">
                  Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {filteredCategories.map((category, index) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className={`bg-card rounded-xl border border-border p-4 text-center hover:shadow-md hover:border-primary/50 transition-all animate-slide-up opacity-0`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <span className="text-3xl mb-2 block">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Product Results */}
            {filteredProducts.length > 0 ? (
              <div>
                <h2 className="text-lg font-serif text-foreground mb-4">
                  Products
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-slide-up opacity-0"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              filteredCategories.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn&apos;t find any products matching &quot;{searchQuery}&quot;.
                    Try a different search term.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              )
            )}
          </>
        ) : (
          /* Browse by Category */
          <div>
            <h2 className="text-xl font-serif text-foreground mb-6">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className={`group bg-card rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/50 transition-all animate-slide-up opacity-0`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <span className="text-4xl mb-3 block">{category.icon}</span>
                  <h3 className="font-medium text-foreground mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {category.description}
                  </p>
                  <span className="text-primary text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Loading() {
  return null;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchContent />
    </Suspense>
  );
}
