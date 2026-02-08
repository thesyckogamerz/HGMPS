"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { blogPosts } from '@/lib/blog-data'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Clock, ArrowRight } from 'lucide-react'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-32">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-16 text-center">
        <h1 className="font-serif text-4xl md:text-6xl text-primary mb-6">
          Hikmat-e-Qadeem
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
          Ancient Wisdom for Modern Living. Explore the timeless secrets of Unani and Ayurvedic healing, curated by Hakeem Mohsin.
        </p>
      </section>

      {/* Blog Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <Card className="h-full border-none shadow-lg bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <CardHeader className="pt-6 pb-2">
                  <div className="flex gap-2 mb-3">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="font-serif text-2xl font-medium leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>

                <CardFooter className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4 mt-auto">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                        </span>
                    </div>
                    <span className="flex items-center gap-1 font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                        Read Article <ArrowRight className="w-3 h-3" />
                    </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
