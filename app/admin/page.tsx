"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, PlusCircle, LayoutDashboard, ShoppingCart, TrendingUp, Users, DollarSign, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface DashboardStats {
  totalProducts: number
  lowStockProducts: number
  totalOrders: number
  revenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)

        // Fetch total products
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })

        // Fetch low stock products (assuming stock < 10 is low)
        const { data: products } = await supabase
          .from('products')
          .select('variants')
          .eq('in_stock', true)

        let lowStock = 0
        products?.forEach(product => {
          if (product.variants && Array.isArray(product.variants)) {
            product.variants.forEach((variant: any) => {
              if (variant.stock && variant.stock < 10) {
                lowStock++
              }
            })
          }
        })

        setStats({
          totalProducts: productCount || 0,
          lowStockProducts: lowStock,
          totalOrders: 0, // Placeholder - orders table not implemented yet
          revenue: 0 // Placeholder - orders table not implemented yet
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <Package className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockProducts,
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingCart className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      comingSoon: true
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: <DollarSign className="w-5 h-5 text-purple-600" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      comingSoon: true
    }
  ]

  const quickActions = [
    {
      title: "Manage Products",
      description: "View, edit, and delete existing products",
      icon: <Package className="w-6 h-6" />,
      link: "/admin/products",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Add New Product",
      description: "Create a new product with variants and discounts",
      icon: <PlusCircle className="w-6 h-6" />,
      link: "/admin/add-product",
      color: "from-olive to-olive-dark"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sand-light/30">
      {/* Header */}
      <div className="bg-white border-b border-sand-light/50 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-gold to-amber-500 rounded-2xl shadow-lg">
                <LayoutDashboard className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold text-taupe-dark">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.user_metadata?.full_name || user?.email || 'Admin'}</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="rounded-full">
                View Store
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-gold" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-3xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </p>
                      {stat.comingSoon && (
                        <span className="text-xs text-muted-foreground">(Soon)</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-serif font-semibold text-taupe-dark mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.link}>
                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-none overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      <CardHeader className="flex flex-row items-center gap-4 relative">
                        <div className={`p-4 bg-gradient-to-br ${action.color} rounded-xl shadow-md text-white group-hover:scale-110 transition-transform`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-gold transition-colors">{action.title}</CardTitle>
                          <CardDescription className="mt-1">{action.description}</CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Recent Activity</CardTitle>
                <CardDescription>Your latest product updates and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Activity tracking coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
