import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { PaymentModal } from './components/PaymentModal';
import { QuickViewModal } from './components/QuickViewModal';
import { WishlistDrawer } from './components/WishlistDrawer';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderLookupPage } from './pages/OrderLookupPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPages } from './pages/LegalPages';
import { AdminDashboard } from './pages/AdminDashboard';
import { Product, Order } from './types';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const parseViewFromLocation = (): string => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '').replace(/\/+$/, '');

  // Admin portal routes (including direct access /admin, /admin/login, /admin/dashboard, /login)
  if (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    path === '/login' ||
    path === '/dashboard' ||
    hash === 'admin' ||
    hash.startsWith('admin/') ||
    hash === 'login'
  ) {
    return 'admin';
  }

  if (path === '/checkout' || hash === 'checkout') return 'checkout';
  if (path === '/products' || hash === 'products') return 'products';
  if (path === '/women' || hash === 'women') return 'women';
  if (path === '/kids' || hash === 'kids') return 'kids';
  if (path === '/new-arrivals' || hash === 'new-arrivals') return 'new-arrivals';
  if (path === '/about' || hash === 'about') return 'about';
  if (path === '/contact' || hash === 'contact') return 'contact';
  if (path === '/order-lookup' || hash === 'order-lookup') return 'order-lookup';
  if (path === '/privacy' || hash === 'privacy') return 'privacy';
  if (path === '/terms' || hash === 'terms') return 'terms';
  if (path === '/returns' || hash === 'returns') return 'returns';
  if (path === '/shipping' || hash === 'shipping') return 'shipping';

  return 'home';
};

const AppContent: React.FC = () => {
  const { settings, toastMessage, quickViewProduct, setQuickViewProduct } = useShop();

  const [currentView, setCurrentView] = useState<string>(() => parseViewFromLocation());

  // URL listener to support direct access, back/forward navigation, and page refresh on Vercel
  React.useEffect(() => {
    const handleUrlSync = () => {
      const detected = parseViewFromLocation();
      setCurrentView(detected);
    };

    window.addEventListener('popstate', handleUrlSync);
    window.addEventListener('hashchange', handleUrlSync);
    return () => {
      window.removeEventListener('popstate', handleUrlSync);
      window.removeEventListener('hashchange', handleUrlSync);
    };
  }, []);

  // Synchronize browser URL bar when currentView changes
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';

    if (currentView === 'admin') {
      if (!path.startsWith('/admin') && path !== '/login') {
        window.history.pushState(null, '', '/admin');
      }
    } else if (currentView === 'home') {
      if (path.startsWith('/admin') || path === '/login') {
        window.history.pushState(null, '', '/');
      }
    }
  }, [currentView]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const targetPath = view === 'home' ? '/' : `/${view}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitAdmin = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      if (window.location.hash.startsWith('#/admin')) {
        window.location.hash = '';
      }
    }
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Completed order for Payment Modal
  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [lookupOrderId, setLookupOrderId] = useState<string>('');

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (order: Order) => {
    setActivePaymentOrder(order);
    setIsPaymentModalOpen(true);
  };

  const handleViewOrderInvoice = (orderId: string) => {
    setLookupOrderId(orderId);
    setIsPaymentModalOpen(false);
    setCurrentView('order-lookup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const themeBackgroundClass = React.useMemo(() => {
    const activeTheme = settings.background_theme || (typeof window !== 'undefined' ? localStorage.getItem('habeevat_background_theme') as any : null) || 'white';
    switch (activeTheme) {
      case 'amber':
        return 'bg-amber-50/80 text-slate-900';
      case 'emerald':
        return 'bg-emerald-50/70 text-slate-900';
      case 'sapphire':
        return 'bg-slate-950 text-slate-100';
      case 'rose':
        return 'bg-rose-50/70 text-slate-900';
      case 'white':
      default:
        return 'bg-white text-slate-900';
    }
  }, [settings.background_theme]);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const activeTheme = settings.background_theme || (localStorage.getItem('habeevat_background_theme') as any) || 'white';
      const bgHexMap: Record<string, string> = {
        white: '#ffffff',
        amber: '#fffbeb',
        emerald: '#ecfdf5',
        sapphire: '#020617',
        rose: '#fff1f2'
      };
      document.body.style.backgroundColor = bgHexMap[activeTheme] || '#ffffff';
    }
  }, [settings.background_theme]);

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col ${themeBackgroundClass} selection:bg-emerald-700 selection:text-white transition-colors duration-300`}>
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 bg-white border-slate-200 text-slate-800 ring-1 ring-slate-900/5">
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Luxury Header */}
      {currentView !== 'admin' && (
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          setSelectedCategory={setSelectedCategory}
          setSelectedSubcategory={setSelectedSubcategory}
          setSelectedGender={setSelectedGender}
          openSearch={() => setIsSearchOpen(true)}
          openWishlist={() => setIsWishlistOpen(true)}
        />
      )}

      {/* Main Routing Views */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {currentView === 'home' && (
          <HomePage
            onViewProduct={handleViewProduct}
            onNavigate={setCurrentView}
            onSelectCategory={(catId, gender) => {
              setSelectedCategory(catId);
              if (gender) setSelectedGender(gender);
              else setSelectedGender('all');
              setCurrentView('products');
            }}
          />
        )}

        {currentView === 'products' && (
          <ProductsPage
            onViewProduct={handleViewProduct}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            pageTitle="All Products"
            pageSubtitle="Explore our full collection across fashion, footwear, accessories, beauty and home."
          />
        )}

        {currentView === 'women' && (
          <ProductsPage
            onViewProduct={handleViewProduct}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedGender="Women"
            setSelectedGender={setSelectedGender}
            pageTitle="Women Collection"
            pageSubtitle="Elegant dresses, contemporary clothing, shoes, sandals, handbags, cosmetics and fine jewelry."
          />
        )}

        {currentView === 'kids' && (
          <ProductsPage
            onViewProduct={handleViewProduct}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedGender="Kids"
            setSelectedGender={setSelectedGender}
            pageTitle="Kids Collection"
            pageSubtitle="Quality boys and girls clothing, trainers, sandals, bags and everyday outfits."
          />
        )}

        {currentView === 'new-arrivals' && (
          <ProductsPage
            onViewProduct={handleViewProduct}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            pageTitle="New Season Arrivals"
            pageSubtitle="Freshly curated styles and newest catalog additions just arrived."
            isNewArrivalOnly={true}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onShopNow={() => setCurrentView('products')}
            onContact={() => setCurrentView('contact')}
          />
        )}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setCurrentView('products')}
            onViewProduct={handleViewProduct}
            onBuyNow={() => setCurrentView('checkout')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToCart={() => setCurrentView('products')}
            onOrderCompleted={handleOrderCompleted}
          />
        )}

        {currentView === 'order-lookup' && (
          <OrderLookupPage
            initialOrderId={lookupOrderId}
            onNavigateHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'admin' && <AdminDashboard onExitToStore={handleExitAdmin} />}

        {currentView === 'privacy' && <LegalPages type="privacy" onNavigate={setCurrentView} />}
        {currentView === 'terms' && <LegalPages type="terms" onNavigate={setCurrentView} />}
        {currentView === 'returns' && <LegalPages type="returns" onNavigate={setCurrentView} />}
        {currentView === 'shipping' && <LegalPages type="shipping" onNavigate={setCurrentView} />}
      </main>

      {/* Footer (No payment account details) */}
      {currentView !== 'admin' && (
        <Footer
          setCurrentView={setCurrentView}
          setSelectedCategory={setSelectedCategory}
          setSelectedGender={setSelectedGender}
        />
      )}

      {/* Floating WhatsApp Action Button */}
      {currentView !== 'admin' && <FloatingWhatsApp />}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setCurrentView('checkout')}
        onContinueShopping={() => setCurrentView('products')}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onViewProduct={handleViewProduct}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onViewFullDetails={handleViewProduct}
          onProceedToCheckout={() => setCurrentView('checkout')}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleViewProduct}
        onSelectCategory={catId => {
          setSelectedCategory(catId);
          setSelectedSubcategory('');
          setSelectedGender('all');
          setCurrentView('products');
        }}
      />

      {/* OPAY Payment & WhatsApp Confirmation Modal (Order Created) */}
      {activePaymentOrder && (
        <PaymentModal
          order={activePaymentOrder}
          settings={settings}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onViewOrderDetails={handleViewOrderInvoice}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
