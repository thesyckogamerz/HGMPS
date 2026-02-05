import { HeroSection } from '@/components/landing/hero-section'
import { CategoriesSection } from '@/components/landing/categories-section'
import { FeaturedProducts } from '@/components/landing/featured-products'
import { ParallaxShowcase } from '@/components/landing/parallax-showcase'
import { TrustSection } from '@/components/landing/trust-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { NewsletterSection } from '@/components/landing/newsletter-section'

import { getAllProducts } from '@/lib/products-db'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const allProducts = await getAllProducts()
  
  // Randomize and slice products to optimize payload size
  // We take 12 random products to show in the featured section
  const products = [...allProducts]
    .sort(() => Math.random() - 0.5)
    .slice(0, 12)
  
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts products={products} />
        <ParallaxShowcase />
        <TrustSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
    </div>
  )
}
