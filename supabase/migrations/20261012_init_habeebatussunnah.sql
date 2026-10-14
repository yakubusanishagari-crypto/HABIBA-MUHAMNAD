-- Migration: Habeebatussunnah Online Business
-- Clean, idempotent, banner-free PostgreSQL schema for Supabase

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND (
      auth.jwt() ->> 'email' IN ('habibamohammed02090@gmail.com', 'yakubusanishagari@gmail.com')
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
      OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  slug TEXT UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (cost_price >= 0),
  landed_cost NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (landed_cost >= 0),
  discount_price NUMERIC(12, 2) CHECK (discount_price IS NULL OR (discount_price >= 0 AND discount_price < price)),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  additional_images TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  sku TEXT UNIQUE NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  colors TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  gender TEXT NOT NULL DEFAULT 'Women' CHECK (gender IN ('Men', 'Women', 'Kids', 'Unisex')),
  slug TEXT UNIQUE,
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products(gender);

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. Customers
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_number TEXT,
  email TEXT,
  delivery_address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

DROP TRIGGER IF EXISTS trg_customers_updated_at ON public.customers;
CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  payment_status TEXT NOT NULL DEFAULT 'Pending'
    CHECK (payment_status IN ('Pending', 'Payment Submitted', 'Awaiting Confirmation', 'Confirmed', 'Rejected')),
  order_status TEXT NOT NULL DEFAULT 'Pending'
    CHECK (order_status IN ('Pending', 'Processing', 'Ready for Delivery', 'Shipped', 'Delivered', 'Cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'OPAY_TRANSFER',
  delivery_address TEXT NOT NULL,
  tracking_stage TEXT NOT NULL DEFAULT 'SELLER CONFIRMED'
    CHECK (tracking_stage IN ('SELLER CONFIRMED', 'PACKAGING', 'HANDED TO LOGISTICS', 'IN TRANSIT', 'OUT FOR DELIVERY', 'DELIVERED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Order items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  selected_size TEXT,
  selected_color TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- 6. Inventory movements
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('purchase', 'sale', 'return', 'adjustment')),
  quantity INTEGER NOT NULL,
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_product ON public.inventory_movements(product_id);

CREATE OR REPLACE FUNCTION public.handle_inventory_movement_stock_sync()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = GREATEST(0, stock_quantity + NEW.quantity),
      updated_at = now()
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_inventory_movement_stock_sync ON public.inventory_movements;
CREATE TRIGGER trg_inventory_movement_stock_sync
  AFTER INSERT ON public.inventory_movements
  FOR EACH ROW EXECUTE FUNCTION public.handle_inventory_movement_stock_sync();

-- 7. Site settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary_settings',
  business_name TEXT NOT NULL DEFAULT 'HABEEBATUSSUNNAH ONLINE BUSINESS',
  phone_number TEXT NOT NULL DEFAULT '+2348034343283',
  secondary_phone TEXT DEFAULT '+2348065812090',
  email TEXT DEFAULT 'habibamohammed02090@gmail.com',
  whatsapp_number TEXT NOT NULL DEFAULT '+2348034343283',
  whatsapp_destination TEXT NOT NULL DEFAULT '+2348034343283',
  payment_provider TEXT NOT NULL DEFAULT 'OPAY BANK (NIGERIA)',
  account_name TEXT NOT NULL DEFAULT 'HABEEBATUSSUNNAH ONLINE BUSINESS',
  account_number TEXT NOT NULL DEFAULT '8034343283',
  default_delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 3500.00,
  currency_symbol TEXT NOT NULL DEFAULT '₦',
  hero_background TEXT NOT NULL DEFAULT 'royal_emerald',
  background_theme TEXT NOT NULL DEFAULT 'white',
  announcement_banner TEXT DEFAULT 'Free express delivery on orders over ₦100,000 across Nigeria',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.site_settings (id)
VALUES ('primary_settings')
ON CONFLICT (id) DO NOTHING;

-- 8. Analytics views
CREATE OR REPLACE VIEW public.v_completed_sales AS
SELECT
  o.id AS order_id,
  o.order_number,
  o.customer_id,
  c.full_name AS customer_name,
  c.phone AS customer_phone,
  o.subtotal AS order_subtotal,
  o.delivery_fee,
  o.total_amount AS order_total,
  o.payment_status,
  o.order_status,
  o.created_at AS order_date,
  COALESCE(SUM(oi.quantity * oi.unit_cost), 0) AS total_order_cost,
  o.subtotal - COALESCE(SUM(oi.quantity * oi.unit_cost), 0) AS gross_profit
FROM public.orders o
LEFT JOIN public.customers c ON o.customer_id = c.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
WHERE o.payment_status = 'Confirmed'
  AND o.order_status != 'Cancelled'
GROUP BY o.id, o.order_number, o.customer_id, c.full_name, c.phone, o.subtotal, o.delivery_fee, o.total_amount, o.payment_status, o.order_status, o.created_at;

CREATE OR REPLACE VIEW public.v_sales_and_profit_summary AS
SELECT
  COUNT(order_id) AS total_completed_orders,
  COALESCE(SUM(order_subtotal), 0) AS total_revenue,
  COALESCE(SUM(delivery_fee), 0) AS total_delivery_collected,
  COALESCE(SUM(order_total), 0) AS gross_cash_inflow,
  COALESCE(SUM(total_order_cost), 0) AS total_cost_of_goods_sold,
  COALESCE(SUM(gross_profit), 0) AS total_gross_profit,
  CASE
    WHEN COALESCE(SUM(order_subtotal), 0) > 0
    THEN ROUND((COALESCE(SUM(gross_profit), 0) / SUM(order_subtotal)) * 100, 2)
    ELSE 0
  END AS gross_profit_margin_percent
FROM public.v_completed_sales;

CREATE OR REPLACE VIEW public.v_inventory_valuation AS
SELECT
  COUNT(id) AS total_products_count,
  COALESCE(SUM(stock_quantity), 0) AS total_units_in_stock,
  COALESCE(SUM(stock_quantity * price), 0) AS total_retail_valuation,
  COALESCE(SUM(stock_quantity * cost_price), 0) AS total_cost_valuation,
  COALESCE(SUM(stock_quantity * landed_cost), 0) AS total_landed_cost_valuation,
  COALESCE(SUM(stock_quantity * price) - SUM(stock_quantity * cost_price), 0) AS projected_inventory_margin
FROM public.products
WHERE is_active = true;

CREATE OR REPLACE FUNCTION public.get_dashboard_analytics()
RETURNS JSONB AS $$
DECLARE
  v_sales RECORD;
  v_inv RECORD;
  v_result JSONB;
BEGIN
  SELECT * INTO v_sales FROM public.v_sales_and_profit_summary;
  SELECT * INTO v_inv FROM public.v_inventory_valuation;

  v_result = jsonb_build_object(
    'sales_summary', jsonb_build_object(
      'total_completed_orders', v_sales.total_completed_orders,
      'total_revenue', v_sales.total_revenue,
      'total_cost_of_goods_sold', v_sales.total_cost_of_goods_sold,
      'total_gross_profit', v_sales.total_gross_profit,
      'gross_profit_margin_percent', v_sales.gross_profit_margin_percent
    ),
    'inventory_summary', jsonb_build_object(
      'total_products_count', v_inv.total_products_count,
      'total_units_in_stock', v_inv.total_units_in_stock,
      'total_retail_valuation', v_inv.total_retail_valuation,
      'total_cost_valuation', v_inv.total_cost_valuation,
      'projected_margin', v_inv.projected_inventory_margin
    ),
    'generated_at', now()
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure order lookup function: Customers can only fetch their own order by exact order number
CREATE OR REPLACE FUNCTION public.lookup_order(p_order_number TEXT)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_items JSONB;
BEGIN
  SELECT * INTO v_order
  FROM public.orders
  WHERE UPPER(order_number) = UPPER(TRIM(p_order_number));

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_agg(
    jsonb_build_object(
      'id', oi.id,
      'product_name', oi.product_name,
      'product_image', oi.product_image,
      'selected_size', oi.selected_size,
      'selected_color', oi.selected_color,
      'quantity', oi.quantity,
      'unit_price', oi.unit_price,
      'subtotal', oi.subtotal
    )
  ) INTO v_items
  FROM public.order_items oi
  WHERE oi.order_id = v_order.id;

  RETURN jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'subtotal', v_order.subtotal,
    'delivery_fee', v_order.delivery_fee,
    'total_amount', v_order.total_amount,
    'payment_status', v_order.payment_status,
    'order_status', v_order.order_status,
    'tracking_stage', v_order.tracking_stage,
    'created_at', v_order.created_at,
    'items', COALESCE(v_items, '[]'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Categories RLS
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Products RLS
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Customers RLS (No public read, only insert during checkout)
DROP POLICY IF EXISTS "Checkout can insert customer" ON public.customers;
CREATE POLICY "Checkout can insert customer"
  ON public.customers FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view customers" ON public.customers;
CREATE POLICY "Admins can view customers"
  ON public.customers FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Orders RLS (No public dump of all orders; only admin reads all, checkout inserts)
DROP POLICY IF EXISTS "Checkout can insert order" ON public.orders;
CREATE POLICY "Checkout can insert order"
  ON public.orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders"
  ON public.orders FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Order Items RLS
DROP POLICY IF EXISTS "Checkout can insert order items" ON public.order_items;
CREATE POLICY "Checkout can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items"
  ON public.order_items FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Inventory Movements RLS
DROP POLICY IF EXISTS "Admins can manage inventory" ON public.inventory_movements;
CREATE POLICY "Admins can manage inventory"
  ON public.inventory_movements FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Site Settings RLS
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 10. Storage Bucket & Policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  26214400,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 26214400,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

DROP POLICY IF EXISTS "Public Access product-images" ON storage.objects;
CREATE POLICY "Public Access product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin Upload product-images" ON storage.objects;
CREATE POLICY "Admin Upload product-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Update product-images" ON storage.objects;
CREATE POLICY "Admin Update product-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Delete product-images" ON storage.objects;
CREATE POLICY "Admin Delete product-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());
