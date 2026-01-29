"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  // Better phone number formatting
  const formatPhoneToEmail = (phone: string): string => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '')
    
    // For countries that use leading zero, remove it
    let normalizedDigits = digits
    if (digits.startsWith('0')) {
      normalizedDigits = digits.substring(1)
    }
    
    // Add country code if not present (assuming Pakistan/India format)
    if (normalizedDigits.length === 10) {
      // Assuming it's a Pakistan number without country code
      normalizedDigits = '92' + normalizedDigits
    }
    
    return `${normalizedDigits}@phone-user.com`
  }

  const validatePhoneNumber = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '')
    // Check if we have enough digits for a valid phone number
    return digits.length >= 10
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!validatePhoneNumber(phoneNumber)) {
        toast.error('Please enter a valid phone number (at least 10 digits)')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      if (isSignUp && !fullName.trim()) {
        toast.error('Please enter your full name')
        setLoading(false)
        return
      }

      const internalEmail = formatPhoneToEmail(phoneNumber)
      console.log('Using email:', internalEmail)

      if (isSignUp) {
        // SIGN UP FLOW
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: internalEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone_number: phoneNumber,
              raw_phone: phoneNumber.replace(/\D/g, ''),
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })

        if (error) {
          console.error('Signup error details:', error)
          
          // Handle specific error cases
          if (error.message?.includes('already registered') || error.code === 'user_already_exists') {
            toast.error('User already exists', {
              description: 'An account with this phone number already exists. Please sign in instead.'
            })
            setIsSignUp(false)
          } else if (error.message?.includes('rate limit')) {
            toast.error('Too many attempts', {
              description: 'Please wait a few minutes before trying again.'
            })
          } else {
            toast.error('Signup failed', {
              description: error.message || 'Please check your information and try again.'
            })
          }
          return
        }

        // Check if email confirmation is required
        if (signUpData.user && !signUpData.session) {
          toast.success('Account created!', {
            description: 'Please check your email (phone@phone-user.com) to confirm your account.'
          })
          setIsSignUp(false) // Switch to login view
          return
        }

        if (signUpData.session) {
          toast.success('Account created successfully!')
          router.refresh()
          router.push('/')
          return
        }

      } else {
        // LOGIN FLOW
        const { data, error } = await supabase.auth.signInWithPassword({
          email: internalEmail,
          password,
        })

        if (error) {
          console.error('Login error details:', error)
          
          if (error.message?.includes('Invalid login credentials')) {
            // Check if user exists but needs to confirm email
            const { data: userExists } = await supabase.auth.admin.listUsers()
            const users = userExists?.users || []
            const user = users.find(u => u.email === internalEmail)
            
            if (user && user.email_confirmed_at === null) {
              toast.error('Email not confirmed', {
                description: 'Please check your email to confirm your account before logging in.'
              })
            } else {
              toast.error('Invalid credentials', {
                description: 'Please check your phone number and password.'
              })
            }
          } else if (error.message?.includes('rate limit')) {
            toast.error('Too many attempts', {
              description: 'Please wait a few minutes before trying again.'
            })
          } else {
            toast.error('Login failed', {
              description: error.message || 'An error occurred during login.'
            })
          }
          return
        }

        if (data.session) {
          toast.success('Logged in successfully!')
          router.refresh()
          router.push('/')
          return
        }
      }
    } catch (error: any) {
      console.error('Unexpected error:', error)
      toast.error('An unexpected error occurred', {
        description: error.message || 'Please try again later.'
      })
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setPhoneNumber('')
    setPassword('')
    setFullName('')
  }

  const toggleSignUpMode = () => {
    clearForm()
    setIsSignUp(!isSignUp)
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-sm">
            {isSignUp
              ? 'Enter your details to create a new account'
              : 'Sign in with your phone number and password'
            }
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-medium">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isSignUp}
                  disabled={loading}
                  className="w-full"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-medium">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0300 1234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={loading}
                className="w-full"
                pattern="[0-9\s]+"
                title="Enter digits only (spaces allowed)"
              />
              <p className="text-xs text-muted-foreground">
                Enter your phone number without country code
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={isSignUp ? "Minimum 6 characters" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="w-full"
              />
              {isSignUp && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={toggleSignUpMode}
              disabled={loading}
            >
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"
              }
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm"
              onClick={() => router.push('/')}
              disabled={loading}
            >
              ← Back to Shop
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}