"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Leaf, ShieldCheck, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=1600&auto=format&fit=crop"
          alt="Ancient Herbs"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
            The Legacy of Nature's Cureness
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
            "A cure for every disease essentially exists in nature, we just need to find it."
          </p>
        </div>
      </section>

      {/* The Story */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-serif text-primary">From the Hakeem's Desk</h2>
            <div className="w-20 h-1 bg-primary/30" />
            <p className="text-muted-foreground text-lg leading-relaxed">
              For generations, the art of <strong>Unani Tibb</strong> (Greco-Arab Medicine) has been a beacon of hope for those seeking holistic healing. Unlike modern medicine which often treats solely the symptoms, our philosophy is to treat the root cause—the imbalance of the body's humors.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              <strong>Hakeem Mohsin</strong> founded this apothecary with a single mission: to bring authentic, unadulterated, and spiritually guided remedies to the modern world. Every formulation, from our <em>Roghan-e-Baiza</em> to our <em>Khamiras</em>, follows the strict protocols laid down by the masters of old.
            </p>
          </div>
          <div className="md:w-1/2 relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
             <Image
              src="https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=800&auto=format&fit=crop"
              alt="Hakeem mixing herbs"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Philosophy / Values */}
      <section className="bg-secondary/30 py-24">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-serif text-primary mb-4">Our Guiding Principles</h2>
                <p className="text-muted-foreground">We do not compromise on the purity of our ingredients or the sanctity of our process.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        icon: Leaf,
                        title: "100% Natural Origins",
                        desc: "We source our herbs directly from organic farms in the foothills of the Himalayas and the valleys of Kashmir."
                    },
                    {
                        icon: ShieldCheck,
                        title: "Hakeem Certified",
                        desc: "Every batch is inspected by qualified practitioners of Unani medicine to ensure potency and safety."
                    },
                    {
                        icon: Heart,
                        title: "Shifa (Healing)",
                        desc: "We believe that true healing (Shifa) comes from the Creator; our medicines are but a means (Waseela)."
                    }
                ].map((item, i) => (
                    <div key={i} className="bg-card p-8 rounded-xl shadow-sm border border-border/50 text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <item.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-serif font-medium mb-3">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-24 relative overflow-hidden">
             <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-5xl font-serif">Begin Your Journey to Wellness</h2>
                <p className="text-primary-foreground/90 text-lg">
                    Not sure which remedy is right for you? Explore our collection or read our latest articles on traditional healing.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link href="/shop">
                        <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold gap-2">
                            Shop Remedies <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href="/blog">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary gap-2">
                            Read the Blog
                        </Button>
                    </Link>
                </div>
             </div>
             
             {/* Decorative circles */}
             <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
      </section>
    </div>
  )
}
