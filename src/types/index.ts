export type Gender = 'Men' | 'Women' | 'Kids' | 'Unisex';

export type Language = 'en' | 'ha' | 'ar';

export type PaymentStatus = 'Pending' | 'Payment Submitted' | 'Awaiting Confirmation' | 'Confirmed' | 'Rejected';

export type OrderStatus = 'Pending' | 'Processing' | 'Ready for Delivery' | 'Shipped' | 'Delivered' | 'Cancelled';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Category {
  id: string;
  name: string;
  name_en?: string;
  name_ha?: string;
  name_ar?: string;
  slug: string;
  description?: string;
  description_en?: string;
  description_ha?: string;
  description_ar?: string;
  image_url?: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  name_en?: string;
  name_ha?: string;
  name_ar?: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id?: string;
  size?: string;
  color?: string;
  sku?: string;
  price?: number;
  stock: number;
  image_url?: string;
}

export interface Product {
  id: string;
  name: string;
  name_en?: string;
  name_ha?: string;
  name_ar?: string;
  slug: string;
  description: string;
  description_en?: string;
  description_ha?: string;
  description_ar?: string;
  price: number;
  discount_price?: number;
  category_id: string;
  subcategory_id?: string;
  gender: Gender;
  sku: string;
  stock: number;
  images: string[];
  main_image: string;
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
  is_featured: boolean;
  is_new_arrival: boolean;
  rating?: number;
  reviews_count?: number;
  tags?: string[];
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string; // unique item id including variant key
  product_id: string;
  product: Product;
  selected_size?: string;
  selected_color?: string;
  quantity: number;
  price: number;
}

export interface CustomerInfo {
  full_name: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  delivery_address: string;
  city: string;
  state: string;
  additional_notes?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  selected_size?: string;
  selected_color?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export type TrackingStage =
  | 'SELLER CONFIRMED'
  | 'PACKAGING'
  | 'HANDED TO LOGISTICS'
  | 'IN TRANSIT'
  | 'OUT FOR DELIVERY'
  | 'DELIVERED';

export type BackgroundTheme = 'white' | 'amber' | 'sapphire' | 'emerald' | 'rose';

export type HeroBackgroundOption =
  | 'royal_emerald'
  | 'midnight_noir'
  | 'imperial_ruby'
  | 'majestic_sapphire'
  | 'sultan_onyx';

export interface Order {
  id: string; // e.g. ORD-20261008-7492
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: 'OPAY_TRANSFER';
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  tracking_stage?: TrackingStage;
  tracking_updated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  business_name: string;
  phone_number: string;
  secondary_phone?: string;
  email?: string;
  whatsapp_number: string;
  whatsapp_destination: string;
  payment_provider: string;
  account_name: string;
  account_number: string;
  default_delivery_fee: number;
  currency_symbol: string;
  announcement_banner?: string;
  background_theme?: BackgroundTheme;
  hero_background?: HeroBackgroundOption;
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'price-low-to-high'
  | 'price-high-to-low'
  | 'popular'
  | 'featured';

export interface ProductFiltersState {
  searchQuery: string;
  categoryId: string;
  subcategoryId: string;
  gender: string;
  minPrice: number;
  maxPrice: number;
  availability: 'all' | 'in-stock' | 'low-stock';
  sortBy: SortOption;
}
