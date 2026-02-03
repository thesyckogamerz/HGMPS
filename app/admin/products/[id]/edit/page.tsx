"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { categories } from '@/lib/products'
import { Loader2, Plus, Trash2, ChevronLeft, Scale, Percent, ExternalLink } from 'lucide-react'
import { WeightUnit, QuantityVariant, BulkDiscount } from '@/lib/cart-context'
import { fetchProductById } from '@/lib/api'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    urduName: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    unit: 'grams' as WeightUnit,
    minQuantity: 1,
    inStock: 'true',
    stockQuantity: '10',
  })

  const [variants, setVariants] = useState<QuantityVariant[]>([])
  const [bulkDiscounts, setBulkDiscounts] = useState<BulkDiscount[]>([])

  useEffect(() => {
    const initPage = async () => {
      // 1. Check Auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // 2. Fetch Data
      if (!id) return
      
      try {
        const product = await fetchProductById(id)
        if (!product) {
          toast.error('Product not found')
          router.push('/admin/products')
          return
        }

        // Map product to form data
        setFormData({
          name: product.name || '',
          urduName: product.urduName || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          originalPrice: product.originalPrice?.toString() || '',
          category: product.category || '',
          image: product.image || '',
          unit: product.unit || 'grams',
          minQuantity: product.minQuantity || 1,
          inStock: product.inStock ? 'true' : 'false',
          stockQuantity: product.stockQuantity?.toString() || (product.inStock ? '10' : '0'),
        })

        setVariants(product.variants || [])
        setBulkDiscounts(product.bulkDiscounts || [])
      } catch (error) {
        console.error('Error loading product:', error)
        toast.error('Failed to load product data')
      } finally {
        setLoading(false)
      }
    }
    initPage()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const addVariant = () => {
    const variantId = Math.random().toString(36).substr(2, 9)
    setVariants([...variants, { id: variantId, name: '', weight: 0, unit: formData.unit, price: 0, inStock: true }])
  }

  const removeVariant = (variantId: string) => {
    setVariants(variants.filter(v => v.id !== variantId))
  }

  const updateVariant = (variantId: string, field: keyof QuantityVariant, value: any) => {
    setVariants(variants.map(v => v.id === variantId ? { ...v, [field]: value } : v))
  }

  const addDiscount = () => {
    setBulkDiscounts([...bulkDiscounts, { minQuantity: 0, discountPercentage: 0 }])
  }

  const removeDiscount = (index: number) => {
    setBulkDiscounts(bulkDiscounts.filter((_, i) => i !== index))
  }

  const updateDiscount = (index: number, field: keyof BulkDiscount, value: number) => {
    setBulkDiscounts(bulkDiscounts.map((d, i) => i === index ? { ...d, [field]: value } : d))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!formData.name || !formData.price || !formData.category) {
        toast.error('Please fill in all required fields')
        setSaving(false)
        return
      }

      const productData = {
        product_name: formData.name,
        urdu_name: formData.urduName || null,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        image_url: formData.image || '/images/placeholder.jpg',
        unit: formData.unit,
        min_quantity: formData.minQuantity,
        stock_quantity: parseInt(formData.stockQuantity) || 0,
        variants: variants.length > 0 ? variants : null,
        bulk_discounts: bulkDiscounts.length > 0 ? bulkDiscounts : null,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)

      if (error) {
        console.error('Supabase error:', error)
        toast.error('Failed to update product', { description: error.message })
        setSaving(false)
        return
      }

      toast.success('Product updated successfully!')
      router.push('/admin/products')
      
    } catch (error) {
      console.error('Error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-24 text-taupe/40">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-light italic">Loading product data...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12 pt-24">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/products')} className="-ml-2">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Products
          </Button>
          <a href={`/product/${id}`} target="_blank" className="text-xs text-taupe/40 hover:text-taupe flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> View Public Page
          </a>
        </div>
        <h1 className="text-3xl font-serif text-foreground">Edit Product</h1>
        <p className="text-muted-foreground mt-1">ID: {id}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <CardDescription>Main details about the product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Organic Honey" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urduName">Urdu Name (Optional)</Label>
                <Input id="urduName" name="urduName" value={formData.urduName} onChange={handleChange} placeholder="مثلاً خالص شہد" className="font-urdu text-right" dir="rtl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={handleCategoryChange} value={formData.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Product details..." rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Sale Price (Rs.) *</Label>
                  <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="0.00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (Rs.)</Label>
                  <Input id="originalPrice" name="originalPrice" type="number" step="0.01" value={formData.originalPrice} onChange={handleChange} placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ordering Rules</CardTitle>
              <CardDescription>Units and inventory status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Base Unit</Label>
                  <Select value={formData.unit} onValueChange={(v) => setFormData(prev => ({ ...prev, unit: v as WeightUnit }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grams">Grams (g)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="bottle">Bottle</SelectItem>
                      <SelectItem value="items">Items</SelectItem>
                      <SelectItem value="ml">Milliliters (ml)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minQuantity">Min. Quantity ({formData.unit})</Label>
                  <Input id="minQuantity" name="minQuantity" type="number" value={formData.minQuantity} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inStock">Stock Status</Label>
                <Select 
                  value={formData.inStock} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, inStock: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">In Stock</SelectItem>
                    <SelectItem value="false">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input id="stockQuantity" name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} placeholder="10" />
              </div>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs text-balance">
                <p className="font-semibold mb-1">💡 Ordering Tips:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Ensure minimum quantity aligns with shipping costs.</li>
                  <li>Base unit is used for variants calculation.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Product Variants</CardTitle>
              <CardDescription>Add different sizes or weights (optional)</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="w-4 h-4 mr-1" /> Add Variant
            </Button>
          </CardHeader>
          <CardContent>
            {variants.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-xl text-muted-foreground">
                <Scale className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>No variants added. The base price will be used for one "unit".</p>
              </div>
            ) : (
              <div className="space-y-4">
                {variants.map((v) => (
                  <div key={v.id} className="flex gap-4 items-end bg-muted/30 p-4 rounded-xl border border-muted">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Variant Name</Label>
                      <Input value={v.name} onChange={(e) => updateVariant(v.id, 'name', e.target.value)} placeholder="500g Pack" />
                    </div>
                    <div className="w-24 space-y-2">
                      <Label className="text-xs">Weight</Label>
                      <Input type="number" value={v.weight} onChange={(e) => updateVariant(v.id, 'weight', parseFloat(e.target.value))} />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label className="text-xs">Price (Rs.)</Label>
                      <Input type="number" value={v.price} onChange={(e) => updateVariant(v.id, 'price', parseFloat(e.target.value))} />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(v.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Bulk Discounts</CardTitle>
              <CardDescription>Reward larger orders with discounts</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addDiscount}>
              <Plus className="w-4 h-4 mr-1" /> Add Tier
            </Button>
          </CardHeader>
          <CardContent>
            {bulkDiscounts.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-xl text-muted-foreground">
                <Percent className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>No bulk discounts configured.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {bulkDiscounts.map((d, index) => (
                  <div key={index} className="flex gap-4 items-end bg-muted/30 p-4 rounded-xl border border-muted relative">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Min. Quantity</Label>
                      <Input type="number" value={d.minQuantity} onChange={(e) => updateDiscount(index, 'minQuantity', parseInt(e.target.value))} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Discount %</Label>
                      <Input type="number" value={d.discountPercentage} onChange={(e) => updateDiscount(index, 'discountPercentage', parseInt(e.target.value))} />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDiscount(index)} className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
          <Button type="submit" disabled={saving} className="min-w-[150px] bg-taupe hover:bg-taupe/90 text-white">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Update Product
          </Button>
        </div>
      </form>
    </div>
  )
}
