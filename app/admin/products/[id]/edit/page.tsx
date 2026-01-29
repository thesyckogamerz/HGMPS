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
import { Loader2, Plus, Trash2, ChevronLeft, Scale, Percent } from 'lucide-react'
import { WeightUnit, QuantityVariant, BulkDiscount, Product } from '@/lib/cart-context'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    unit: 'grams' as WeightUnit,
    minQuantity: 1,
    inStock: true
  })

  const [variants, setVariants] = useState<QuantityVariant[]>([])
  const [bulkDiscounts, setBulkDiscounts] = useState<BulkDiscount[]>([])

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) throw error

      if (data) {
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          category: data.category || '',
          image: data.image || '',
          unit: (data.unit as WeightUnit) || 'grams',
          minQuantity: data.minQuantity || 1,
          inStock: data.inStock ?? true
        })
        setVariants(data.variants || [])
        setBulkDiscounts(data.bulkDiscounts || [])
      }
    } catch (error: any) {
      toast.error('Failed to load product', { description: error.message })
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const addVariant = () => {
    const id = Math.random().toString(36).substr(2, 9)
    setVariants([...variants, { id, name: '', weight: 0, unit: formData.unit, price: 0, inStock: true }])
  }

  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id))
  }

  const updateVariant = (id: string, field: keyof QuantityVariant, value: any) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v))
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
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image: formData.image,
          unit: formData.unit,
          minQuantity: formData.minQuantity,
          variants: variants.length > 0 ? variants : null,
          bulkDiscounts: bulkDiscounts.length > 0 ? bulkDiscounts : null,
          inStock: formData.inStock
        })
        .eq('id', productId)

      if (error) throw error

      toast.success('Product updated successfully!')
      router.push('/admin/products')
      
    } catch (error: any) {
      toast.error('Failed to update product', { description: error.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12 pt-24">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/products')} className="mb-2">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Products
        </Button>
        <h1 className="text-3xl font-serif text-foreground">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={handleCategoryChange} value={formData.category}>
                  <SelectTrigger>
                    <SelectValue />
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
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Rs.) *</Label>
                  <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" name="image" value={formData.image} onChange={handleChange} />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="inStock" 
                  checked={formData.inStock} 
                  onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))} 
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="inStock">Is in Stock?</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ordering Rules</CardTitle>
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
                  <Label htmlFor="minQuantity">Min. Quantity</Label>
                  <Input id="minQuantity" name="minQuantity" type="number" value={formData.minQuantity} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Product Variants</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}><Plus className="w-4 h-4 mr-1" /> Add Variant</Button>
          </CardHeader>
          <CardContent>
            {variants.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground border-2 border-dashed rounded-xl">No variants added.</p>
            ) : (
              <div className="space-y-4">
                {variants.map((v) => (
                  <div key={v.id} className="flex gap-4 items-end bg-muted/30 p-4 rounded-xl border border-muted">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Variant Name</Label>
                      <Input value={v.name} onChange={(e) => updateVariant(v.id, 'name', e.target.value)} />
                    </div>
                    <div className="w-24 space-y-2">
                      <Label className="text-xs">Weight</Label>
                      <Input type="number" value={v.weight} onChange={(e) => updateVariant(v.id, 'weight', parseFloat(e.target.value))} />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label className="text-xs">Price</Label>
                      <Input type="number" value={v.price} onChange={(e) => updateVariant(v.id, 'price', parseFloat(e.target.value))} />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(v.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Bulk Discounts</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addDiscount}><Plus className="w-4 h-4 mr-1" /> Add Tier</Button>
          </CardHeader>
          <CardContent>
            {bulkDiscounts.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground border-2 border-dashed rounded-xl">No bulk discounts configured.</p>
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
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDiscount(index)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
          <Button type="submit" disabled={saving} className="min-w-[150px]">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Update Product
          </Button>
        </div>
      </form>
    </div>
  )
}
