import { createClient } from "@/lib/supabase/client";
import type { Profile, Database } from "@/lib/supabase/types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data;
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<Profile> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return data;
}

export async function getOrCreateProfile(
  userId: string,
  phone: string
): Promise<Profile> {
  const supabase = createClient();

  // Try to fetch existing profile first
  const { data: existing, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (existing) return existing;

  // PGRST116 = "no rows" — expected for first-time users
  if (fetchError && fetchError.code !== "PGRST116") {
    throw new Error(`Failed to fetch profile: ${fetchError.message}`);
  }

  // Create profile for first-time user
  const { data, error: insertError } = await supabase
    .from("profiles")
    .insert({ id: userId, phone })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to create profile: ${insertError.message}`);
  }

  return data;
}
