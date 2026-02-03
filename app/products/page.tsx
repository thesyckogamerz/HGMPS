"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { categories } from "@/lib/products";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/lib/cart-context";
import { SlidersHorizontal, X, Check, Grid3X3, LayoutGrid, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
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
        filtered.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [sortBy, selectedCategories, priceRange, inStockOnly, products]);

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

  const hasActiveFilters = selectedCategories.length > 0 || inStockOnly || priceRange[0] > 0 || priceRange[1] < 10000;

  return (
    <div className="bg-sage-50 min-h-screen pb-20">
      <div className="bg-taupe py-16 pt-32 text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">All Products</h1>
          <p className="text-cream/80 text-lg max-w-2xl font-light">
            Explore our complete collection of natural wellness products.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(showFilters && "bg-taupe text-cream")}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters {hasActiveFilters && "(!)"}
              </Button>
              
              <div className="flex items-center gap-1 bg-taupe/5 p-1 rounded-full">
                <button 
                  onClick={() => setGridView("large")}
                  className={cn("p-1.5 rounded-full", gridView === "large" ? "bg-white text-taupe" : "text-taupe/40")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setGridView("compact")}
                  className={cn("p-1.5 rounded-full", gridView === "compact" ? "bg-white text-taupe" : "text-taupe/40")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-taupe/5 text-taupe text-sm border-none rounded-full px-4 py-2 outline-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid md:grid-cols-3 gap-8 text-taupe">
                <div>
                  <label className="text-sm font-medium mb-4 block">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                          selectedCategories.includes(cat.id) ? "bg-taupe text-cream" : "bg-taupe/5 hover:bg-taupe/10"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-4 block">Price Range (Up to Rs. {priceRange[1]})</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-1.5 bg-taupe/10 rounded-lg appearance-none cursor-pointer accent-taupe"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-4 block">Availability</label>
                  <button
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm",
                      inStockOnly ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-neutral-50 border-neutral-100"
                    )}
                  >
                    <span>In Stock Only</span>
                    {inStockOnly && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-taupe/40">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p>Gathering nature's best...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={cn(
            "grid gap-6",
            gridView === "large" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          )}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-neutral-100 mt-8">
             <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-taupe/20">
               <Search className="w-8 h-8" />
             </div>
             <p className="text-taupe font-serif text-xl mb-2">No products found</p>
             <Button variant="outline" className="mt-4" onClick={clearAllFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
