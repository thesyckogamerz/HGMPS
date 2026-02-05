import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function useAdmin() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setIsAdmin(false)
          setLoading(false)
          return
        }

        // 1. Check Profile Role (Preferred)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (profile?.role === 'admin') {
          setIsAdmin(true)
          setLoading(false)
          return
        }

        // 2. Fallback: Check Email (Legacy/Environment)
        const email = session.user.email?.toLowerCase()
        const envAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').toLowerCase()

        if (email && email === envAdminEmail) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }

      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [])

  return { isAdmin, loading }
}
