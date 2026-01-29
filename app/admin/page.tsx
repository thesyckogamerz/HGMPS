"use client"

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, PlusCircle, LayoutDashboard, ShoppingCart } from 'lucide-react'

export default function AdminDashboard() {
  console.log('AdminDashboard is rendering')
  
  const adminCards = [
    {
      title: "Manage Products",
      description: "View, edit, and delete existing products",
      icon: <Package className="w-8 h-8 text-primary" />,
      link: "/admin/products",
      color: "bg-blue-50"
    },
    {
      title: "Add New Product",
      description: "Create a new product with variants and discounts",
      icon: <PlusCircle className="w-8 h-8 text-olive" />,
      link: "/admin/add-product",
      color: "bg-green-50"
    },
    {
      title: "Orders (Coming Soon)",
      description: "View and manage customer orders",
      icon: <ShoppingCart className="w-8 h-8 text-amber-500" />,
      link: "#",
      disabled: true,
      color: "bg-amber-50"
    }
  ]

  return (
    <div className="container py-12 pt-24">
      <div className="flex items-center gap-4 mb-8">
        <LayoutDashboard className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-serif text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground text-sm">Manage your store products and settings</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <Link key={index} href={card.link} className={card.disabled ? "pointer-events-none opacity-60" : ""}>
            <Card className={`hover:shadow-lg transition-all cursor-pointer border-none ${card.color}`}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  {card.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground/70">{card.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
