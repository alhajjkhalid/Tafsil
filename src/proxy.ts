// src/proxy.ts
import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // Run next-intl routing — produces the response we'll return
  const response = intlMiddleware(request);

  // Create Supabase client that reads request cookies and writes to response cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — silently rotates access token using refresh token cookie.
  // IMPORTANT: Do not remove this call. It keeps the session alive across requests.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/',
    '/(ar|en)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
