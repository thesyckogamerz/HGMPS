import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-4xl font-serif font-bold text-taupe-dark mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Could not find the requested resource. The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Button asChild className="bg-gold hover:bg-gold/90 text-white rounded-full">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
