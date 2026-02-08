import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-IN')}`
}

export function getValidImageUrl(url: string | undefined | null): string {
  if (!url) return "/placeholder.svg"
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url
  
  // Remove 'public' prefix if present (common mistake)
  const cleanUrl = url.replace(/^public\//, '').replace(/^\/public\//, '/')

  
  if (cleanUrl.startsWith('/')) return cleanUrl
  return `/${cleanUrl}`
}
