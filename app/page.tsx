import { HeroSection } from '@/components/landing/hero-section'
import { CategoriesSection } from '@/components/landing/categories-section'
import { FeaturedProducts } from '@/components/landing/featured-products'
import { ParallaxShowcase } from '@/components/landing/parallax-showcase'
import { TrustSection } from '@/components/landing/trust-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { NewsletterSection } from '@/components/landing/newsletter-section'

import { getAllProducts } from '@/lib/products-db'

export default async function Home() {
  const products = await getAllProducts()
  
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
