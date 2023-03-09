import { NextResponse } from 'next/server';
import verify from '@/lib/verify';
// import type { NextRequest } from 'next/server';

// export default async function middleware(request : NextRequest) {
export default async function middleware(request) {
  const auth = await verify(request);

  if (request.nextUrl.pathname.startsWith('/login')) {
    if (auth) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }

    return NextResponse.next();
  }

  if (!auth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
