import { NextResponse } from 'next/server';

export function middleware(request) {
  const auth = request.cookies.get('meal_auth')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (auth === 'ok') return NextResponse.next();
  if (isLoginPage) return NextResponse.next();

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};