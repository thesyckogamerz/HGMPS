"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { blogPosts } from '@/lib/blog-data'
import { getProductById } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Calendar, User, Clock, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  // Fetch related products
  const relatedProducts = post.relatedProducts
    .map(id => getProductById(id))
    .filter(p => p !== undefined)

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      {/* Header Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="flex gap-2 mb-4">
                 {post.tags.map(tag => (
                      <Badge key={tag} className="bg-primary hover:bg-primary/90 text-white border-none">
                        {tag}
                      </Badge>
                  ))}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white font-bold max-w-4xl leading-tight mb-6">
                {post.title}
            </h1>
            <div className="flex items-center gap-6 text-white/80 text-sm md:text-base">
                <span className="flex items-center gap-2">
                    <User className="w-4 h-4" /> {post.author}
                </span>
                <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {post.date}
                </span>
                 <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {post.readTime}
                </span>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
            
          {/* Main Content */}
          <main className="flex-1 bg-card rounded-xl shadow-xl p-8 md:p-12 border border-border/50">
             <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Articles
            </Link>

            <article 
                className="prose prose-stone dark:prose-invert max-w-none 
                prose-headings:font-serif prose-headings:text-primary 
                prose-a:text-primary prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-12 pt-8 border-t flex justify-between items-center">
                <p className="text-muted-foreground italic">
                    Written by <span className="text-foreground font-medium">{post.author}</span>
                </p>
                <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" /> Share
                </Button>
            </div>
          </main>

          {/* Sidebar / Recommended Products */}
          <aside className="lg:w-80 shrink-0 space-y-8">
            <div className="bg-secondary/30 rounded-xl p-6 border border-border sticky top-24">
                <h3 className="font-serif text-xl font-medium mb-4 text-primary">
                    Recommended Remedies
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Products mentioned in this article.
                </p>
                
                <div className="space-y-6">
                    {relatedProducts.length > 0 ? (
                        relatedProducts.map(product => (
                            <div key={product!.id} className="scale-90 origin-top-left -mb-10 last:mb-0">
                                <ProductCard product={product!} />
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No specific recommendations.</p>
                    )}
                </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
