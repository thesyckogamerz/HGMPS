"use client"

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, ShieldCheck, Mail, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function SetupAdminPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [adminEmail, setAdminEmail] = useState<string>('')

  useEffect(() => {
    setAdminEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
    
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }
    checkSession()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    )
  }

  const isEmailMatch = session?.user?.email?.toLowerCase() === adminEmail.toLowerCase()

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
      <Card className="max-w-xl w-full shadow-2xl border-t-4 border-t-gold">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-gold" />
          </div>
          <CardTitle className="text-3xl font-serif">Admin Setup Assistant</CardTitle>
          <CardDescription>
            Verify your account status to access the admin portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-taupe" />
              Configured Admin Email
            </h3>
            <div className="p-3 bg-slate-50 rounded-lg font-mono text-center text-taupe-dark border border-slate-200">
              {adminEmail}
            </div>
            <p className="text-sm text-muted-foreground">
              This email is set in your <code className="bg-slate-100 px-1 rounded">.env.local</code> file. Only accounts with this exact email can access the admin portal.
            </p>
          </div>

          <div className={`rounded-2xl p-6 border transition-all ${session ? (isEmailMatch ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200') : 'bg-red-50 border-red-200'}`}>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              {session ? (
                isEmailMatch ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <AlertCircle className="h-6 w-6 text-amber-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              Current Status
            </h3>

            {session ? (
              <div className="space-y-4">
                <p>You are logged in as: <span className="font-bold">{session.user.email}</span></p>
                {isEmailMatch ? (
                  <p className="text-green-700 font-medium">✨ Perfect! You have admin access.</p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-amber-700">
                      You are logged in, but not with the admin email. You will get "Access Denied" if you try to enter the portal.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" onClick={() => supabase.auth.signOut()}>Sign Out & Create Admin Account</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-red-700">You are not logged in.</p>
                <Button className="w-full bg-taupe hover:bg-taupe-dark text-white" asChild>
                  <Link href="/login">Go to Login / Sign Up Page</Link>
                </Button>
              </div>
            )}
          </div>

          {isEmailMatch && (
            <Button className="w-full bg-gold hover:bg-gold/90 text-white py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-[1.02]" asChild>
              <Link href="/admin">Enter Admin Portal</Link>
            </Button>
          )}

          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-medium text-sm mb-2">Instructions for "Invalid Credentials":</h4>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
              <li>If you keep getting "Invalid Credentials", you likely haven't **Signed Up** with this email yet.</li>
              <li>Go to the Login page, switch to the **Sign Up** tab, and create an account using <code className="bg-slate-100 px-1 rounded">{adminEmail}</code>.</li>
              <li>Make sure there are no typos in the email or password.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
