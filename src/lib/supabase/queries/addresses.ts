import { createClient } from "@/lib/supabase/client";
import type { Address, Database } from "@/lib/supabase/types";

type AddressInsert = Database["public"]["Tables"]["addresses"]["Insert"];

export async function getAddresses(profileId: string): Promise<Address[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch addresses: ${error.message}`);
  }

  return data ?? [];
}

export async function saveAddress(data: AddressInsert): Promise<Address> {
  const supabase = createClient();

  // If this address is set as default, unset all others first
  if (data.is_default) {
    const { error: unsetError } = await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("profile_id", data.profile_id)
      .eq("is_default", true);

    if (unsetError) {
      throw new Error(
        `Failed to unset default addresses: ${unsetError.message}`
      );
    }
  }

  const { data: address, error } = await supabase
    .from("addresses")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save address: ${error.message}`);
  }

  return address;
}

export async function deleteAddress(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("addresses").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete address: ${error.message}`);
  }
}
