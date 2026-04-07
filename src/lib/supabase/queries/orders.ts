import { createClient } from "@/lib/supabase/client";
import type { Order, OrderEvent, Database } from "@/lib/supabase/types";

type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];

export async function createOrder(data: OrderInsert): Promise<Order> {
  const supabase = createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(data)
    .select()
    .single();

  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  // Insert the initial order event
  const { error: eventError } = await supabase
    .from("order_events")
    .insert({
      order_id: order.id,
      status: "confirmed",
      note: null,
    });

  if (eventError) {
    throw new Error(`Failed to create order event: ${eventError.message}`);
  }

  return order;
}

export async function getOrders(profileId: string): Promise<Order[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return data ?? [];
}

export async function getOrderById(
  id: string
): Promise<(Order & { events: OrderEvent[] }) | null> {
  const supabase = createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError) {
    if (orderError.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch order: ${orderError.message}`);
  }

  const { data: events, error: eventsError } = await supabase
    .from("order_events")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  if (eventsError) {
    throw new Error(`Failed to fetch order events: ${eventsError.message}`);
  }

  return { ...order, events: events ?? [] };
}
