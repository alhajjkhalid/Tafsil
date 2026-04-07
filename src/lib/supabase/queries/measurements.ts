import { createClient } from "@/lib/supabase/client";
import type { Measurement, Database } from "@/lib/supabase/types";

type MeasurementInsert = Database["public"]["Tables"]["measurements"]["Insert"];

export async function getMeasurements(
  profileId: string
): Promise<Measurement[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("measurements")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch measurements: ${error.message}`);
  }

  return data ?? [];
}

export async function getActiveMeasurement(
  profileId: string
): Promise<Measurement | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("measurements")
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch active measurement: ${error.message}`);
  }

  return data;
}

export async function saveMeasurement(
  data: MeasurementInsert
): Promise<Measurement> {
  const supabase = createClient();

  // Deactivate all existing measurements for this profile
  const { error: deactivateError } = await supabase
    .from("measurements")
    .update({ is_active: false })
    .eq("profile_id", data.profile_id)
    .eq("is_active", true);

  if (deactivateError) {
    throw new Error(
      `Failed to deactivate existing measurements: ${deactivateError.message}`
    );
  }

  // Insert the new measurement as active
  const { data: measurement, error: insertError } = await supabase
    .from("measurements")
    .insert({ ...data, is_active: true })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to save measurement: ${insertError.message}`);
  }

  return measurement;
}
