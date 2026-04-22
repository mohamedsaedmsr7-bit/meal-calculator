import { NextResponse } from 'next/server'

export function middleware(request) {
  const cookie = request.cookies.get('meal_auth')
  const isLogin = request.nextUrl.pathname.startsWith('/login')
  const isApi = request.nextUrl.pathname.startsWith('/api')

  if (isLogin || isApi) return NextResponse.next()
  if (cookie?.value === 'ok') return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}