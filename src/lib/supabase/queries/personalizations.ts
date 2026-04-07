import { createClient } from "@/lib/supabase/client";
import type { Personalization } from "@/lib/supabase/types";

export async function getPersonalizations(): Promise<Personalization[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("personalizations")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch personalizations: ${error.message}`);
  }

  return data ?? [];
}

export async function getPersonalizationById(
  id: string
): Promise<Personalization | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("personalizations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch personalization: ${error.message}`);
  }

  return data;
}
