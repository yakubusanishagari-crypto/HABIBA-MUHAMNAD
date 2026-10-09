import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  Subcategory,
  Product,
  CartItem,
  Order,
  CustomerInfo,
  ContactMessage,
  SiteSettings,
  PaymentStatus,
  OrderStatus,
  Language,
  TrackingStage
} from '../types';
import { LocalDatabaseService, isSupabaseConfigured, supabase } from '../lib/supabase';
import { FirebaseDatabaseService } from '../lib/firebaseDatabase';
import { testConnection } from '../lib/firebase';
import { TRANSLATIONS } from '../utils/translations';

interface ShopContextType {
  // Multilingual & RTL
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof TRANSLATIONS)['en'];
  dir: 'ltr' | 'rtl';

  // Products & Categories
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
  settings: SiteSettings;
  orders: Order[];
  contactMessages: ContactMessage[];
  loading: boolean;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => { success: boolean; message: string };
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;

  // Orders
  createOrder: (customer: CustomerInfo) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<boolean>;
  updateOrderTrackingStage: (orderId: string, stage: TrackingStage) => Promise<boolean>;

  // Product & Inventory Management
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<Product>;
  updateProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  updateInventory: (productId: string, newStock: number) => Promise<boolean>;

  // Category Management
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
  addSubcategory: (subcategory: Omit<Subcategory, 'id'>) => Promise<Subcategory>;
  deleteSubcategory: (subcategoryId: string) => Promise<boolean>;

  // Settings
  updateSettings: (newSettings: SiteSettings) => Promise<boolean>;

  // Contact
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>) => Promise<boolean>;
  markMessageRead: (id: string) => Promise<void>;

  // Admin Auth
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Notification Toast
  toastMessage: { text: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const ADMIN_PASSWORDS = ['habeebah2026', 'admin123', 'admin@habeevat'];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(LocalDatabaseService.getSettings());
  const [orders, setOrders] = useState<Order[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('habeevat_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('habeevat_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('habeevat_language');
      if (saved === 'ha' || saved === 'ar' || saved === 'en') return saved;
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('habeevat_language', newLang);
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    } catch (e) {
      console.error('Error saving language', e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const dir: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('habeevat_is_admin') === 'true';
    } catch {
      return false;
    }
  });
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Initialize data and real-time Firestore listeners
  useEffect(() => {
    // Test connection on boot per Firebase skill guidelines
    testConnection().catch(() => {});

    // Initial local cache population for instantaneous render
    const loadedSettings = LocalDatabaseService.getSettings();
    const loadedCategories = LocalDatabaseService.getCategories();
    const loadedSubcategories = LocalDatabaseService.getSubcategories();
    const loadedProducts = LocalDatabaseService.getProducts();
    const loadedOrders = LocalDatabaseService.getOrders();
    const loadedMessages = LocalDatabaseService.getMessages();

    setSettings(loadedSettings);
    setCategories(loadedCategories);
    setSubcategories(loadedSubcategories);
    setProducts(loadedProducts);
    setOrders(loadedOrders);
    setContactMessages(loadedMessages);
    setLoading(false);

    // Seed Firestore collections if empty
    FirebaseDatabaseService.seedInitialDataIfEmpty().catch(err => {
      console.warn('Initial Firebase seeding warning:', err);
    });

    // Real-time Firestore subscriptions
    const unsubSettings = FirebaseDatabaseService.subscribeToSettings(setSettings);
    const unsubCategories = FirebaseDatabaseService.subscribeToCategories(setCategories);
    const unsubSubcategories = FirebaseDatabaseService.subscribeToSubcategories(setSubcategories);
    const unsubProducts = FirebaseDatabaseService.subscribeToProducts(setProducts);
    const unsubOrders = FirebaseDatabaseService.subscribeToOrders(setOrders);
    const unsubMessages = FirebaseDatabaseService.subscribeToContactMessages(setContactMessages);

    return () => {
      unsubSettings();
      unsubCategories();
      unsubSubcategories();
      unsubProducts();
      unsubOrders();
      unsubMessages();
    };
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('habeevat_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  // Save wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('habeevat_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Item removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Item saved to wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Cart calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? (settings.default_delivery_fee || 2500) : 0;
  const cartTotal = cartSubtotal + deliveryFee;

  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    // Check available stock
    const availableStock = product.stock;
    if (availableStock <= 0) {
      showToast('This product is currently out of stock.', 'error');
      return { success: false, message: 'Out of stock' };
    }

    const cartItemId = `${product.id}-${size || 'default'}-${color || 'default'}`;
    const existingIndex = cart.findIndex(item => item.id === cartItemId);

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty + quantity > availableStock) {
        showToast(`Only ${availableStock} units available in stock.`, 'error');
        return { success: false, message: 'Insufficient stock' };
      }
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      if (quantity > availableStock) {
        showToast(`Only ${availableStock} units available in stock.`, 'error');
        return { success: false, message: 'Insufficient stock' };
      }
      const effectivePrice = product.discount_price && product.discount_price > 0 ? product.discount_price : product.price;
      const newItem: CartItem = {
        id: cartItemId,
        product_id: product.id,
        product,
        selected_size: size,
        selected_color: color,
        quantity,
        price: effectivePrice
      };
      setCart([...cart, newItem]);
    }

    showToast(`Added "${product.name}" to cart!`, 'success');
    return { success: true, message: 'Added to cart' };
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart(prev => {
      return prev.map(item => {
        if (item.id === cartItemId) {
          const maxStock = item.product.stock;
          const validQuantity = Math.min(quantity, maxStock);
          if (validQuantity < quantity) {
            showToast(`Maximum stock limit reached (${maxStock} units).`, 'info');
          }
          return { ...item, quantity: validQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Create Order
  const createOrder = async (customer: CustomerInfo): Promise<Order> => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${dateStr}-${randomSuffix}`;

    const orderItems = cart.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.product.name,
      product_image: item.product.main_image,
      selected_size: item.selected_size,
      selected_color: item.selected_color,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity
    }));

    const newOrder: Order = {
      id: orderId,
      customer,
      items: orderItems,
      subtotal: cartSubtotal,
      delivery_fee: deliveryFee,
      total_amount: cartTotal,
      payment_method: 'OPAY_TRANSFER',
      payment_status: 'Awaiting Confirmation',
      order_status: 'Pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save in local storage engine
    LocalDatabaseService.addOrder(newOrder);

    // Sync to Firebase Firestore asynchronously
    FirebaseDatabaseService.createOrder(newOrder).catch(err => {
      console.warn('Firebase createOrder sync notice:', err);
    });

    // Refresh products state with updated stock
    const updatedProducts = LocalDatabaseService.getProducts();
    setProducts(updatedProducts);
    setOrders(prev => [newOrder, ...prev]);

    // Clear cart after order placement
    clearCart();

    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(o => o.id.trim().toUpperCase() === orderId.trim().toUpperCase());
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    const success = LocalDatabaseService.updateOrderStatus(orderId, status);
    if (success) {
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, order_status: status, updated_at: new Date().toISOString() } : o))
      );
      FirebaseDatabaseService.updateOrderStatus(orderId, status).catch(err => {
        console.warn('Firebase updateOrderStatus sync notice:', err);
      });
      showToast(`Order status updated to "${status}"`, 'success');
      return true;
    }
    return false;
  };

  const updatePaymentStatus = async (orderId: string, status: PaymentStatus): Promise<boolean> => {
    const success = LocalDatabaseService.updatePaymentStatus(orderId, status);
    if (success) {
      const order = orders.find(o => o.id === orderId);
      const tracking_stage = status === 'Confirmed' && (!order || !order.tracking_stage) ? 'SELLER CONFIRMED' : order?.tracking_stage;
      setOrders(prev =>
        prev.map(o => {
          if (o.id === orderId) {
            return { ...o, payment_status: status, tracking_stage, updated_at: new Date().toISOString() };
          }
          return o;
        })
      );
      FirebaseDatabaseService.updatePaymentStatus(orderId, status, tracking_stage).catch(err => {
        console.warn('Firebase updatePaymentStatus sync notice:', err);
      });
      showToast(`Payment status updated to "${status}"`, 'success');
      return true;
    }
    return false;
  };

  const updateOrderTrackingStage = async (orderId: string, stage: TrackingStage): Promise<boolean> => {
    const success = LocalDatabaseService.updateOrderTrackingStage(orderId, stage);
    if (success) {
      let nextOrderStatus: OrderStatus = 'Processing';
      if (stage === 'DELIVERED') nextOrderStatus = 'Delivered';
      else if (stage === 'IN TRANSIT' || stage === 'OUT FOR DELIVERY' || stage === 'HANDED TO LOGISTICS') nextOrderStatus = 'Shipped';
      else if (stage === 'PACKAGING') nextOrderStatus = 'Processing';

      setOrders(prev =>
        prev.map(o => {
          if (o.id === orderId) {
            return {
              ...o,
              tracking_stage: stage,
              tracking_updated_at: new Date().toISOString(),
              order_status: nextOrderStatus,
              updated_at: new Date().toISOString()
            };
          }
          return o;
        })
      );
      FirebaseDatabaseService.updateOrderTrackingStage(orderId, stage, nextOrderStatus).catch(err => {
        console.warn('Firebase updateOrderTrackingStage sync notice:', err);
      });
      showToast(`Tracking stage updated to "${stage}"`, 'success');
      return true;
    }
    return false;
  };

  // Product CRUD
  const addProduct = async (prodData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const current = LocalDatabaseService.getProducts();
    const updated = [newProduct, ...current];
    LocalDatabaseService.saveProducts(updated);
    setProducts(updated);
    FirebaseDatabaseService.saveProduct(newProduct).catch(err => {
      console.warn('Firebase saveProduct sync notice:', err);
    });
    showToast(`Product "${newProduct.name}" created successfully!`, 'success');
    return newProduct;
  };

  const updateProduct = async (product: Product): Promise<boolean> => {
    const current = LocalDatabaseService.getProducts();
    const idx = current.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      const updatedProduct = { ...product, updated_at: new Date().toISOString() };
      current[idx] = updatedProduct;
      LocalDatabaseService.saveProducts(current);
      setProducts([...current]);
      FirebaseDatabaseService.saveProduct(updatedProduct).catch(err => {
        console.warn('Firebase updateProduct sync notice:', err);
      });
      showToast(`Product "${product.name}" updated successfully!`, 'success');
      return true;
    }
    return false;
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    const current = LocalDatabaseService.getProducts();
    const filtered = current.filter(p => p.id !== productId);
    LocalDatabaseService.saveProducts(filtered);
    setProducts(filtered);
    FirebaseDatabaseService.deleteProduct(productId).catch(err => {
      console.warn('Firebase deleteProduct sync notice:', err);
    });
    showToast('Product deleted from inventory', 'info');
    return true;
  };

  const updateInventory = async (productId: string, newStock: number): Promise<boolean> => {
    const current = LocalDatabaseService.getProducts();
    const product = current.find(p => p.id === productId);
    if (product) {
      product.stock = Math.max(0, newStock);
      product.updated_at = new Date().toISOString();
      LocalDatabaseService.saveProducts(current);
      setProducts([...current]);
      FirebaseDatabaseService.saveProduct(product).catch(err => {
        console.warn('Firebase updateInventory sync notice:', err);
      });
      showToast(`Stock updated to ${product.stock}`, 'success');
      return true;
    }
    return false;
  };

  // Category CRUD
  const addCategory = async (catData: Omit<Category, 'id'>): Promise<Category> => {
    const newId = `cat-${Date.now()}`;
    const newCat: Category = { ...catData, id: newId };
    const current = LocalDatabaseService.getCategories();
    const updated = [...current, newCat];
    LocalDatabaseService.saveCategories(updated);
    setCategories(updated);
    FirebaseDatabaseService.saveCategory(newCat).catch(err => {
      console.warn('Firebase saveCategory sync notice:', err);
    });
    showToast(`Category "${newCat.name}" added`, 'success');
    return newCat;
  };

  const updateCategory = async (category: Category): Promise<boolean> => {
    const current = LocalDatabaseService.getCategories();
    const idx = current.findIndex(c => c.id === category.id);
    if (idx !== -1) {
      current[idx] = category;
      LocalDatabaseService.saveCategories(current);
      setCategories([...current]);
      FirebaseDatabaseService.saveCategory(category).catch(err => {
        console.warn('Firebase updateCategory sync notice:', err);
      });
      showToast(`Category "${category.name}" updated`, 'success');
      return true;
    }
    return false;
  };

  const deleteCategory = async (categoryId: string): Promise<boolean> => {
    const current = LocalDatabaseService.getCategories();
    const updated = current.filter(c => c.id !== categoryId);
    LocalDatabaseService.saveCategories(updated);
    setCategories(updated);
    FirebaseDatabaseService.deleteCategory(categoryId).catch(err => {
      console.warn('Firebase deleteCategory sync notice:', err);
    });
    showToast('Category deleted', 'info');
    return true;
  };

  const addSubcategory = async (subData: Omit<Subcategory, 'id'>): Promise<Subcategory> => {
    const newId = `sub-${Date.now()}`;
    const newSub: Subcategory = { ...subData, id: newId };
    const current = LocalDatabaseService.getSubcategories();
    const updated = [...current, newSub];
    LocalDatabaseService.saveSubcategories(updated);
    setSubcategories(updated);
    FirebaseDatabaseService.saveSubcategory(newSub).catch(err => {
      console.warn('Firebase saveSubcategory sync notice:', err);
    });
    showToast(`Subcategory "${newSub.name}" added`, 'success');
    return newSub;
  };

  const deleteSubcategory = async (subcategoryId: string): Promise<boolean> => {
    const current = LocalDatabaseService.getSubcategories();
    const updated = current.filter(s => s.id !== subcategoryId);
    LocalDatabaseService.saveSubcategories(updated);
    setSubcategories(updated);
    FirebaseDatabaseService.deleteSubcategory(subcategoryId).catch(err => {
      console.warn('Firebase deleteSubcategory sync notice:', err);
    });
    showToast('Subcategory removed', 'info');
    return true;
  };

  // Settings
  const updateSettings = async (newSettings: SiteSettings): Promise<boolean> => {
    LocalDatabaseService.saveSettings(newSettings);
    setSettings(newSettings);
    FirebaseDatabaseService.updateSettings(newSettings).catch(err => {
      console.warn('Firebase updateSettings sync notice:', err);
    });
    showToast('Store settings updated successfully', 'success');
    return true;
  };

  // Contact
  const submitContactMessage = async (msg: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<boolean> => {
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString()
    };
    LocalDatabaseService.addMessage(newMessage);
    setContactMessages(prev => [newMessage, ...prev]);
    FirebaseDatabaseService.submitContactMessage(newMessage).catch(err => {
      console.warn('Firebase submitContactMessage sync notice:', err);
    });
    showToast('Your message has been sent successfully. We will reply shortly!', 'success');
    return true;
  };

  const markMessageRead = async (id: string) => {
    LocalDatabaseService.markMessageRead(id);
    setContactMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, is_read: true } : m))
    );
    FirebaseDatabaseService.markMessageRead(id).catch(err => {
      console.warn('Firebase markMessageRead sync notice:', err);
    });
  };

  // Admin Auth
  const loginAdmin = (password: string): boolean => {
    if (ADMIN_PASSWORDS.includes(password.trim())) {
      setIsAdmin(true);
      sessionStorage.setItem('habeevat_is_admin', 'true');
      showToast('Admin logged in successfully', 'success');
      return true;
    }
    showToast('Invalid admin credentials', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('habeevat_is_admin');
    showToast('Admin logged out', 'info');
  };

  return (
    <ShopContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dir,
        products,
        categories,
        subcategories,
        settings,
        orders,
        contactMessages,
        loading,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        createOrder,
        getOrderById,
        updateOrderStatus,
        updatePaymentStatus,
        updateOrderTrackingStage,
        addProduct,
        updateProduct,
        deleteProduct,
        updateInventory,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        deleteSubcategory,
        updateSettings,
        submitContactMessage,
        markMessageRead,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        toastMessage,
        showToast,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
