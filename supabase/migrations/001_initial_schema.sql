-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  full_name TEXT,
  preferred_locale TEXT NOT NULL DEFAULT 'ar'
    CHECK (preferred_locale IN ('ar', 'en')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_phone ON public.profiles(phone);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- addresses
-- ============================================================
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_addresses_profile_id ON public.addresses(profile_id);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses"
  ON public.addresses FOR ALL
  USING (profile_id = auth.uid());

-- ============================================================
-- measurements
-- ============================================================
CREATE TABLE public.measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  method TEXT NOT NULL
    CHECK (method IN ('ai', 'standard', 'home_visit', 'send_thobe')),
  height_cm DOUBLE PRECISION NOT NULL,
  weight_kg DOUBLE PRECISION,
  body_type TEXT
    CHECK (body_type IS NULL OR body_type IN ('slim', 'regular', 'broad')),
  size TEXT
    CHECK (size IS NULL OR size IN ('S', 'M', 'L', 'XL')),
  shoulder DOUBLE PRECISION NOT NULL,
  chest DOUBLE PRECISION NOT NULL,
  waist DOUBLE PRECISION NOT NULL,
  sleeve_length DOUBLE PRECISION NOT NULL,
  thobe_length DOUBLE PRECISION NOT NULL,
  neck DOUBLE PRECISION NOT NULL,
  alterations JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_measurements_profile_id ON public.measurements(profile_id);
CREATE INDEX idx_measurements_active ON public.measurements(profile_id, is_active)
  WHERE is_active = true;

ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own measurements"
  ON public.measurements FOR ALL
  USING (profile_id = auth.uid());

-- ============================================================
-- fabrics
-- ============================================================
CREATE TABLE public.fabrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier TEXT NOT NULL
    CHECK (tier IN ('economy', 'mid', 'premium')),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  swatch_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_fabrics_active_sort ON public.fabrics(is_active, sort_order);

ALTER TABLE public.fabrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fabrics are publicly readable"
  ON public.fabrics FOR SELECT
  USING (true);

-- ============================================================
-- personalizations
-- ============================================================
CREATE TABLE public.personalizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL
    CHECK (level IN ('standard', 'enhanced', 'full_custom')),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.personalizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Personalizations are publicly readable"
  ON public.personalizations FOR SELECT
  USING (true);

-- ============================================================
-- orders
-- ============================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT NOT NULL UNIQUE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  measurement_id UUID NOT NULL REFERENCES public.measurements(id),
  fabric_id UUID NOT NULL REFERENCES public.fabrics(id),
  personalization_id UUID NOT NULL REFERENCES public.personalizations(id),
  tier TEXT NOT NULL DEFAULT 'regular'
    CHECK (tier IN ('regular', 'vip')),
  status TEXT NOT NULL DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'in_production', 'quality_checked', 'out_for_delivery', 'delivered')),
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  home_visit_fee INTEGER NOT NULL DEFAULT 0 CHECK (home_visit_fee >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),
  promo_code TEXT,
  discount INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0),
  delivery_estimate DATE NOT NULL,
  delivery_address_id UUID NOT NULL REFERENCES public.addresses(id),
  tracking_url TEXT,
  payment_method TEXT NOT NULL
    CHECK (payment_method IN ('apple_pay', 'stc_pay', 'credit_card')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_profile_id ON public.orders(profile_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_reference ON public.orders(reference_number);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- ============================================================
-- order_events
-- ============================================================
CREATE TABLE public.order_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_events_order_id ON public.order_events(order_id);

ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order events"
  ON public.order_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_events.order_id
        AND orders.profile_id = auth.uid()
    )
  );

-- ============================================================
-- home_visits
-- ============================================================
CREATE TABLE public.home_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address_id UUID NOT NULL REFERENCES public.addresses(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked'
    CHECK (status IN ('booked', 'completed', 'cancelled')),
  fee_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_home_visits_profile_id ON public.home_visits(profile_id);

ALTER TABLE public.home_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own home visits"
  ON public.home_visits FOR ALL
  USING (profile_id = auth.uid());

-- ============================================================
-- alteration_requests
-- ============================================================
CREATE TABLE public.alteration_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_alteration_requests_order_id ON public.alteration_requests(order_id);

ALTER TABLE public.alteration_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own alteration requests"
  ON public.alteration_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = alteration_requests.order_id
        AND orders.profile_id = auth.uid()
    )
  );

-- ============================================================
-- updated_at trigger for orders
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_orders_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
