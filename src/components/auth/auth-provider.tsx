'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';
import { getOrCreateProfile } from '@/lib/supabase/queries/profiles';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, signOut } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // onAuthStateChange fires INITIAL_SESSION immediately on mount —
    // no need for a separate getSession() call.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Only fetch/create profile on initial load or new sign-in, not on token refresh
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          try {
            const profile = await getOrCreateProfile(
              session.user.id,
              session.user.phone ?? ''
            );
            setProfile(profile);
          } catch (err) {
            console.error('Failed to load profile:', err);
          }
        }
      } else {
        signOut();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile, signOut]);

  return <>{children}</>;
}
