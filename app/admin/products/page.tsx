"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { 
  Loader2, 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  ExternalLink,
  ChevronLeft
} from 'lucide-react'
import Image from 'next/image'
import { fetchProducts as apiFetchProducts } from '@/lib/api'
import type { Product } from '@/lib/cart-context'

export default function ManageProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await apiFetchProducts()
      setProducts(data)
    } catch (error: any) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products', {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error: any) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.id && product.id.toString().includes(searchQuery))
  )

  return (
    <div className="container mx-auto py-12 pt-24 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin')} className="mb-2 -ml-2">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Button>
          <h1 className="text-3xl font-serif text-foreground">Manage Products</h1>
          <p className="text-muted-foreground mt-1">Add, edit or remove products from your store</p>
        </div>
        <Button onClick={() => router.push('/admin/add-product')} className="bg-taupe hover:bg-taupe/90 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <Input
          placeholder="Search products by name, category or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading products...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-neutral-50">
                      <Image
                        src={product.image || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{product.id}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                      {product.category.replace('-', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-taupe">Rs. {product.price.toLocaleString()}</div>
                    {product.originalPrice && (
                      <div className="text-xs text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.inStock ? (
                      <span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded">In Stock</span>
                    ) : (
                      <span className="text-rose-600 text-xs font-medium bg-rose-50 px-2 py-0.5 rounded">Out of Stock</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/product/${product.id}`)}>
                          <ExternalLink className="w-4 h-4 mr-2" /> View Page
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}/edit`)}>
                          <Pencil className="w-4 h-4 mr-2" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteProduct(product.id.toString())} className="text-rose-600 focus:text-rose-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
