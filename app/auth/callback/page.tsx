"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      // The Supabase client automatically handles the code/token in the URL 
      // when it initializes and checks the session.
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error during auth callback:', error.message)
      }
      
      // Redirect to home or account page after a short delay to ensure session is set
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-gold mx-auto mb-4" />
        <h1 className="text-2xl font-serif font-bold text-taupe-dark mb-2">Finishing Sign In...</h1>
        <p className="text-muted-foreground">Please wait while we set up your session.</p>
      </div>
    </div>
  )
}
