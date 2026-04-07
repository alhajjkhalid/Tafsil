import { createClient } from "@/lib/supabase/client";
import type { Fabric } from "@/lib/supabase/types";

export async function getFabrics(): Promise<Fabric[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("fabrics")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch fabrics: ${error.message}`);
  }

  return data ?? [];
}

export async function getFabricById(id: string): Promise<Fabric | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("fabrics")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch fabric: ${error.message}`);
  }

  return data;
}
