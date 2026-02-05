"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { getValidImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  CreditCard,
  Truck,
  Check,
  MessageCircle,
  Smartphone,
  Banknote,
  Lock,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

type PaymentMethod = "cod" | "jazzcash" | "easypaisa" | "card";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    setIsVisible(true);
    if (items.length === 0 && !orderPlaced) {
      router.push("/cart");
    }
  }, [items.length, orderPlaced, router]);

  const subtotal = totalPrice;
  const shipping = subtotal >= 2000 ? 0 : 200;
  const total = subtotal + shipping;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newOrderId = `AUR-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    clearCart();
    setIsProcessing(false);
  };

  const handleWhatsAppOrder = () => {
    const itemsList = items
      .map((item) => `- ${item.name} x${item.quantity}`)
      .join("\n");
    const message = encodeURIComponent(
      `New Order Request:\n\n${itemsList}\n\nSubtotal: Rs. ${subtotal.toLocaleString()}\nShipping: Rs. ${shipping}\nTotal: Rs. ${total.toLocaleString()}\n\nCustomer Details:\nName: ${formData.firstName} ${formData.lastName}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}\n\nPayment: ${paymentMethod.toUpperCase()}`
    );
    window.open(`https://wa.me/923001234567?text=${message}`, "_blank");
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <main className="container mx-auto px-4 py-12 md:py-20 pt-24">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-olive/10 flex items-center justify-center animate-scale-in">
            <Check className="w-10 h-10 text-olive" />
          </div>
          <h1 className="text-3xl font-serif text-foreground mb-3 animate-slide-up">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Thank you for your order. We&apos;ll send you a confirmation shortly.
          </p>
          <div className="bg-card rounded-xl border border-border p-6 mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <p className="text-sm text-muted-foreground mb-2">Order ID</p>
            <p className="text-2xl font-mono font-bold text-primary">{orderId}</p>
            <p className="text-sm text-muted-foreground mt-4">
              Estimated Delivery: 3-5 Business Days
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up" style={{ animationDelay: "300ms" }}>
            <Link href="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Button className="bg-primary text-white">
              <Truck className="w-4 h-4 mr-2" />
              Track Order
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const paymentMethods = [
    {
      id: "cod" as const,
      name: "Cash on Delivery",
      icon: Banknote,
      description: "Pay when you receive your order",
    },
    {
      id: "jazzcash" as const,
      name: "JazzCash",
      icon: Smartphone,
      description: "Pay via JazzCash mobile wallet",
      disabled: true,
      reason: "JazzCash payment service is currently on cooldown. Please try another method.",
    },
    {
      id: "easypaisa" as const,
      name: "Easypaisa",
      icon: Smartphone,
      disabled: true,
      reason: "Easypaisa payment service is currently on cooldown. Please try another method.",
      description: "Pay via Easypaisa mobile wallet",
    },
    {
      id: "card" as const,
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Pay securely with your card",
      disabled: true,
      reason: "Online card payments are temporarily unavailable. We are working to restore this soon.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 md:py-10 pt-24">
        {/* Back Link */}
        <Link
          href="/cart"
          className={`inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>

        <h1
          className={`text-3xl md:text-4xl font-serif text-foreground mb-8 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div
                className={`bg-card rounded-xl border border-border p-6 transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-lg font-serif text-foreground mb-4">
                  Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="03XX XXXXXXX"
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div
                className={`bg-card rounded-xl border border-border p-6 transition-all duration-500 delay-100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-lg font-serif text-foreground mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="House #, Street, Area"
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        City *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-transparent"
                      >
                        <option value="">Select City</option>
                        <option value="karachi">Karachi</option>
                        <option value="lahore">Lahore</option>
                        <option value="islamabad">Islamabad</option>
                        <option value="rawalpindi">Rawalpindi</option>
                        <option value="faisalabad">Faisalabad</option>
                        <option value="multan">Multan</option>
                        <option value="peshawar">Peshawar</option>
                        <option value="quetta">Quetta</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Special instructions for delivery..."
                      className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div
                className={`bg-card rounded-xl border border-border p-6 transition-all duration-500 delay-200 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-lg font-serif text-foreground mb-4">
                  Payment Method
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {paymentMethods.map((method) => {
                    const isMethodDisabled = 'disabled' in method && method.disabled;
                    const content = (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          if (isMethodDisabled) {
                            toast.error(method.reason || "This payment method is currently unavailable.");
                            return;
                          }
                          setPaymentMethod(method.id);
                        }}
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left w-full h-full ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary/5"
                            : isMethodDisabled
                            ? "border-border opacity-50 grayscale cursor-not-allowed"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            paymentMethod === method.id
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <method.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {method.name}
                            </p>
                            {isMethodDisabled && (
                              <AlertCircle className="w-3 h-3 text-destructive" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                        {paymentMethod === method.id && (
                          <Check className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
                        )}
                      </button>
                    );

                    if (isMethodDisabled) {
                      return (
                        <Tooltip key={method.id}>
                          <TooltipTrigger asChild>
                            <div>{content}</div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px] text-center">
                            {method.reason}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return <React.Fragment key={method.id}>{content}</React.Fragment>;
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div
                className={`bg-card rounded-xl border border-border p-6 sticky top-24 transition-all duration-500 delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-lg font-serif text-foreground mb-4">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-sand-light flex-shrink-0">
                        <Image
                          src={getValidImageUrl(item.image)}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Lines */}
                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? "text-olive" : ""}>
                      {shipping === 0 ? "Free" : `Rs. ${shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">
                        Rs. {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-12 btn-premium bg-primary text-white"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleWhatsAppOrder}
                    className="w-full border-olive text-olive hover:bg-olive hover:text-white bg-transparent"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Order via WhatsApp
                  </Button>
                </div>

                {/* Trust */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secure & Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
