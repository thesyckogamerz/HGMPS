"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Lock, Mail, User, LogIn, Chrome } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, signUpSchema, type LoginFormData, type SignUpFormData } from '@/lib/schemas'
import { useCart } from '@/lib/cart-context'
import { syncCartToDatabase } from '@/lib/cart'

export default function LoginPage() {
  const router = useRouter()
  const { items: cartItems } = useCart()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('login')

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onLoginSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          const isGmail = data.email.toLowerCase().endsWith('@gmail.com')
          toast.error('Invalid Credentials', {
            description: isGmail 
              ? "Tip: Since you're using Gmail, try clicking 'Continue with Google' instead!"
              : "Please check your email and password."
          })
        } else {
          toast.error('Login Failed', { description: error.message })
        }
        return
      }

      if (authData.session) {
        const userEmail = authData.session.user.email?.toLowerCase()
        const envAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').toLowerCase()
        
        // Check profile role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.session.user.id)
          .single()

        const isAdmin = (profile?.role === 'admin') || (userEmail === envAdminEmail)

        // Sync cart only if there are local items
        if (cartItems.length > 0) {
          toast.info('Syncing your cart...', { duration: 2000 })
          const syncResult = await syncCartToDatabase(authData.session.user.id, cartItems)
          
          if (!syncResult.success) {
            toast.error('Cart Sync Failed', { 
              description: syncResult.error?.includes('schema') 
                ? 'Database setup required. Please contact support.'
                : 'Your cart could not be synced. Items are saved locally.'
            })
          }
        }
        
        // Redirect based on user role
        if (isAdmin) {
          toast.success('Welcome back, Admin!', { description: "Redirecting to admin portal..." })
          // Use window.location for hard redirect to ensure session is loaded
          setTimeout(() => {
            window.location.href = '/admin'
          }, 500)
        } else {
          toast.success('Welcome back!', { description: "You have signed in successfully." })
          router.refresh()
          router.push('/')
        }
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onSignUpSubmit = async (data: SignUpFormData) => {
    setLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            email: data.email,
          }
        }
      })

      if (error) {
         if (error.message.includes('already registered')) {
             toast.error('User already exists', { description: "Please log in instead." })
         } else {
             toast.error('Signup Failed', { description: error.message })
         }
         return
      }

      if (authData.session) {
          // Sync cart
          await syncCartToDatabase(authData.session.user.id, cartItems)
          toast.success('Account Created!', { description: "You are signed in automatically." })
          router.refresh()
          router.push('/')
      } else if (authData.user) {
          toast.success('Check your email', { description: "We've sent you a verification link." })
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error('Google Sign-In Failed', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className="container flex items-center justify-center min-h-[90vh] py-12 bg-muted/20">
      <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Welcome</CardTitle>
          <CardDescription>
            Manage your account and orders
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 mb-8">
            <Button 
                variant="outline" 
                onClick={handleGoogleLogin} 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-11 border-2 hover:bg-muted transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Chrome className="h-5 w-5 text-[#4285F4]" />}
              <span>Continue with Google</span>
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN FORM */}
            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="login-email" 
                      type="email"
                      placeholder="name@example.com" 
                      className="pl-10" 
                      {...loginForm.register('email')} 
                    />
                  </div>
                  {loginForm.watch('email')?.toLowerCase().endsWith('@gmail.com') && (
                    <p className="text-[10px] text-amber-600 font-medium animate-in fade-in slide-in-from-top-1">
                      💡 Tip: Using Google Login is faster and more secure!
                    </p>
                  )}
                  {loginForm.formState.errors.email && (
                    <p className="text-destructive text-xs">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-pass">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="login-pass" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password" 
                      className="pl-10 pr-10" 
                      {...loginForm.register('password')} 
                    />
                    <button 
                      type="button" 
                      onClick={togglePasswordVisibility} 
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-destructive text-xs">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full mt-4" disabled={loading} size="lg">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log In'}
                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP FORM */}
            <TabsContent value="signup">
               <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="signup-name" 
                      placeholder="John Doe" 
                      className="pl-10" 
                      {...signUpForm.register('fullName')} 
                    />
                  </div>
                   {signUpForm.formState.errors.fullName && (
                    <p className="text-destructive text-xs">{signUpForm.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                   <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="signup-email" 
                      type="email"
                      placeholder="name@example.com" 
                      className="pl-10" 
                      {...signUpForm.register('email')} 
                    />
                  </div>
                   {signUpForm.formState.errors.email && (
                    <p className="text-destructive text-xs">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-pass">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="signup-pass" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Min 6 characters" 
                      className="pl-10 pr-10" 
                      {...signUpForm.register('password')} 
                    />
                    <button 
                      type="button" 
                      onClick={togglePasswordVisibility} 
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                   {signUpForm.formState.errors.password && (
                    <p className="text-destructive text-xs">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>

                 <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="signup-confirm" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Repeat password" 
                      className="pl-10" 
                      {...signUpForm.register('confirmPassword')} 
                    />
                  </div>
                   {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-destructive text-xs">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full mt-4" disabled={loading} size="lg">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4 bg-muted/50 rounded-b-xl">
          <Button variant="link" size="sm" onClick={() => router.push('/')} className="text-muted-foreground hover:text-primary">
            ← Back to Store
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}