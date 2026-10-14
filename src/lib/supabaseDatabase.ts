import { supabase, isSupabaseConfigured } from './supabase';
import { Category, Subcategory, Product, Order, CustomerInfo, ContactMessage, SiteSettings, OrderStatus, PaymentStatus, TrackingStage } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_SUBCATEGORIES } from '../data/initialData';
import { LocalDatabaseService } from './supabase';

/**
 * Supabase Database Service:
 * Handles direct PostgreSQL CRUD, Realtime Subscriptions, Inventory Movements,
 * and Analytics for HABEEBATUSSUNNAH ONLINE BUSINESS.
 */
export class SupabaseDatabaseService {
  /**
   * Initializes Supabase tables with initial seed data if empty
   */
  static async seedInitialDataIfEmpty(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      // 1. Check & Seed Settings
      const { data: existingSettings } = await supabase
        .from('site_settings')
        .select('id')
        .eq('id', 'primary_settings')
        .maybeSingle();

      if (!existingSettings) {
        await supabase.from('site_settings').insert({
          id: 'primary_settings',
          business_name: INITIAL_SETTINGS.business_name,
          phone_number: INITIAL_SETTINGS.phone_number,
          secondary_phone: INITIAL_SETTINGS.secondary_phone,
          email: INITIAL_SETTINGS.email,
          whatsapp_number: INITIAL_SETTINGS.whatsapp_number,
          whatsapp_destination: INITIAL_SETTINGS.whatsapp_destination,
          payment_provider: INITIAL_SETTINGS.payment_provider,
          account_name: INITIAL_SETTINGS.account_name,
          account_number: INITIAL_SETTINGS.account_number,
          default_delivery_fee: INITIAL_SETTINGS.default_delivery_fee,
          currency_symbol: INITIAL_SETTINGS.currency_symbol,
          hero_background: INITIAL_SETTINGS.hero_background || 'royal_emerald',
          background_theme: INITIAL_SETTINGS.background_theme || 'white',
          announcement_banner: INITIAL_SETTINGS.announcement_banner
        });
      }

      // 2. Check & Seed Categories
      const { data: existingCats } = await supabase.from('categories').select('id').limit(1);
      if (!existingCats || existingCats.length === 0) {
        for (const cat of INITIAL_CATEGORIES) {
          await supabase.from('categories').insert({
            name: cat.name,
            description: cat.description,
            image_url: cat.image_url,
            slug: cat.slug,
            display_order: cat.display_order,
            is_active: true
          });
        }
      }

      // 3. Check & Seed Products
      const { data: existingProds } = await supabase.from('products').select('id').limit(1);
      if (!existingProds || existingProds.length === 0) {
        for (const prod of INITIAL_PRODUCTS) {
          await supabase.from('products').insert({
            name: prod.name,
            description: prod.description,
            price: prod.price,
            cost_price: Math.round(prod.price * 0.6),
            landed_cost: Math.round(prod.price * 0.65),
            discount_price: prod.discount_price || null,
            stock_quantity: prod.stock,
            image_url: prod.main_image,
            additional_images: prod.images || [],
            sku: prod.sku,
            sizes: prod.sizes || [],
            colors: prod.colors || [],
            gender: prod.gender || 'Women',
            slug: prod.slug,
            variants: prod.variants || [],
            is_active: prod.status === 'active',
            is_featured: prod.is_featured,
            is_new_arrival: prod.is_new_arrival
          });
        }
      }
    } catch (err) {
      console.warn('Supabase initial seed notice:', err);
    }
  }

  // ==========================================
  // REALTIME SUBSCRIPTIONS
  // ==========================================

  static subscribeToSettings(onData: (settings: SiteSettings) => void): () => void {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return () => {};

    // Initial fetch
    client
      .from('site_settings')
      .select('*')
      .eq('id', 'primary_settings')
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const formatted: SiteSettings = {
            business_name: data.business_name,
            phone_number: data.phone_number,
            secondary_phone: data.secondary_phone,
            email: data.email,
            whatsapp_number: data.whatsapp_number,
            whatsapp_destination: data.whatsapp_destination,
            payment_provider: data.payment_provider,
            account_name: data.account_name,
            account_number: data.account_number,
            default_delivery_fee: Number(data.default_delivery_fee),
            currency_symbol: data.currency_symbol,
            hero_background: data.hero_background,
            background_theme: data.background_theme,
            announcement_banner: data.announcement_banner
          };
          onData(formatted);
          LocalDatabaseService.saveSettings(formatted);
        }
      });

    // Realtime channel
    const channel = client
      .channel('public:site_settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, payload => {
        if (payload.new) {
          const d = payload.new as any;
          const formatted: SiteSettings = {
            business_name: d.business_name,
            phone_number: d.phone_number,
            secondary_phone: d.secondary_phone,
            email: d.email,
            whatsapp_number: d.whatsapp_number,
            whatsapp_destination: d.whatsapp_destination,
            payment_provider: d.payment_provider,
            account_name: d.account_name,
            account_number: d.account_number,
            default_delivery_fee: Number(d.default_delivery_fee),
            currency_symbol: d.currency_symbol,
            hero_background: d.hero_background,
            background_theme: d.background_theme,
            announcement_banner: d.announcement_banner
          };
          onData(formatted);
          LocalDatabaseService.saveSettings(formatted);
        }
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  static subscribeToCategories(onData: (categories: Category[]) => void): () => void {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return () => {};

    const fetchCats = async () => {
      const { data } = await client
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        const formatted: Category[] = data.map(d => ({
          id: d.id,
          name: d.name,
          description: d.description,
          image_url: d.image_url,
          slug: d.slug || d.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          display_order: d.display_order || 0
        }));
        onData(formatted);
        LocalDatabaseService.saveCategories(formatted);
      } else {
        // If Supabase categories table is not yet populated, retain full initial category options
        const local = LocalDatabaseService.getCategories();
        if (local.length > 0) {
          onData(local);
        } else {
          onData(INITIAL_CATEGORIES);
          LocalDatabaseService.saveCategories(INITIAL_CATEGORIES);
        }
      }
    };

    fetchCats();

    const channel = client
      .channel('public:categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        fetchCats();
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  static subscribeToProducts(onData: (products: Product[]) => void): () => void {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return () => {};

    const fetchProds = async () => {
      const { data } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const formatted: Product[] = data.map(d => ({
          id: d.id,
          name: d.name,
          slug: d.slug || d.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: d.description || '',
          price: Number(d.price),
          discount_price: d.discount_price ? Number(d.discount_price) : undefined,
          category_id: d.category_id || '',
          gender: d.gender || 'Women',
          sku: d.sku,
          stock: Number(d.stock_quantity),
          images: d.additional_images && d.additional_images.length > 0 ? d.additional_images : [d.image_url],
          main_image: d.image_url,
          sizes: d.sizes || [],
          colors: d.colors || [],
          variants: Array.isArray(d.variants) ? d.variants : [],
          is_featured: Boolean(d.is_featured),
          is_new_arrival: Boolean(d.is_new_arrival),
          status: d.is_active ? 'active' : 'archived',
          created_at: d.created_at,
          updated_at: d.updated_at
        }));
        onData(formatted);
        LocalDatabaseService.saveProducts(formatted);
      }
    };

    fetchProds();

    const channel = client
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProds();
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  static subscribeToOrders(onData: (orders: Order[]) => void): () => void {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return () => {};

    const fetchOrders = async () => {
      const { data } = await client
        .from('orders')
        .select('*, customer:customers(*), items:order_items(*)')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const formatted: Order[] = data.map(d => ({
          id: d.order_number || d.id,
          customer: {
            full_name: d.customer?.full_name || 'Customer',
            phone_number: d.customer?.phone || '',
            whatsapp_number: d.customer?.whatsapp_number || d.customer?.phone || '',
            email: d.customer?.email || '',
            delivery_address: d.delivery_address || d.customer?.delivery_address || '',
            city: d.customer?.city || '',
            state: d.customer?.state || 'Nigeria'
          },
          items: (d.items || []).map((it: any) => ({
            id: it.id,
            order_id: d.order_number || it.order_id,
            product_id: it.product_id,
            product_name: it.product_name,
            product_image: it.product_image || '',
            selected_size: it.selected_size,
            selected_color: it.selected_color,
            quantity: it.quantity,
            unit_price: Number(it.unit_price),
            subtotal: Number(it.subtotal)
          })),
          subtotal: Number(d.subtotal),
          delivery_fee: Number(d.delivery_fee),
          total_amount: Number(d.total_amount),
          payment_method: 'OPAY_TRANSFER',
          payment_status: d.payment_status as PaymentStatus,
          order_status: d.order_status as OrderStatus,
          tracking_stage: d.tracking_stage as TrackingStage,
          created_at: d.created_at,
          updated_at: d.updated_at
        }));

        // Merge with existing local orders to prevent accidental loss
        const localOrders = LocalDatabaseService.getOrders();
        const incomingIds = new Set(formatted.map(o => o.id.trim().toUpperCase()));
        const localOnly = localOrders.filter(lo => !incomingIds.has(lo.id.trim().toUpperCase()));
        const merged = [...formatted, ...localOnly];

        onData(merged);
        LocalDatabaseService.saveOrders(merged);
      } else {
        // If remote database returns 0 rows, preserve existing local orders
        const localOrders = LocalDatabaseService.getOrders();
        if (localOrders && localOrders.length > 0) {
          onData(localOrders);
        }
      }
    };

    fetchOrders();

    const channel = client
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  // Helper to validate UUID strings
  private static isValidUuid(val: string | null | undefined): boolean {
    if (!val) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
  }

  // ==========================================
  // WRITES & MUTATIONS
  // ==========================================

  static async saveProduct(product: Product): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      // Find valid Supabase category UUID if available
      let resolvedCategoryId: string | null = null;
      if (this.isValidUuid(product.category_id)) {
        resolvedCategoryId = product.category_id;
      } else if (product.category_id) {
        // Look up category in Supabase by slug or name
        const { data: matchedCat } = await supabase
          .from('categories')
          .select('id')
          .or(`slug.eq.${product.category_id},name.eq.${product.category_id}`)
          .maybeSingle();

        if (matchedCat?.id && this.isValidUuid(matchedCat.id)) {
          resolvedCategoryId = matchedCat.id;
        }
      }

      const payload = {
        name: product.name,
        description: product.description,
        price: product.price,
        cost_price: Math.round(product.price * 0.6),
        landed_cost: Math.round(product.price * 0.65),
        discount_price: product.discount_price || null,
        stock_quantity: product.stock,
        category_id: resolvedCategoryId,
        image_url: product.main_image,
        additional_images: product.images || [],
        sku: product.sku,
        sizes: product.sizes || [],
        colors: product.colors || [],
        gender: product.gender,
        slug: product.slug,
        variants: product.variants || [],
        is_active: product.status === 'active',
        is_featured: product.is_featured,
        is_new_arrival: product.is_new_arrival
      };

      // Check if product exists by sku or id (if id is a valid UUID)
      let existingId: string | null = null;
      if (product.sku) {
        const { data: existingBySku } = await supabase
          .from('products')
          .select('id')
          .eq('sku', product.sku)
          .maybeSingle();
        if (existingBySku?.id) existingId = existingBySku.id;
      }

      if (!existingId && this.isValidUuid(product.id)) {
        const { data: existingById } = await supabase
          .from('products')
          .select('id')
          .eq('id', product.id)
          .maybeSingle();
        if (existingById?.id) existingId = existingById.id;
      }

      if (existingId) {
        await supabase.from('products').update(payload).eq('id', existingId);
      } else {
        // Insert new product. If product.id is a valid UUID, include it; otherwise let gen_random_uuid() generate it.
        const insertData = this.isValidUuid(product.id)
          ? { id: product.id, ...payload }
          : payload;

        await supabase.from('products').insert(insertData);
      }
    } catch (err) {
      console.warn('Supabase saveProduct sync notice:', err);
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('products').delete().eq('id', productId);
  }

  static async saveCategory(category: Category): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    const payload = {
      name: category.name,
      description: category.description,
      image_url: category.image_url,
      slug: category.slug,
      display_order: category.display_order,
      is_active: true
    };
    await supabase.from('categories').upsert({ id: category.id, ...payload });
  }

  static async deleteCategory(categoryId: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('categories').delete().eq('id', categoryId);
  }

  static async createOrder(order: Order): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;

    // Helper UUID generator
    const generateUuid = () => {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    const customerId = generateUuid();
    const orderUuid = this.isValidUuid(order.id) ? order.id : generateUuid();

    // 1. Create or get customer (insert with known UUID to avoid needing SELECT permission)
    try {
      await supabase
        .from('customers')
        .insert({
          id: customerId,
          full_name: order.customer.full_name || 'Customer',
          phone: order.customer.phone_number || '',
          whatsapp_number: order.customer.whatsapp_number || order.customer.phone_number || '',
          email: order.customer.email || null,
          delivery_address: order.customer.delivery_address || '',
          city: order.customer.city || '',
          state: order.customer.state || 'Nigeria'
        });
    } catch (custErr) {
      console.warn('Customer insert notice:', custErr);
    }

    // 2. Insert order
    const orderNumber = order.id || `ORD-${Date.now()}`;
    const cleanAddress = `${order.customer.delivery_address || ''}, ${order.customer.city || ''}, ${order.customer.state || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Customer Delivery Address';

    const { error: ordErr } = await supabase.from('orders').insert({
      id: orderUuid,
      order_number: orderNumber,
      customer_id: customerId,
      subtotal: Number(order.subtotal) || 0,
      delivery_fee: Number(order.delivery_fee) || 0,
      total_amount: Number(order.total_amount) || 0,
      payment_status: order.payment_status || 'Awaiting Confirmation',
      order_status: order.order_status || 'Pending',
      payment_method: 'OPAY_TRANSFER',
      delivery_address: cleanAddress,
      tracking_stage: order.tracking_stage || 'SELLER CONFIRMED'
    });

    if (ordErr) {
      console.warn('Supabase orders insert notice:', ordErr);
    }

    // 3. Insert order items
    if (order.items && order.items.length > 0) {
      const itemsPayload = order.items.map(it => ({
        order_id: orderUuid,
        product_id: this.isValidUuid(it.product_id) ? it.product_id : null,
        product_name: it.product_name,
        product_image: it.product_image || null,
        selected_size: it.selected_size || null,
        selected_color: it.selected_color || null,
        quantity: Math.max(1, Number(it.quantity) || 1),
        unit_price: Number(it.unit_price) || 0,
        unit_cost: Math.round((Number(it.unit_price) || 0) * 0.6),
        subtotal: Number(it.subtotal) || 0
      }));
      const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
      if (itemsErr) {
        console.warn('Supabase order_items insert notice:', itemsErr);
      }
    }
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    if (this.isValidUuid(orderId)) {
      await supabase.from('orders').update({ order_status: status }).eq('id', orderId);
    } else {
      await supabase.from('orders').update({ order_status: status }).eq('order_number', orderId);
    }
  }

  static async updatePaymentStatus(orderId: string, status: PaymentStatus, trackingStage?: TrackingStage): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    const payload: any = { payment_status: status };
    if (trackingStage) payload.tracking_stage = trackingStage;
    if (this.isValidUuid(orderId)) {
      await supabase.from('orders').update(payload).eq('id', orderId);
    } else {
      await supabase.from('orders').update(payload).eq('order_number', orderId);
    }
  }

  static async updateOrderTrackingStage(orderId: string, stage: TrackingStage, orderStatus?: OrderStatus): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    const payload: any = { tracking_stage: stage };
    if (orderStatus) payload.order_status = orderStatus;
    if (this.isValidUuid(orderId)) {
      await supabase.from('orders').update(payload).eq('id', orderId);
    } else {
      await supabase.from('orders').update(payload).eq('order_number', orderId);
    }
  }

  static async saveSettings(settings: SiteSettings): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('site_settings').upsert({
      id: 'primary_settings',
      business_name: settings.business_name,
      phone_number: settings.phone_number,
      secondary_phone: settings.secondary_phone,
      email: settings.email,
      whatsapp_number: settings.whatsapp_number,
      whatsapp_destination: settings.whatsapp_destination,
      payment_provider: settings.payment_provider,
      account_name: settings.account_name,
      account_number: settings.account_number,
      default_delivery_fee: settings.default_delivery_fee,
      currency_symbol: settings.currency_symbol,
      hero_background: settings.hero_background || 'royal_emerald',
      background_theme: settings.background_theme || 'white',
      announcement_banner: settings.announcement_banner
    });
  }

  /**
   * Fetches Executive Reporting Analytics calculated in PostgreSQL
   */
  static async getAnalytics(): Promise<any> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase.rpc('get_dashboard_analytics');
      if (error) {
        console.warn('get_dashboard_analytics RPC notice:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Analytics RPC exception:', err);
      return null;
    }
  }
}
