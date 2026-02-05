"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Check,
} from "lucide-react";

export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setFormSubmitted(true);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi Hakeem Mohsin! I'd like to get in touch regarding: ${formData.subject || "General Inquiry"}`
    );
    window.open(`https://wa.me/923006912422?text=${message}`, "_blank");
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "+92 300 6912422",
      description: "Mon-Sat, 9am-6pm",
    },
    {
      icon: Mail,
      title: "Email",
      value: "hgmohsan@gmail.com",
      description: "We reply within 24 hours",
    },
    {
      icon: MapPin,
      title: "Office",
      value: "Sahiwal, Sahiwal, Pakistan",
      description: "Pakistan",
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "9:00 AM - 7:00 PM",
      description: "Saturday to Thusrday ",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-taupe to-taupe-dark" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-white/80 max-w-xl">
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                {formSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-olive/10 flex items-center justify-center">
                      <Check className="w-8 h-8 text-olive" />
                    </div>
                    <h3 className="text-xl font-serif text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We&apos;ll get back to you within
                      24 hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          subject: "",
                          message: "",
                        });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-serif text-foreground mb-6">
                      Send us a Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1.5">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1.5">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="03XX XXXXXXX"
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1.5">
                            Subject *
                          </label>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-transparent"
                          >
                            <option value="">Select a subject</option>
                            <option value="order">Order Inquiry</option>
                            <option value="product">Product Question</option>
                            <option value="shipping">Shipping & Delivery</option>
                            <option value="return">Returns & Refunds</option>
                            <option value="feedback">Feedback</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1.5">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          placeholder="How can we help you?"
                          className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          type="submit"
                          className="flex-1 h-11 btn-premium bg-primary text-white"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleWhatsApp}
                          className="flex-1 h-11 border-olive text-olive hover:bg-olive hover:text-white bg-transparent"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp Us
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div
              className={`transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <h2 className="text-2xl font-serif text-foreground mb-6">
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-8">
                Reach out to us through any of these channels. We&apos;re here to
                help with any questions about our products, orders, or anything
                else.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {contactInfo.map((info, index) => (
                  <div
                    key={info.title}
                    className="p-5 bg-card rounded-xl border border-border hover:shadow-md transition-all"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">
                      {info.title}
                    </h3>
                    <p className="text-foreground">{info.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {info.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-olive/10 rounded-2xl p-6 border border-olive/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-olive flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      Prefer WhatsApp?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get instant support via WhatsApp. Our team typically responds
                      within minutes during business hours.
                    </p>
                    <Button
                      onClick={handleWhatsApp}
                      className="bg-olive hover:bg-olive/90 text-white"
                    >
                      Chat on WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-sand-light/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "What are your delivery times?",
                a: "We deliver within 3-5 business days for major cities and 5-7 days for other areas. Express delivery is available for Lahore, Karachi, and Islamabad.",
              },
              {
                q: "Do you offer Cash on Delivery?",
                a: "Yes! We offer Cash on Delivery (COD) nationwide. You can also pay via JazzCash, Easypaisa, or credit/debit card.",
              },
              {
                q: "What is your return policy?",
                a: "We offer a 7-day return policy for unused products in original packaging. Simply contact us to initiate a return.",
              },
              {
                q: "Are your products authentic?",
                a: "Absolutely! All Hakeem Mohsin products are 100% authentic and sourced directly from trusted suppliers. We guarantee product quality.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-card rounded-xl border border-border p-5"
              >
                <h3 className="font-medium text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
