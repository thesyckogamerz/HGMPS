"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { products, categories } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { cn, getValidImageUrl } from "@/lib/utils";
import { fetchProductById } from "@/lib/api";

import {
  ChevronLeft,
  Star,
  Minus,
  Plus,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  Check,
  MessageCircle,
  ChevronRight,
  Percent,
} from "lucide-react";
import { QuantityVariant } from "@/lib/cart-context";


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<QuantityVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const data = await fetchProductById(productId);
      if (data) {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        if (data.minQuantity) {
          setQuantity(data.minQuantity);
        }
      }
      setLoading(false);
      setIsVisible(true);
    }
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-20 text-center pt-24">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-20 text-center pt-24">
        <h1 className="text-2xl font-serif text-foreground mb-4">
          Product Not Found
        </h1>
        <Link href="/products" className="text-primary hover:underline">
          Browse All Products
        </Link>
      </main>
    );
  }

  const category = categories.find((c) => c.id === product.category);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  const handleAddToCart = () => {
    addItem(product, selectedVariant || undefined, quantity);
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const message = encodeURIComponent(
      `Hi! I'm interested in ordering:\n\n*${product.name}*\n${selectedVariant ? `Variant: ${selectedVariant.name}\n` : ""}Quantity: ${quantity} ${product.unit || ""}\nTotal Price: Rs. ${(currentPrice * quantity).toLocaleString()}\n\nPlease confirm availability and process my order.`
    );
    window.open(`https://wa.me/923001234567?text=${message}`, "_blank");
  };

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0;

  const minStep = 1;
  const minQty = product.minQuantity || 1;
  const maxQty = product.stockQuantity || 10000;
  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = Number(raw);
    if (Number.isNaN(num)) {
      setQuantity(minQty);
      return;
    }
    const clamped = Math.min(maxQty, Math.max(minQty, Math.floor(num)));
    setQuantity(clamped);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-sand-light/50 border-b border-border pt-20">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            {category && (
              <>
                <Link
                  href={`/category/${category.id}`}
                  className="hover:text-foreground transition-colors"
                >
                  {category.name}
                </Link>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </>
            )}
            <span className="text-foreground truncate">{product.name} {product.urduName && <span className="text-taupe/60 ml-1 font-urdu" dir="rtl">({product.urduName})</span>}</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 md:py-10">
        <div className="mb-6 lg:mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-2 flex items-center flex-wrap gap-x-4">
            {product.name}
            {product.urduName && (
              <span className="text-2xl md:text-3xl text-taupe font-urdu" dir="rtl">
                {product.urduName}
              </span>
            )}
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating) ? "fill-gold text-gold" : "fill-muted text-muted"
                  )}
                />
              ))}
              <span className="text-muted-foreground ml-1">({product.reviews} reviews)</span>
            </div>
            {product.inStock ? (
              <span className="flex items-center gap-1 text-olive font-medium">
                <Check className="w-4 h-4" /> In Stock
              </span>
            ) : (
              <span className="text-destructive font-medium">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div
            className={`space-y-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand-light">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="px-3 py-1 bg-destructive text-white text-xs font-medium rounded-full">
                    -{discount}%
                  </span>
                )}
                {product.badge && (
                  <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isWishlisted
                      ? "bg-destructive text-white"
                      : "bg-white/90 text-foreground hover:bg-white"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/90 text-foreground hover:bg-white flex items-center justify-center transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                    selectedImage === index
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div
            className={`space-y-6 transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {/* Category & Rating */}
            <div className="flex items-center gap-4 flex-wrap">
              {category && (
                <Link
                  href={`/category/${category.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  {category.name}
                </Link>
              )}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-gold fill-gold"
                        : "text-muted"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground leading-tight">
                {product.name}
              </h1>
              {product.urduName && (
                <p className="text-xl md:text-2xl font-urdu text-primary mt-1" dir="rtl">
                  {product.urduName}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-bold text-primary">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.unit && !selectedVariant && (
                <span className="text-sm text-muted-foreground">/ per {product.unit}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Select Size/Weight:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-border hover:border-primary/50 text-muted-foreground"
                      }`}
                    >
                      {v.name} - Rs. {v.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bulk Discounts */}
            {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-2">
                <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                  <Percent className="w-4 h-4" /> Bulk Purchase Offers:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.bulkDiscounts.map((d, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                      <span className="text-muted-foreground">Buy {d.minQuantity}+ {product.unit || "units"}</span>
                      <span className="font-bold text-olive">-{d.discountPercentage}% OFF</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Key Benefits:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-olive flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  (selectedVariant ? selectedVariant.inStock : product.inStock) ? "bg-olive" : "bg-destructive"
                }`}
              />
              <span
                className={`text-sm ${
                  (selectedVariant ? selectedVariant.inStock : product.inStock) ? "text-olive" : "text-destructive"
                }`}
              >
                {(selectedVariant ? selectedVariant.inStock : product.inStock) ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(minQty, quantity - minStep))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                    disabled={quantity <= minQty}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="px-3">
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityInput}
                      min={minQty}
                      max={maxQty}
                      step={minStep}
                      className="w-20 text-center border-none focus:outline-none focus:ring-0 bg-transparent"
                      aria-label="Quantity"
                    />
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + minStep)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {minQty > 1 && (
                  <span className="text-xs text-amber-600 font-medium">
                    (Min. order: {minQty})
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!(selectedVariant ? selectedVariant.inStock : product.inStock)}
                  className="flex-1 h-12 btn-premium bg-primary hover:bg-primary/90 text-white"
                >
                  {showAddedToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Cart!
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
                <Button
                  onClick={handleWhatsAppOrder}
                  variant="outline"
                  className="flex-1 h-12 border-olive text-olive hover:bg-olive hover:text-white bg-transparent"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Order via WhatsApp
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto text-primary mb-1" />
                <span className="text-xs text-muted-foreground">
                  Free Shipping
                </span>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto text-primary mb-1" />
                <span className="text-xs text-muted-foreground">
                  100% Authentic
                </span>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 mx-auto text-primary mb-1" />
                <span className="text-xs text-muted-foreground">
                  Easy Returns
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 border-t border-border pt-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-serif text-foreground mb-4">
                Product Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">SKU</span>
                  <span>{product.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Category</span>
                  <span>{category?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={product.inStock ? "text-olive" : "text-destructive"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Rating</span>
                  <span>{product.rating} / 5</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif text-foreground mb-4">
                Shipping & Returns
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Free Shipping:</strong> On
                  all orders above Rs. 2,000. Standard delivery within 3-5
                  business days.
                </p>
                <p>
                  <strong className="text-foreground">Easy Returns:</strong> If
                  you&apos;re not satisfied with your purchase, return it within 7
                  days for a full refund.
                </p>
                <p>
                  <strong className="text-foreground">Cash on Delivery:</strong>{" "}
                  Available nationwide. Pay when you receive your order.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-foreground">
                You May Also Like
              </h2>
              <Link
                href={`/category/${product.category}`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct.id}
                  className="animate-slide-up opacity-0"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
