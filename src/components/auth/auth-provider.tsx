'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';
import { getOrCreateProfile } from '@/lib/supabase/queries/profiles';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, signOut } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // Hydrate store from existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        getOrCreateProfile(session.user.id, session.user.phone ?? '')
          .then(setProfile)
          .catch(console.error);
      } else {
        // No session — mark loading done
        setUser(null);
      }
    });

    // Keep store in sync with any auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        try {
          const profile = await getOrCreateProfile(
            session.user.id,
            session.user.phone ?? ''
          );
          setProfile(profile);
        } catch (err) {
          console.error('Failed to load profile:', err);
        }
      } else {
        signOut();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile, signOut]);

  return <>{children}</>;
}
