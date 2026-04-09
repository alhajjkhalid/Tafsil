# Authentication Design — تفصيل

**Date:** 2026-04-09  
**Status:** Approved

## Goal

Wire real Supabase Phone OTP authentication into the existing auth skeleton. Auth gates only the checkout flow — all other pages remain public.

## Scope

- Phone number + SMS OTP sign-in via Supabase Auth
- Session management via Supabase SSR (cookie-based, auto-refresh)
- Proxy replaces deprecated middleware (Next.js 16 requirement)
- Checkout page is the only gated route
- No registration page — first-time users are created automatically by Supabase on first OTP verification

## Out of Scope

- Social logins
- Email auth
- Route protection beyond checkout
- Admin/role-based access control
- Profile page auth gating (public with mock data for now)

---

## Architecture

```
Browser request
    ↓
proxy.ts  ← merged: next-intl routing + Supabase session refresh
    ↓
App renders
    ↓
AuthProvider (client component in locale layout)
    ↓  getSession() on mount + onAuthStateChange listener
Zustand auth-store  ← single source of truth for UI
    ↓
PhoneAuth component (in checkout page)
    ↓  signInWithOtp / verifyOtp via Supabase client
Supabase Auth  ← issues session cookie
```

---

## Files

### New

**`src/proxy.ts`**  
Replaces `src/middleware.ts`. Runs on every request. Merges two responsibilities:
1. next-intl locale routing (copied from existing middleware)
2. Supabase session cookie refresh — calls `supabase.auth.getUser()` which silently refreshes expired access tokens using the refresh token cookie

**`src/components/auth/auth-provider.tsx`**  
Client component. Placed in `[locale]/layout.tsx` wrapping `{children}`. On mount, calls `supabase.auth.getSession()` and writes result to auth-store. Subscribes to `onAuthStateChange` to keep store in sync for the lifetime of the session. When a user session is detected, also fetches (or creates) their row in the `profiles` table and writes it to `auth-store.profile`. No UI — purely reactive.

**`src/lib/supabase/queries/profiles.ts`**  
Add a `getOrCreateProfile(userId, phone)` function — does an upsert into the `profiles` table so first-time users get a profile row automatically on their first sign-in.

### Modified

**`src/middleware.ts`** → **deleted**

**`src/app/[locale]/layout.tsx`**  
Wrap `{children}` with `<AuthProvider>`. No other changes.

**`src/components/order/phone-auth.tsx`**  
Replace the two `setTimeout` mock functions:
- `handleSendOtp` → `supabase.auth.signInWithOtp({ phone: '+966' + phone })`
- `handleVerify` → `supabase.auth.verifyOtp({ phone: '+966' + phone, token: otpCode, type: 'sms' })`

On successful verify, Supabase automatically fires `onAuthStateChange` which the AuthProvider picks up — no manual `setUser` call needed. Remove the mock `setUser`/`setProfile` calls.

**`src/lib/store/auth-store.ts`**  
Remove the `initialize` action (it was a no-op placeholder). The `AuthProvider` now owns initialization.

---

## Data Flow — Checkout Auth Journey

```
1. User reaches /[locale]/order/checkout
   └─ PhoneAuth renders (isAuthenticated = false from store)

2. User enters 9-digit Saudi number
   └─ signInWithOtp({ phone: '+966XXXXXXXXX' })
   └─ Supabase sends SMS → OTP input shown

3. User enters 6-digit OTP
   └─ verifyOtp({ phone, token, type: 'sms' })
   └─ Supabase sets httpOnly session cookie
   └─ onAuthStateChange fires in AuthProvider
   └─ auth-store.setUser(user) called
   └─ PhoneAuth re-renders as authenticated

4. User completes checkout

5. Return visits / page refreshes
   └─ proxy.ts refreshes session cookie if needed
   └─ AuthProvider restores auth-store from getSession()
```

---

## Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Invalid phone (not 9 digits) | Client-side block, no API call |
| OTP wrong or expired | Supabase error shown inline, retry available |
| SMS not delivered | Error message shown, resend flow available |
| Network failure | Generic error message, retry available |
| Supabase env vars missing | Runtime error on first call — caught and shown |

---

## Supabase Dashboard Setup (required before testing)

1. **Supabase dashboard → Authentication → Providers → Phone** — enable it
2. **SMS Provider** — configure Twilio, MessageBird, or another provider  
   _OR_ enable **"Test OTP"** mode for development (accepts `123456` for any number — no real SMS sent)
3. **`.env.local`** must exist with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## What Does NOT Change

- Auth store shape (`user`, `profile`, `isAuthenticated`, `isLoading`)
- PhoneAuth UI (phone input, OTP grid, error display)
- Checkout page structure
- All non-checkout pages
- Zustand store usage in components
