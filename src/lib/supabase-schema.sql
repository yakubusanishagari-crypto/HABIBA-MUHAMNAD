-- ==============================================================================
-- HABEEVATUSSUNNAH ONLINE BUSINESS - COMPLETE SUPABASE POSTGRESQL BACKEND SCHEMA
-- Brand: HABEEVATUSSUNNAH ONLINE BUSINESS
-- Official Contacts:
--   Primary Phone & WhatsApp: +2348034343283 / 08034343283
--   Secondary Phone: +2348065812090
--   Email: habibamohammed02090@gmail.com
--   Payment Method: OPay Transfer
--   Account Name: HABIBA MUHAMMAD
--   Account Number: 8034343283
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. SCHEMAS & TABLES
-- ==============================================================================

-- A. Categories Table (Supports English, Hausa, Arabic)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  name_ha TEXT,
  name_ar TEXT,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  description_en TEXT,
  description_ha TEXT,
  description_ar TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. Subcategories Table
CREATE TABLE IF NOT EXISTS public.subcategories (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_en TEXT,
  name_ha TEXT,
  name_ar TEXT,
  slug TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- C. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  name_ha TEXT,
  name_ar TEXT,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  description_en TEXT,
  description_ha TEXT,
  description_ar TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  discount_price NUMERIC(12, 2) CHECK (discount_price >= 0),
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  subcategory_id TEXT REFERENCES public.subcategories(id) ON DELETE SET NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Men', 'Women', 'Kids', 'Unisex')),
  sku TEXT NOT NULL UNIQUE,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  main_image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. Product Variants Table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id TEXT PRIMARY KEY DEFAULT ('var-' || substr(md5(random()::text), 1, 8)),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  sku TEXT,
  price NUMERIC(12, 2),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- E. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- Formatted: ORD-YYYYMMDD-XXXX
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  additional_notes TEXT,
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 2500 CHECK (delivery_fee >= 0),
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT DEFAULT 'OPAY_TRANSFER' CHECK (payment_method IN ('OPAY_TRANSFER', 'BANK_TRANSFER')),
  payment_status TEXT DEFAULT 'Awaiting Confirmation' CHECK (payment_status IN ('Pending', 'Payment Submitted', 'Awaiting Confirmation', 'Confirmed', 'Rejected')),
  order_status TEXT DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Processing', 'Ready for Delivery', 'Shipped', 'Delivered', 'Cancelled')),
  tracking_stage TEXT DEFAULT 'SELLER CONFIRMED' CHECK (tracking_stage IN ('SELLER CONFIRMED', 'PACKAGING', 'HANDED TO LOGISTICS', 'IN TRANSIT', 'OUT FOR DELIVERY', 'DELIVERED', 'CANCELLED')),
  tracking_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- F. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY DEFAULT ('item-' || substr(md5(random()::text), 1, 8)),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  selected_size TEXT,
  selected_color TEXT,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- G. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY DEFAULT ('msg-' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- H. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary_settings',
  business_name TEXT NOT NULL DEFAULT 'HABEEVATUSSUNNAH ONLINE BUSINESS',
  phone_number TEXT NOT NULL DEFAULT '+2348034343283',
  secondary_phone TEXT NOT NULL DEFAULT '+2348065812090',
  email TEXT NOT NULL DEFAULT 'habibamohammed02090@gmail.com',
  whatsapp_number TEXT NOT NULL DEFAULT '+2348034343283',
  whatsapp_destination TEXT NOT NULL DEFAULT 'https://wa.me/2348034343283',
  payment_provider TEXT NOT NULL DEFAULT 'OPAY',
  account_name TEXT NOT NULL DEFAULT 'HABIBA MUHAMMAD',
  account_number TEXT NOT NULL DEFAULT '8034343283',
  default_delivery_fee NUMERIC(12, 2) DEFAULT 2500,
  currency_symbol TEXT DEFAULT '₦',
  announcement_banner TEXT DEFAULT 'Welcome to Habeevatussunnah Online Business! Enjoy convenient OPay transfers and fast order confirmation.',
  background_theme TEXT DEFAULT 'white',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- I. Admin Users Table (For store managers and administrators)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'store_manager', 'inventory_clerk')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. INDEXES FOR HIGH-SPEED QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products(gender);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new_arrival ON public.products(is_new_arrival);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ==============================================================================
-- 4. SUPABASE STORAGE BUCKET CONFIGURATION (product-images)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  TRUE,
  12582912, -- 12MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 12582912,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

-- Storage RLS Policies
CREATE POLICY "Public Read Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow Upload to Product Images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow Update Product Images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow Delete Product Images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Categories & Subcategories
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read subcategories" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Allow admin manage categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow admin manage subcategories" ON public.subcategories FOR ALL USING (true);

-- Products & Variants
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read product variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Allow admin manage products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow admin manage variants" ON public.product_variants FOR ALL USING (true);

-- Orders & Order Items
CREATE POLICY "Public create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow admin manage orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public view order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow admin manage order items" ON public.order_items FOR ALL USING (true);

-- Site Settings
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow update site settings" ON public.site_settings FOR ALL USING (true);

-- Contact Messages
CREATE POLICY "Public submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin view contact messages" ON public.contact_messages FOR ALL USING (true);

-- ==============================================================================
-- 6. AUTOMATIC UPDATED_AT TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 7. INITIAL SEED DATA
-- ==============================================================================

-- A. Insert Default Site Settings
INSERT INTO public.site_settings (
  id,
  business_name,
  phone_number,
  secondary_phone,
  email,
  whatsapp_number,
  whatsapp_destination,
  payment_provider,
  account_name,
  account_number,
  default_delivery_fee,
  currency_symbol,
  announcement_banner
) VALUES (
  'primary_settings',
  'HABEEVATUSSUNNAH ONLINE BUSINESS',
  '+2348034343283',
  '+2348065812090',
  'habibamohammed02090@gmail.com',
  '+2348034343283',
  'https://wa.me/2348034343283',
  'OPAY',
  'HABIBA MUHAMMAD',
  '8034343283',
  2500,
  '₦',
  'Welcome to Habeevatussunnah Online Business! Enjoy convenient OPay transfers and fast order confirmation.'
) ON CONFLICT (id) DO NOTHING;

-- B. Insert Official Categories
INSERT INTO public.categories (id, name, name_en, name_ha, name_ar, slug, description, image_url, display_order)
VALUES
  ('cat-women', 'Women', 'Women', 'Mata', 'النساء', 'women', 'Elegant dresses, abayas, corporate wear, shoes, handbags and premium accessories for women.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', 1),
  ('cat-men', 'Men', 'Men', 'Maza', 'الرجال', 'men', 'Classic shirts, trousers, native wear, jackets, sneakers, watches and grooming essentials.', 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80', 2),
  ('cat-kids', 'Kids Collection', 'Kids Collection', 'Kayan Yara', 'تشكيلة الأطفال', 'kids', 'Adorable and durable boys and girls clothing, footwear, bags and accessories.', 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80', 3),
  ('cat-shoes', 'Shoes & Footwear', 'Shoes & Footwear', 'Takalma', 'الأحذية', 'shoes', 'Sneakers, formal shoes, sandals, slides, and heels crafted for comfort and style.', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', 4),
  ('cat-bags', 'Bags & Luggage', 'Bags & Luggage', 'Jakunkuna', 'الحقائب', 'bags', 'Designer handbags, clutches, backpacks, tote bags and travel luggage.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', 5),
  ('cat-jewelry', 'Jewelry & Watches', 'Jewelry & Watches', 'Awarwaro & Agogo', 'المجوهرات والساعات', 'jewelry', 'Timeless luxury timepieces, necklaces, bangles, rings and fine jewelry pieces.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', 6),
  ('cat-cosmetics', 'Cosmetics & Beauty', 'Cosmetics & Beauty', 'Kayan Kwalliya', 'مستحضرات التجميل', 'cosmetics', 'Organic skincare, long-lasting fragrances, makeup essentials and personal care.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', 7),
  ('cat-home', 'Home & Kitchen', 'Home & Kitchen', 'Kayan Gida & Kicin', 'المنزل والمطبخ', 'home-kitchen', 'Luxury bed sets, kitchen materials, culinary accessories and lifestyle essentials.', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', 8)
ON CONFLICT (id) DO NOTHING;

-- C. Insert Subcategories
INSERT INTO public.subcategories (id, category_id, name, slug, display_order)
VALUES
  ('sub-women-dresses', 'cat-women', 'Dresses', 'dresses', 1),
  ('sub-women-clothing', 'cat-women', 'Clothing & Blouses', 'clothing', 2),
  ('sub-women-shoes', 'cat-women', 'Shoes & Heels', 'shoes', 3),
  ('sub-women-bags', 'cat-women', 'Handbags & Purses', 'handbags', 4),
  ('sub-men-shirts', 'cat-men', 'Shirts & Polos', 'shirts', 1),
  ('sub-men-trousers', 'cat-men', 'Trousers & Pants', 'trousers', 2),
  ('sub-men-shoes', 'cat-men', 'Shoes & Sneakers', 'shoes', 3),
  ('sub-kids-boys', 'cat-kids', 'Boys Collection', 'boys-collection', 1),
  ('sub-kids-girls', 'cat-kids', 'Girls Collection', 'girls-collection', 2),
  ('sub-shoes-sneakers', 'cat-shoes', 'Sneakers', 'sneakers', 1),
  ('sub-shoes-formal', 'cat-shoes', 'Formal Shoes', 'formal-shoes', 2),
  ('sub-bags-handbags', 'cat-bags', 'Handbags & Clutches', 'handbags', 1),
  ('sub-bags-backpacks', 'cat-bags', 'Backpacks & Laptop Bags', 'backpacks', 2)
ON CONFLICT (id) DO NOTHING;

-- D. Insert Sample Core Products
INSERT INTO public.products (
  id, name, name_en, name_ha, name_ar, slug, description,
  price, discount_price, category_id, subcategory_id, gender,
  sku, stock, main_image, images, sizes, colors, is_featured, is_new_arrival, status
) VALUES
  (
    'prod-001',
    'Men''s Classic Urban Sneaker',
    'Men''s Classic Urban Sneaker',
    'Takalmin Maza na Zamani Mai Sauki',
    'حذاء رياضي كلاسيكي عصري للرجال',
    'mens-classic-urban-sneaker',
    'Premium urban sneakers crafted with breathable upper mesh and cushioned shock-absorbing soles. Perfect for casual wear and daily commuting.',
    38500, 34000, 'cat-shoes', 'sub-shoes-sneakers', 'Men',
    'SHOE-MSNK-001', 24,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80'],
    ARRAY['40', '41', '42', '43', '44'],
    ARRAY['Red & Black', 'Pure White', 'Triple Black'],
    TRUE, TRUE, 'active'
  ),
  (
    'prod-002',
    'Luxury Royal Blue Silk Abaya Set',
    'Luxury Royal Blue Silk Abaya Set',
    'Doguwar Riga ta Alfarma Mai Hijabi',
    'طقم عباية حريرية فاخرة باللون الأزرق الملكي',
    'luxury-royal-blue-silk-abaya-set',
    'Exquisite premium Dubai silk abaya tailored with intricate embroidery, flared sleeves, and matching breathable inner dress.',
    45000, 39500, 'cat-women', 'sub-women-dresses', 'Women',
    'WMN-ABY-002', 18,
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
    ARRAY['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'],
    ARRAY['M', 'L', 'XL', 'XXL'],
    ARRAY['Royal Blue', 'Emerald Green', 'Jet Black'],
    TRUE, TRUE, 'active'
  ),
  (
    'prod-003',
    'Executive Genuine Leather Shoulder Bag',
    'Executive Genuine Leather Shoulder Bag',
    'Jakar Hannu ta Mata Mai Kyau da Karko',
    'حقيبة كتف جلدية تنفيذية فاخرة للسيدات',
    'executive-genuine-leather-shoulder-bag',
    'Structured Italian-style cowhide leather handbag featuring reinforced gold hardware, multi-compartment interior, and detachable strap.',
    32000, 28000, 'cat-bags', 'sub-bags-handbags', 'Women',
    'BAG-XSH-003', 15,
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
    ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'],
    ARRAY['Standard Size'],
    ARRAY['Classic Tan Brown', 'Midnight Black', 'Burgundy'],
    TRUE, FALSE, 'active'
  )
ON CONFLICT (id) DO NOTHING;
