"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { WeightUnit, QuantityVariant, BulkDiscount } from '@/lib/cart-context'
import { cn } from '@/lib/utils'

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    stockQuantity: '10',
  })

  const [variants, setVariants] = useState<QuantityVariant[]>([])
  const [bulkDiscounts, setBulkDiscounts] = useState<BulkDiscount[]>([])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      }
    }
    checkUser()
  }, [router])

  useEffect(() => {
    if (!formData.category) return

    let defaultUnit: WeightUnit = 'grams'
    let defaultMin = 1

    switch (formData.category) {
      case 'common-items':
        defaultMin = 100; defaultUnit = 'grams'; break
      case 'premium-items':
        defaultMin = 10; defaultUnit = 'grams'; break
      case 'pure-arqiyat':
        defaultMin = 1; defaultUnit = 'bottle'; break
      case 'murabba-jat':
        defaultMin = 1000; defaultUnit = 'grams'; break
      case 'honey':
        defaultMin = 1; defaultUnit = 'kg'; break
      case 'special-powders':
        defaultMin = 30; defaultUnit = 'grams'; break
      case 'dry-fruit':
        defaultMin = 100; defaultUnit = 'grams'; break
      default:
        defaultMin = 1; defaultUnit = 'items'
    }

    setFormData(prev => ({ ...prev, unit: defaultUnit, minQuantity: defaultMin }))
  }, [formData.category])

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
    setLoading(true)

    try {
      if (!formData.name || !formData.price || !formData.category) {
        toast.error('Please fill in all required fields')
        setLoading(false)
        return
      }

      const productData = {
        id: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''), 
        name: formData.name,
        product_name: formData.name,
        urdu_name: formData.urduName || null,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        image: formData.image || '/images/placeholder.jpg',
        image_url: formData.image || '/images/placeholder.jpg',
        unit: formData.unit,
        min_quantity: formData.minQuantity,
        variants: variants.length > 0 ? variants : null,
        bulk_discounts: bulkDiscounts.length > 0 ? bulkDiscounts : null,
        stock_quantity: parseInt(formData.stockQuantity) || 0,
        reviews: 0,
        rating: 0
      }

      const { error } = await supabase
        .from('products')
        .upsert(productData)

      if (error) {
        console.error('Supabase error:', error)
        if (error.message.includes('value too long')) {
          toast.error('Text value is too long for the database', { 
             description: 'Please shorten description/name OR run the fix_schema_length.sql script.' 
          })
        } else {
          toast.error('Failed to add product', { description: error.message })
        }
        setLoading(false)
        return
      }

      toast.success('Product added successfully!')
      router.push('/admin/products')
      
    } catch (error) {
      console.error('Error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-12 pt-24">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin')} className="mb-2">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-serif text-foreground">Add New Product</h1>
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
                <div className="flex justify-between">
                  <Label htmlFor="description">Description</Label>
                   <span className={`text-xs ${formData.description.length > 255 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                    {formData.description.length} chars {formData.description.length > 255 && '(Likely > Limit)'}
                  </span>
                </div>
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
              <CardDescription>Units and minimum requirements</CardDescription>
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
                <Label htmlFor="stockQuantity">Initial Stock Quantity</Label>
                <Input id="stockQuantity" name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} placeholder="10" />
              </div>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs text-balance">
                <p className="font-semibold mb-1">💡 Auto-filled based on category:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Honey: 1kg, Common: 100g, Premium: 10g</li>
                  <li>Arqs: 1 bottle, Murabba: 1kg, Dry Fruit: 100g</li>
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
          <Button type="submit" disabled={loading} className="min-w-[150px]">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Product
          </Button>
        </div>
      </form>
    </div>
  )
}
