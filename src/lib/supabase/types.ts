export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string;
          full_name: string | null;
          preferred_locale: "ar" | "en";
          created_at: string;
        };
        Insert: {
          id: string;
          phone: string;
          full_name?: string | null;
          preferred_locale?: "ar" | "en";
          created_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          full_name?: string | null;
          preferred_locale?: "ar" | "en";
          created_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          profile_id: string;
          label: string;
          address_line: string;
          city: string;
          lat: number | null;
          lng: number | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          label: string;
          address_line: string;
          city: string;
          lat?: number | null;
          lng?: number | null;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          label?: string;
          address_line?: string;
          city?: string;
          lat?: number | null;
          lng?: number | null;
          is_default?: boolean;
          created_at?: string;
        };
      };
      measurements: {
        Row: {
          id: string;
          profile_id: string;
          method: "ai" | "standard" | "home_visit" | "send_thobe";
          height_cm: number;
          weight_kg: number | null;
          body_type: "slim" | "regular" | "broad" | null;
          size: "S" | "M" | "L" | "XL" | null;
          shoulder: number;
          chest: number;
          waist: number;
          sleeve_length: number;
          thobe_length: number;
          neck: number;
          alterations: Json | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          method: "ai" | "standard" | "home_visit" | "send_thobe";
          height_cm: number;
          weight_kg?: number | null;
          body_type?: "slim" | "regular" | "broad" | null;
          size?: "S" | "M" | "L" | "XL" | null;
          shoulder: number;
          chest: number;
          waist: number;
          sleeve_length: number;
          thobe_length: number;
          neck: number;
          alterations?: Json | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          method?: "ai" | "standard" | "home_visit" | "send_thobe";
          height_cm?: number;
          weight_kg?: number | null;
          body_type?: "slim" | "regular" | "broad" | null;
          size?: "S" | "M" | "L" | "XL" | null;
          shoulder?: number;
          chest?: number;
          waist?: number;
          sleeve_length?: number;
          thobe_length?: number;
          neck?: number;
          alterations?: Json | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      fabrics: {
        Row: {
          id: string;
          tier: "economy" | "mid" | "premium";
          name_ar: string;
          name_en: string;
          description_ar: string;
          description_en: string;
          price: number;
          swatch_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tier: "economy" | "mid" | "premium";
          name_ar: string;
          name_en: string;
          description_ar: string;
          description_en: string;
          price: number;
          swatch_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tier?: "economy" | "mid" | "premium";
          name_ar?: string;
          name_en?: string;
          description_ar?: string;
          description_en?: string;
          price?: number;
          swatch_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      personalizations: {
        Row: {
          id: string;
          level: "standard" | "enhanced" | "full_custom";
          name_ar: string;
          name_en: string;
          description_ar: string;
          description_en: string;
          price: number;
          features: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          level: "standard" | "enhanced" | "full_custom";
          name_ar: string;
          name_en: string;
          description_ar: string;
          description_en: string;
          price: number;
          features?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          level?: "standard" | "enhanced" | "full_custom";
          name_ar?: string;
          name_en?: string;
          description_ar?: string;
          description_en?: string;
          price?: number;
          features?: Json;
          is_active?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          reference_number: string;
          profile_id: string;
          measurement_id: string;
          fabric_id: string;
          personalization_id: string;
          tier: "regular" | "vip";
          status:
            | "confirmed"
            | "in_production"
            | "quality_checked"
            | "out_for_delivery"
            | "delivered";
          subtotal: number;
          home_visit_fee: number;
          total: number;
          promo_code: string | null;
          discount: number;
          delivery_estimate: string;
          delivery_address_id: string;
          tracking_url: string | null;
          payment_method: "apple_pay" | "stc_pay" | "credit_card";
          payment_status: "pending" | "paid" | "refunded";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_number: string;
          profile_id: string;
          measurement_id: string;
          fabric_id: string;
          personalization_id: string;
          tier?: "regular" | "vip";
          status?:
            | "confirmed"
            | "in_production"
            | "quality_checked"
            | "out_for_delivery"
            | "delivered";
          subtotal: number;
          home_visit_fee?: number;
          total: number;
          promo_code?: string | null;
          discount?: number;
          delivery_estimate: string;
          delivery_address_id: string;
          tracking_url?: string | null;
          payment_method: "apple_pay" | "stc_pay" | "credit_card";
          payment_status?: "pending" | "paid" | "refunded";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference_number?: string;
          profile_id?: string;
          measurement_id?: string;
          fabric_id?: string;
          personalization_id?: string;
          tier?: "regular" | "vip";
          status?:
            | "confirmed"
            | "in_production"
            | "quality_checked"
            | "out_for_delivery"
            | "delivered";
          subtotal?: number;
          home_visit_fee?: number;
          total?: number;
          promo_code?: string | null;
          discount?: number;
          delivery_estimate?: string;
          delivery_address_id?: string;
          tracking_url?: string | null;
          payment_method?: "apple_pay" | "stc_pay" | "credit_card";
          payment_status?: "pending" | "paid" | "refunded";
          created_at?: string;
          updated_at?: string;
        };
      };
      order_events: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          status?: string;
          note?: string | null;
          created_at?: string;
        };
      };
      home_visits: {
        Row: {
          id: string;
          profile_id: string;
          address_id: string;
          scheduled_at: string;
          status: "booked" | "completed" | "cancelled";
          fee_paid: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          address_id: string;
          scheduled_at: string;
          status?: "booked" | "completed" | "cancelled";
          fee_paid?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          address_id?: string;
          scheduled_at?: string;
          status?: "booked" | "completed" | "cancelled";
          fee_paid?: boolean;
          created_at?: string;
        };
      };
      alteration_requests: {
        Row: {
          id: string;
          order_id: string;
          description: string;
          status: "submitted" | "in_progress" | "resolved";
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          description: string;
          status?: "submitted" | "in_progress" | "resolved";
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          description?: string;
          status?: "submitted" | "in_progress" | "resolved";
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type Measurement = Database["public"]["Tables"]["measurements"]["Row"];
export type Fabric = Database["public"]["Tables"]["fabrics"]["Row"];
export type Personalization = Database["public"]["Tables"]["personalizations"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderEvent = Database["public"]["Tables"]["order_events"]["Row"];
export type HomeVisit = Database["public"]["Tables"]["home_visits"]["Row"];
export type AlterationRequest = Database["public"]["Tables"]["alteration_requests"]["Row"];
