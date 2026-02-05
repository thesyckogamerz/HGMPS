"use client";

import { useState, useEffect, useRef } from "react";
import { Leaf, Heart, Award, Users, Target, Sparkles } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "100% Natural",
    description:
      "Every product is crafted from pure, natural ingredients sourced from trusted suppliers worldwide.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Your wellness journey is our priority. We're committed to exceptional service and support.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description:
      "Rigorous testing and quality control ensure you receive only the finest herbal products.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "We're building a community of wellness enthusiasts who believe in natural healing.",
  },
];

const milestones = [
  { year: "2020", title: "Founded", description: "I Launched online this  with a vision to bring premium herbal wellness to Pakistan." },
  { year: "2021", title: "1000+ Customers", description: "Reached our first milestone of serving over 1000 happy customers." },
  { year: "2022", title: "Product Expansion", description: "Expanded our range to 50+ carefully curated herbal products." },
  { year: "2023", title: "Nationwide Delivery", description: "Launched free nationwide shipping for orders above Rs. 2000." },
  { year: "2024", title: "Going Digital", description: "Launched our premium e-commerce platform for seamless shopping." },
];

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-taupe via-taupe-dark to-gold-dark" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' opacity='.5'/%3E%3Cpath d='M15 15h50L40 65 15 15zm20 10a10 10 0 1 1 0 20 10 10 0 0 1 0-20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
              About Hakeem Mohsin
            </h1>
            <p className="text-white/80 max-w-2xl text-lg">
              Bringing the ancient wisdom of herbal wellness to modern Pakistan
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        ref={(el) => { sectionRefs.current["mission"] = el; }}
        id="mission"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-700 ${
                visibleSections.has("mission")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand-light">
                <div className="absolute inset-0 bg-gradient-to-br from-taupe/20 to-gold/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Sparkles className="w-16 h-16 text-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-serif text-taupe-dark">
                      Pure & Natural
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`transition-all duration-700 delay-200 ${
                visibleSections.has("mission")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mt-2 mb-6">
                Nurturing Wellness Through Nature
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At Hakeem Mohsin, we believe that true wellness comes from nature. Our
                mission is to bring you the finest herbal and botanical products
                that have been trusted for generations, now made accessible for
                modern lifestyles.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We carefully source our ingredients from sustainable farms and
                trusted suppliers, ensuring that every product meets the highest
                standards of purity and effectiveness. Our commitment to quality
                is unwavering, because your health deserves nothing less.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        ref={(el) => { sectionRefs.current["values"] = el; }}
        id="values"
        className="py-16 md:py-24 bg-sand-light/50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mt-2">
              Our Core Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`bg-card rounded-xl p-6 border border-border transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
                  visibleSections.has("values")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section
        ref={(el) => { sectionRefs.current["timeline"] = el; }}
        id="timeline"
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mt-2">
              Milestones
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`flex gap-4 md:gap-8 pb-8 last:pb-0 transition-all duration-500 ${
                  visibleSections.has("timeline")
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section
        ref={(el) => { sectionRefs.current["vision"] = el; }}
        id="vision"
        className="py-16 md:py-24 bg-taupe text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <div
            className={`max-w-3xl mx-auto transition-all duration-700 ${
              visibleSections.has("vision")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
        
            <Target className="w-12 h-12 mx-auto mb-6 text-gold" />
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Our Vision</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              To become Pakistan&apos;s most trusted destination for premium
              herbal and natural wellness products, empowering every individual
              to embrace a healthier, more natural lifestyle.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
