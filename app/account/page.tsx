"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, LogOut, Package, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkingSession, setCheckingSession] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user || null)
          setLoading(false)
          setCheckingSession(false)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          router.replace('/login')
        } else if (event === 'INITIAL_SESSION') {
          // Initial session check
          if (session?.user) {
            setUser(session.user)
          } else {
            router.replace('/login')
          }
          setLoading(false)
          setCheckingSession(false)
        }
      }
    )

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          router.replace('/login')
          return
        }
        
        if (!session) {
          console.log('No session found, redirecting to login')
          router.replace('/login')
          return
        }
        
        console.log('Session found for:', session.user?.email)
        setUser(session.user)
      } catch (error) {
        console.error('Failed to check session:', error)
        router.replace('/login')
      } finally {
        setLoading(false)
        setCheckingSession(false)
      }
    }

    checkSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      // Don't redirect here - the onAuthStateChange will handle it
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Show loading state longer to prevent flash
  if (checkingSession || loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-taupe mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading account...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Account Required</CardTitle>
            <CardDescription>
              Please sign in to view your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">My Account</h1>
        
        <div className="grid gap-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{user.user_metadata?.full_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{user.user_metadata?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Admin Access Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Admin Access
              </CardTitle>
              <CardDescription>
                Manage your product catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/products">
                <Button className="w-full sm:w-auto">
                  Go to Admin Panel
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}