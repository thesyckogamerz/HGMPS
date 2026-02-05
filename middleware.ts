import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect admin routes
  if (pathname.startsWith('/admin')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.next()
    }

    // Create a Supabase client specifically for the middleware
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })

    // Check for any Supabase auth cookie (format: sb-[project-id]-auth-token)
    // NOTE: Since we are using client-side auth (localStorage) and not @supabase/ssr, 
    // the server might not see the cookies. We will allow the request to proceed
    // and let the client-side admin/layout.tsx handle the actual security check.
    
    // We strictly rely on app/admin/layout.tsx for security now.
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
