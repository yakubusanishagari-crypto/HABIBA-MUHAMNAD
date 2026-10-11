import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from './firebase';
import { Category, Subcategory, Product, Order, ContactMessage, SiteSettings, OrderStatus, PaymentStatus, TrackingStage } from '../types';
import { INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';
import { LocalDatabaseService } from './supabase';

export class FirebaseDatabaseService {
  /**
   * Initializes Firestore collections with initial seed data if empty
   */
  static async seedInitialDataIfEmpty(): Promise<void> {
    try {
      // 1. Site Settings
      const settingsDocRef = doc(db, 'site_settings', 'primary_settings');
      const settingsSnap = await getDoc(settingsDocRef);
      if (!settingsSnap.exists()) {
        await setDoc(settingsDocRef, INITIAL_SETTINGS);
      }

      // 2. Categories
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      if (categoriesSnap.empty) {
        for (const cat of INITIAL_CATEGORIES) {
          await setDoc(doc(db, 'categories', cat.id), cat);
        }
      }

      // 3. Subcategories
      const subcategoriesSnap = await getDocs(collection(db, 'subcategories'));
      if (subcategoriesSnap.empty) {
        for (const sub of INITIAL_SUBCATEGORIES) {
          await setDoc(doc(db, 'subcategories', sub.id), sub);
        }
      }

      // 4. Products
      const productsSnap = await getDocs(collection(db, 'products'));
      if (productsSnap.empty) {
        for (const prod of INITIAL_PRODUCTS) {
          await setDoc(doc(db, 'products', prod.id), prod);
        }
      }
    } catch (error) {
      console.warn('Initial seeding skipped or encountered error (local fallback available):', error);
    }
  }

  // ==========================================
  // REAL-TIME SUBSCRIPTIONS
  // ==========================================

  static subscribeToSettings(onData: (settings: SiteSettings) => void): () => void {
    const path = 'site_settings';
    const settingsDocRef = doc(db, path, 'primary_settings');
    return onSnapshot(
      settingsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings;
          const savedTheme = localStorage.getItem('habeevat_background_theme') as any;
          const savedHeroBg = localStorage.getItem('habeevat_hero_background') as any;
          const mergedSettings: SiteSettings = {
            ...data,
            background_theme: (data.background_theme as any) || savedTheme || 'white',
            hero_background: (data.hero_background as any) || savedHeroBg || 'royal_emerald'
          };
          onData(mergedSettings);
          LocalDatabaseService.saveSettings(mergedSettings);
        }
      },
      (error) => {
        console.warn('Settings subscription notice:', error);
      }
    );
  }

  static subscribeToCategories(onData: (categories: Category[]) => void): () => void {
    const path = 'categories';
    const collRef = collection(db, path);
    return onSnapshot(
      collRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Category[] = [];
          snapshot.forEach((d) => items.push(d.data() as Category));
          items.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
          onData(items);
          LocalDatabaseService.saveCategories(items);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  }

  static subscribeToSubcategories(onData: (subcategories: Subcategory[]) => void): () => void {
    const path = 'subcategories';
    const collRef = collection(db, path);
    return onSnapshot(
      collRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Subcategory[] = [];
          snapshot.forEach((d) => items.push(d.data() as Subcategory));
          onData(items);
          LocalDatabaseService.saveSubcategories(items);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  }

  static subscribeToProducts(onData: (products: Product[]) => void): () => void {
    const path = 'products';
    const collRef = collection(db, path);
    return onSnapshot(
      collRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((d) => items.push(d.data() as Product));
          onData(items);
          LocalDatabaseService.saveProducts(items);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  }

  static subscribeToOrders(onData: (orders: Order[]) => void): () => void {
    const path = 'orders';
    const collRef = collection(db, path);
    return onSnapshot(
      collRef,
      (snapshot) => {
        const items: Order[] = [];
        snapshot.forEach((d) => items.push(d.data() as Order));
        items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        onData(items);
        LocalDatabaseService.saveOrders(items);
      },
      (error) => {
        // Non-admin might get permission denied when querying orders list; handled gracefully
        console.warn('Orders list subscription notice:', error);
      }
    );
  }

  static subscribeToContactMessages(onData: (messages: ContactMessage[]) => void): () => void {
    const path = 'contact_messages';
    const collRef = collection(db, path);
    return onSnapshot(
      collRef,
      (snapshot) => {
        const items: ContactMessage[] = [];
        snapshot.forEach((d) => items.push(d.data() as ContactMessage));
        items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        onData(items);
        LocalDatabaseService.saveMessages(items);
      },
      (error) => {
        console.warn('Contact messages subscription notice:', error);
      }
    );
  }

  // ==========================================
  // WRITES & MUTATIONS
  // ==========================================

  static async saveProduct(product: Product): Promise<void> {
    const path = 'products';
    try {
      await setDoc(doc(db, path, product.id), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    const path = 'products';
    try {
      await deleteDoc(doc(db, path, productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  static async saveCategory(category: Category): Promise<void> {
    const path = 'categories';
    try {
      await setDoc(doc(db, path, category.id), category);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async deleteCategory(categoryId: string): Promise<void> {
    const path = 'categories';
    try {
      await deleteDoc(doc(db, path, categoryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  static async saveSubcategory(subcategory: Subcategory): Promise<void> {
    const path = 'subcategories';
    try {
      await setDoc(doc(db, path, subcategory.id), subcategory);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async deleteSubcategory(subcategoryId: string): Promise<void> {
    const path = 'subcategories';
    try {
      await deleteDoc(doc(db, path, subcategoryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  static async createOrder(order: Order): Promise<void> {
    const path = 'orders';
    try {
      await setDoc(doc(db, path, order.id), order);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const path = 'orders';
    try {
      await updateDoc(doc(db, path, orderId), {
        order_status: status,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  static async updatePaymentStatus(orderId: string, status: PaymentStatus, trackingStage?: TrackingStage): Promise<void> {
    const path = 'orders';
    try {
      const updateData: Record<string, any> = {
        payment_status: status,
        updated_at: new Date().toISOString()
      };
      if (trackingStage) {
        updateData.tracking_stage = trackingStage;
      }
      await updateDoc(doc(db, path, orderId), updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  static async updateOrderTrackingStage(orderId: string, stage: TrackingStage, nextOrderStatus: OrderStatus): Promise<void> {
    const path = 'orders';
    try {
      await updateDoc(doc(db, path, orderId), {
        tracking_stage: stage,
        tracking_updated_at: new Date().toISOString(),
        order_status: nextOrderStatus,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  static async updateSettings(settings: SiteSettings): Promise<void> {
    const path = 'site_settings';
    try {
      await setDoc(doc(db, path, 'primary_settings'), settings, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async submitContactMessage(message: ContactMessage): Promise<void> {
    const path = 'contact_messages';
    try {
      await setDoc(doc(db, path, message.id), message);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  static async markMessageRead(id: string): Promise<void> {
    const path = 'contact_messages';
    try {
      await updateDoc(doc(db, path, id), { is_read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
}
