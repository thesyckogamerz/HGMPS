"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'HGMPS@gmail.com'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      try {
        // Increased delay to allow Supabase to fully load session from localStorage
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setAuthorized(false)
          router.push('/login')
          return
        }

        const email = session.user.email?.toLowerCase()
        const adminEmail = ADMIN_EMAIL.toLowerCase()

        if (email === adminEmail) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
          toast.error('Unauthorized', {
            description: 'You do not have administrator privileges.'
          })
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setAuthorized(false)
      }
    }

    checkAdmin()
  }, [router])

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-gold mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-taupe-dark mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            You do not have permission to access the admin portal. 
            Please log in with the authorized admin account: <span className="font-bold text-taupe">{ADMIN_EMAIL}</span>.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => router.push('/login')}
              className="w-full bg-taupe hover:bg-taupe-dark text-white rounded-full py-6"
            >
              Go to Login
            </Button>
            <Button 
              variant="ghost"
              onClick={() => router.push('/')}
              className="w-full text-muted-foreground hover:text-taupe rounded-full"
            >
              Return to Store
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {children}
    </div>
  )
}
