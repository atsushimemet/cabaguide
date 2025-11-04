import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/admin'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // If there's an error in the URL, redirect to login
  if (error) {
    console.error('Auth error:', error, errorDescription)
    return NextResponse.redirect(new URL(`/admin-login?error=${error}`, request.url))
  }

  if (!code) {
    console.error('No code parameter in callback URL')
    return NextResponse.redirect(new URL('/admin-login?error=no_code', request.url))
  }

  // Create a mutable response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update request cookies
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          // Create new response with updated cookies
          response = NextResponse.next({
            request,
          })
          // Set cookies in the response
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options || {})
          })
        },
      },
    }
  )

  try {
    console.log('Exchanging code for session...', code)
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(new URL(`/admin-login?error=${encodeURIComponent(exchangeError.message)}`, request.url))
    }

    console.log('Session exchange successful:', data.session ? 'Session exists' : 'No session')

    if (!data.session) {
      console.error('No session created after exchange')
      return NextResponse.redirect(new URL('/admin-login?error=no_session', request.url))
    }

    // Verify the user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log('User check:', user ? `User ${user.email}` : 'No user', userError ? `Error: ${userError.message}` : '')

    if (userError || !user) {
      console.error('Error getting user:', userError)
      return NextResponse.redirect(new URL(`/admin-login?error=user_not_found`, request.url))
    }

    // 許可されたメールアドレスのみログイン可能
    const ALLOWED_EMAIL = 'noap3b69n@gmail.com'
    if (user.email !== ALLOWED_EMAIL) {
      console.error('Unauthorized email:', user.email)
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/admin-login?error=unauthorized_email', request.url))
    }

    // Successfully authenticated, redirect to admin
    // Use the response object that already has cookies set by exchangeCodeForSession
    const redirectUrl = new URL(next, request.url)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    
    // Copy all cookies from the response to the redirect response
    // This ensures the session cookies are included in the redirect
    const cookies = response.cookies.getAll()
    console.log('Copying cookies to redirect response:', cookies.length)
    cookies.forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })

    console.log('Redirecting to:', redirectUrl.toString(), 'with', cookies.length, 'cookies')
    return redirectResponse
  } catch (err) {
    console.error('Unexpected error in auth callback:', err)
    return NextResponse.redirect(new URL('/admin-login?error=unexpected', request.url))
  }
}
