import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_SUBCATEGORIES } from '../data/initialData';
import { Category, Subcategory, Product, Order, ContactMessage, SiteSettings, PaymentStatus, OrderStatus, TrackingStage } from '../types';

/**
 * Notice: This project exclusively uses Firebase Firestore & Firebase Storage
 * for database persistence, media storage, and admin authentication.
 * Supabase has been cleanly decommissioned as requested.
 */
export const isSupabaseConfigured = false;
export const supabase = null;

// Storage keys for persistent store fallback cache
const STORAGE_KEYS = {
  SETTINGS: 'habeevat_store_settings',
  CATEGORIES: 'habeevat_categories',
  SUBCATEGORIES: 'habeevat_subcategories',
  PRODUCTS: 'habeevat_products',
  ORDERS: 'habeevat_orders',
  MESSAGES: 'habeevat_messages',
  ADMIN_SESSION: 'habeevat_admin_session',
};

// Client-side persistent fallback & live sync engine
export class LocalDatabaseService {
  static getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const savedTheme = localStorage.getItem('habeevat_background_theme') as any;
      const savedHeroBg = localStorage.getItem('habeevat_hero_background') as any;
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          background_theme: savedTheme || parsed.background_theme || INITIAL_SETTINGS.background_theme || 'white',
          hero_background: savedHeroBg || parsed.hero_background || INITIAL_SETTINGS.hero_background || 'royal_emerald'
        };
      } else if (savedTheme || savedHeroBg) {
        return {
          ...INITIAL_SETTINGS,
          background_theme: savedTheme || INITIAL_SETTINGS.background_theme || 'white',
          hero_background: savedHeroBg || INITIAL_SETTINGS.hero_background || 'royal_emerald'
        };
      }
    } catch (e) {
      console.warn('Error reading settings from storage', e);
    }
    this.saveSettings(INITIAL_SETTINGS);
    return INITIAL_SETTINGS;
  }

  static saveSettings(settings: SiteSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      if (settings.background_theme) {
        localStorage.setItem('habeevat_background_theme', settings.background_theme);
      }
      if (settings.hero_background) {
        localStorage.setItem('habeevat_hero_background', settings.hero_background);
      }
    } catch (e) {
      console.error('Error saving settings', e);
    }
  }

  static getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading categories from storage', e);
    }
    this.saveCategories(INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  }

  static saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories', e);
    }
  }

  static getSubcategories(): Subcategory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBCATEGORIES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading subcategories from storage', e);
    }
    this.saveSubcategories(INITIAL_SUBCATEGORIES);
    return INITIAL_SUBCATEGORIES;
  }

  static saveSubcategories(subcategories: Subcategory[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBCATEGORIES, JSON.stringify(subcategories));
    } catch (e) {
      console.error('Error saving subcategories', e);
    }
  }

  static getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading products from storage', e);
    }
    this.saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  static saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products', e);
    }
  }

  static getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading orders from storage', e);
    }
    return [];
  }

  static saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  }

  static addOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);

    // Also deduct stock for ordered items
    const products = this.getProducts();
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.product_id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        if (item.selected_size || item.selected_color) {
          const variant = prod.variants.find(
            v => (!item.selected_size || v.size === item.selected_size) &&
                 (!item.selected_color || v.color === item.selected_color)
          );
          if (variant) {
            variant.stock = Math.max(0, variant.stock - item.quantity);
          }
        }
      }
    });
    this.saveProducts(products);
  }

  static updateOrderStatus(orderId: string, orderStatus: OrderStatus): boolean {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].order_status = orderStatus;
      orders[idx].updated_at = new Date().toISOString();
      this.saveOrders(orders);
      return true;
    }
    return false;
  }

  static updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): boolean {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].payment_status = paymentStatus;
      // If confirmed and tracking stage not set yet, automatically initialize to 'SELLER CONFIRMED'
      if (paymentStatus === 'Confirmed' && !orders[idx].tracking_stage) {
        orders[idx].tracking_stage = 'SELLER CONFIRMED';
        orders[idx].tracking_updated_at = new Date().toISOString();
      }
      orders[idx].updated_at = new Date().toISOString();
      this.saveOrders(orders);
      return true;
    }
    return false;
  }

  static updateOrderTrackingStage(orderId: string, trackingStage: TrackingStage): boolean {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].tracking_stage = trackingStage;
      orders[idx].tracking_updated_at = new Date().toISOString();
      orders[idx].updated_at = new Date().toISOString();

      // Keep order_status in sync with logical tracking milestone
      if (trackingStage === 'DELIVERED') {
        orders[idx].order_status = 'Delivered';
      } else if (trackingStage === 'IN TRANSIT' || trackingStage === 'OUT FOR DELIVERY' || trackingStage === 'HANDED TO LOGISTICS') {
        orders[idx].order_status = 'Shipped';
      } else if (trackingStage === 'PACKAGING') {
        orders[idx].order_status = 'Processing';
      }

      this.saveOrders(orders);
      return true;
    }
    return false;
  }

  static getMessages(): ContactMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading messages', e);
    }
    return [];
  }

  static saveMessages(messages: ContactMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving messages', e);
    }
  }

  static addMessage(message: ContactMessage): void {
    const messages = this.getMessages();
    messages.unshift(message);
    this.saveMessages(messages);
  }

  static markMessageRead(id: string): void {
    const messages = this.getMessages();
    const msg = messages.find(m => m.id === id);
    if (msg) {
      msg.is_read = true;
      this.saveMessages(messages);
    }
  }

  static resetToDefaultData(): void {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SUBCATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    this.saveSettings(INITIAL_SETTINGS);
    this.saveCategories(INITIAL_CATEGORIES);
    this.saveSubcategories(INITIAL_SUBCATEGORIES);
    this.saveProducts(INITIAL_PRODUCTS);
  }
}
