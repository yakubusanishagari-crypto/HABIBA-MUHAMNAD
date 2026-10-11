import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Boxes,
  FolderTree,
  Mail,
  Settings as SettingsIcon,
  Database,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Save,
  MessageCircle,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronDown,
  Download,
  Palette,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Filter,
  Eye,
  EyeOff,
  Lock,
  Key,
  LogOut,
  Menu,
  X,
  Phone,
  Layout,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Send,
  Truck,
  CheckCircle2,
  CreditCard
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import {
  Product,
  Order,
  Category,
  Subcategory,
  PaymentStatus,
  OrderStatus,
  Gender,
  TrackingStage,
  BackgroundTheme,
  HeroBackgroundOption
} from '../types';
import { HERO_BACKGROUND_LIST, HERO_BACKGROUND_CONFIGS } from '../data/heroBackgrounds';
import { formatPrice, copyToClipboard } from '../utils/formatters';
import { downloadOrderReceiptPDF } from '../utils/pdfReceipt';
import { ProductImageUploader } from '../components/ProductImageUploader';
import { OFFICIAL_LOGO_URL, OFFICIAL_LOGO_REMOTE, testFirebaseStorageConnection } from '../utils/imageUpload';
import { signInWithGoogle, storage } from '../lib/firebase';

interface AdminDashboardProps {
  onExitToStore?: () => void;
}

type TabType =
  | 'overview'
  | 'products'
  | 'orders'
  | 'customers'
  | 'analytics'
  | 'inventory'
  | 'categories'
  | 'messages'
  | 'settings'
  | 'firebase';

const TRACKING_STEPS: TrackingStage[] = [
  'SELLER CONFIRMED',
  'PACKAGING',
  'HANDED TO LOGISTICS',
  'IN TRANSIT',
  'OUT FOR DELIVERY',
  'DELIVERED'
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitToStore }) => {
  const {
    products,
    categories,
    subcategories,
    orders,
    contactMessages,
    settings,
    isAdmin,
    loginAdmin,
    loginAdminWithGoogle,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    updateInventory,
    addCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    updateOrderStatus,
    updatePaymentStatus,
    updateOrderTrackingStage,
    updateSettings,
    updateBackgroundTheme,
    updateHeroBackground,
    updateAdminPassword,
    resetAdminPassword,
    markMessageRead,
    showToast
  } = useShop();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Hero Background preview state
  const [previewHeroBg, setPreviewHeroBg] = useState<HeroBackgroundOption>(
    settings.hero_background || 'royal_emerald'
  );
  const [isSavingHeroBg, setIsSavingHeroBg] = useState(false);

  // Security Form State
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Product modal & state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<{
    name: string;
    slug: string;
    description: string;
    price: number | '';
    discount_price: number | '';
    category_id: string;
    subcategory_id: string;
    gender: Gender;
    sku: string;
    stock: number | '';
    main_image: string;
    images: string[];
    sizes_text: string;
    colors_text: string;
    is_featured: boolean;
    is_new_arrival: boolean;
    status: 'active' | 'archived';
  }>({
    name: '',
    slug: '',
    description: '',
    price: '',
    discount_price: '',
    category_id: '',
    subcategory_id: '',
    gender: 'Women',
    sku: '',
    stock: 10,
    main_image: '',
    images: [] as string[],
    sizes_text: '',
    colors_text: '',
    is_featured: false,
    is_new_arrival: true,
    status: 'active' as 'active' | 'archived'
  });

  // Product Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productGenderFilter, setProductGenderFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState('all');

  // Order Filters & Search
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all');
  const [orderTrackingFilter, setOrderTrackingFilter] = useState('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Customer Search
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubCatId, setNewSubCatId] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({ ...settings });

  // Confirmation dialog modal state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // PDF generation state
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [rulesCopied, setRulesCopied] = useState(false);
  const [isTestingStorage, setIsTestingStorage] = useState(false);
  const [storageTestResult, setStorageTestResult] = useState<{
    success: boolean;
    message: string;
    bucket: string;
  } | null>(null);

  // Sync settings when loaded
  React.useEffect(() => {
    setSettingsForm({ ...settings });
    if (settings.hero_background) {
      setPreviewHeroBg(settings.hero_background);
    }
  }, [settings]);

  // Statistics Calculations (100% Real Database Calculations)
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      o => o.order_status === 'Pending' || o.order_status === 'Processing'
    ).length;
    const awaitingPayments = orders.filter(
      o => o.payment_status === 'Awaiting Confirmation' || o.payment_status === 'Payment Submitted'
    ).length;
    const confirmedOrders = orders.filter(o => o.payment_status === 'Confirmed');
    const totalSales = confirmedOrders.reduce((sum, o) => sum + o.total_amount, 0);

    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter(p => p.stock <= 0).length;

    // Unique customer records
    const customerMap = new Map<string, { email: string; name: string; phone: string; orders: number; total: number; lastOrder: string; city: string; state: string }>();

    orders.forEach(o => {
      const key = (o.customer.phone_number || o.customer.email || o.customer.full_name).toLowerCase().trim();
      const existing = customerMap.get(key);
      if (existing) {
        existing.orders += 1;
        existing.total += o.total_amount;
        if (new Date(o.created_at) > new Date(existing.lastOrder)) {
          existing.lastOrder = o.created_at;
        }
      } else {
        customerMap.set(key, {
          email: o.customer.email || '',
          name: o.customer.full_name,
          phone: o.customer.phone_number,
          orders: 1,
          total: o.total_amount,
          lastOrder: o.created_at,
          city: o.customer.city,
          state: o.customer.state
        });
      }
    });

    const uniqueCustomers = Array.from(customerMap.values());
    const averageOrderValue = confirmedOrders.length > 0 ? Math.round(totalSales / confirmedOrders.length) : 0;
    const inventoryTotalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock, 0);

    return {
      totalProducts: products.length,
      totalOrders,
      pendingOrders,
      awaitingPayments,
      confirmedPayments: confirmedOrders.length,
      totalSales,
      lowStock,
      outOfStock,
      uniqueCustomersCount: uniqueCustomers.length,
      uniqueCustomers,
      averageOrderValue,
      inventoryTotalValue,
      totalInventoryUnits
    };
  }, [orders, products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (productCategoryFilter !== 'all' && p.category_id !== productCategoryFilter) return false;
      if (productGenderFilter !== 'all' && p.gender !== productGenderFilter) return false;
      if (productStatusFilter !== 'all' && p.status !== productStatusFilter) return false;
      if (productStockFilter === 'in_stock' && p.stock <= 0) return false;
      if (productStockFilter === 'low_stock' && (p.stock <= 0 || p.stock > 5)) return false;
      if (productStockFilter === 'out_of_stock' && p.stock > 0) return false;

      if (productSearch.trim()) {
        const q = productSearch.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesCat = categories.find(c => c.id === p.category_id)?.name.toLowerCase().includes(q);
        return matchesName || matchesSku || matchesCat;
      }
      return true;
    });
  }, [products, productCategoryFilter, productGenderFilter, productStockFilter, productStatusFilter, productSearch, categories]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (orderPaymentFilter !== 'all' && order.payment_status !== orderPaymentFilter) return false;
      if (orderTrackingFilter !== 'all' && order.tracking_stage !== orderTrackingFilter) return false;

      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesName = order.customer.full_name.toLowerCase().includes(q);
        const matchesPhone = order.customer.phone_number.toLowerCase().includes(q);
        const matchesCity = order.customer.city.toLowerCase().includes(q);
        return matchesId || matchesName || matchesPhone || matchesCity;
      }
      return true;
    });
  }, [orders, orderPaymentFilter, orderTrackingFilter, orderSearchQuery]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    if (!customerSearchQuery.trim()) return stats.uniqueCustomers;
    const q = customerSearchQuery.toLowerCase().trim();
    return stats.uniqueCustomers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  }, [stats.uniqueCustomers, customerSearchQuery]);

  // Open Edit Product Modal
  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    const existingImages = p.images && p.images.length > 0 ? p.images : [p.main_image].filter(Boolean);
    setProductForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      discount_price: p.discount_price && p.discount_price > 0 ? p.discount_price : '',
      category_id: p.category_id,
      subcategory_id: p.subcategory_id || '',
      gender: p.gender,
      sku: p.sku,
      stock: p.stock,
      main_image: p.main_image,
      images: existingImages,
      sizes_text: (p.sizes || []).join(', '),
      colors_text: (p.colors || []).join(', '),
      is_featured: p.is_featured,
      is_new_arrival: p.is_new_arrival,
      status: p.status
    });
    setIsProductModalOpen(true);
  };

  // Open Add Product Modal
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    const defaultCat = categories[0]?.id || '';
    setProductForm({
      name: '',
      slug: '',
      description: '',
      price: '', // Cleared so administrator can type price naturally without default zero interfering
      discount_price: '',
      category_id: defaultCat,
      subcategory_id: '',
      gender: 'Women',
      sku: `HAB-${Date.now().toString().slice(-4)}`,
      stock: 12,
      main_image: '',
      images: [],
      sizes_text: 'S, M, L, XL',
      colors_text: 'Gold, Emerald, Black, White',
      is_featured: true,
      is_new_arrival: true,
      status: 'active'
    });
    setIsProductModalOpen(true);
  };

  // Save Product (CRUD)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.category_id) {
      showToast('Please provide a product title and category', 'error');
      return;
    }

    if (!productForm.main_image && productForm.images.length === 0) {
      showToast('Please upload or select at least one product photo', 'error');
      return;
    }

    const parsedPrice = typeof productForm.price === 'string' ? parseFloat(productForm.price) : Number(productForm.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      showToast('Please enter a valid product price greater than 0', 'error');
      return;
    }

    const parsedDiscount = productForm.discount_price !== '' && productForm.discount_price !== undefined && productForm.discount_price !== null
      ? (typeof productForm.discount_price === 'string' ? parseFloat(productForm.discount_price) : Number(productForm.discount_price))
      : undefined;

    if (parsedDiscount !== undefined && !isNaN(parsedDiscount) && parsedDiscount >= parsedPrice) {
      showToast('Sale price must be lower than the original price', 'error');
      return;
    }

    const parsedStock = typeof productForm.stock === 'string' ? parseInt(productForm.stock, 10) : Number(productForm.stock);
    const finalStock = isNaN(parsedStock) || parsedStock < 0 ? 0 : parsedStock;

    const sizes = productForm.sizes_text
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const colors = productForm.colors_text
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const images = productForm.images.length > 0 ? productForm.images : [productForm.main_image];
    const main_image = productForm.main_image || images[0] || '';

    const slug =
      productForm.slug.trim() ||
      productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const effectivePrice = parsedDiscount && parsedDiscount > 0 ? parsedDiscount : parsedPrice;
    const generatedVariants = sizes.flatMap(s =>
      colors.map(c => ({
        id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        size: s,
        color: c,
        sku: `${productForm.sku}-${s}-${c.slice(0, 2).toUpperCase()}`,
        stock: Math.max(1, Math.floor(finalStock / (sizes.length * colors.length || 1))),
        price: effectivePrice
      }))
    );

    if (editingProductId) {
      const existing = products.find(p => p.id === editingProductId);
      if (existing) {
        await updateProduct({
          ...existing,
          ...productForm,
          price: parsedPrice,
          discount_price: parsedDiscount && parsedDiscount > 0 ? parsedDiscount : undefined,
          stock: finalStock,
          main_image,
          images,
          slug,
          sizes,
          colors,
          variants: generatedVariants.length > 0 ? generatedVariants : existing.variants
        });
      }
    } else {
      await addProduct({
        ...productForm,
        price: parsedPrice,
        discount_price: parsedDiscount && parsedDiscount > 0 ? parsedDiscount : undefined,
        stock: finalStock,
        main_image,
        images,
        slug,
        sizes,
        colors,
        variants: generatedVariants
      });
    }

    setIsProductModalOpen(false);
  };

  // Toggle publish / archive status
  const handleTogglePublish = async (p: Product) => {
    const nextStatus = p.status === 'active' ? 'archived' : 'active';
    await updateProduct({ ...p, status: nextStatus });
    showToast(`Product ${nextStatus === 'active' ? 'published to storefront' : 'archived'}`, 'success');
  };

  // Handle Receipt Download
  const handleDownloadReceipt = async (order: Order) => {
    setGeneratingPdfId(order.id);
    try {
      await downloadOrderReceiptPDF(order, settings);
      showToast('Official PDF receipt generated and downloaded!', 'success');
    } catch (err) {
      console.error('Failed to generate PDF', err);
      showToast('Error generating PDF receipt', 'error');
    } finally {
      setGeneratingPdfId(null);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({ ...settingsForm, hero_background: previewHeroBg });
  };

  // Category creation
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = newCatName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    await addCategory({
      name: newCatName.trim(),
      slug,
      description: newCatDesc.trim(),
      image_url: newCatImage.trim() || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      display_order: categories.length + 1
    });

    setNewCatName('');
    setNewCatDesc('');
    setNewCatImage('');
  };

  // Subcategory creation
  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCatId) return;
    const slug = newSubName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    await addSubcategory({
      category_id: newSubCatId,
      name: newSubName.trim(),
      slug
    });

    setNewSubName('');
  };

  // Navigation Items
  const navItems: { id: TabType; label: string; icon: any; count?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, count: stats.pendingOrders, badgeColor: 'bg-amber-500 text-white' },
    { id: 'customers', label: 'Customers', icon: Users, count: stats.uniqueCustomersCount },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory Stock', icon: Boxes, count: stats.lowStock > 0 ? stats.lowStock : undefined, badgeColor: 'bg-rose-500 text-white' },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'messages', label: 'Inquiries', icon: Mail, count: contactMessages.filter(m => !m.is_read).length, badgeColor: 'bg-emerald-500 text-white' },
    { id: 'settings', label: 'Store Settings', icon: SettingsIcon },
    { id: 'firebase', label: 'Firebase Cloud & Storage', icon: Database }
  ];

  // ===========================================================================
  // 1. SECURE ADMIN LOGIN SCREEN (Brand Green, Gold, Crisp White)
  // ===========================================================================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#064E3B] via-[#043327] to-[#021F17] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle decorative glow patterns */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-amber-500/30 relative z-10">
          {/* Official Logo Integration */}
          <div className="text-center mb-6">
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-emerald-600 via-amber-400 to-emerald-800 shadow-xl shadow-black/20 flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#064E3B] flex items-center justify-center p-1">
                <img
                  src={OFFICIAL_LOGO_URL}
                  alt="HABEEBATUSSUNNAH ONLINE BUSINESS Logo"
                  className="w-full h-full object-contain"
                  onError={e => {
                    (e.target as HTMLImageElement).src = OFFICIAL_LOGO_REMOTE;
                  }}
                />
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Administration
            </span>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
              HABEEBATUSSUNNAH
            </h1>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mt-0.5">
              Executive Management Portal
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Authorized administrators only. Enter your master access credentials.
            </p>
          </div>

          <form
            onSubmit={async e => {
              e.preventDefault();
              if (isLoggingIn) return;
              setIsLoggingIn(true);
              setLoginError(false);
              try {
                const ok = await loginAdmin(passwordInput);
                if (!ok) {
                  setLoginError(true);
                }
              } catch (err) {
                setLoginError(true);
              } finally {
                setIsLoggingIn(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">
                Administrator Access Key
              </label>
              <div className="relative flex items-center">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={e => {
                    setPasswordInput(e.target.value);
                    setLoginError(false);
                  }}
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                  className={`w-full pl-4 pr-11 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                    loginError
                      ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/30'
                      : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Incorrect administrator password. Please verify and try again.</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 disabled:opacity-70 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>ACCESS ADMIN DASHBOARD</span>
                </>
              )}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-400 font-bold uppercase tracking-wider">or authenticate with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                const user = await signInWithGoogle();
                if (user) {
                  loginAdminWithGoogle(user.email);
                }
              }}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Sign in with Google (Firebase)</span>
            </button>
          </form>

          {onExitToStore && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onExitToStore}
                className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>← Return to Public Storefront</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===========================================================================
  // 2. MAIN LOGGED-IN ADMIN DASHBOARD (Green, Gold & White Theme)
  // ===========================================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row antialiased">
      {/* ===================================================================== */}
      {/* ORGANIZED SIDEBAR (DESKTOP & MOBILE DRAWER) */}
      {/* ===================================================================== */}
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#064E3B] text-white flex flex-col justify-between border-r border-emerald-900 shadow-2xl transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header with Official Logo */}
          <div className="p-5 border-b border-emerald-900/80 bg-[#043327] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-emerald-400 shadow-md shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#064E3B] flex items-center justify-center">
                  <img
                    src={OFFICIAL_LOGO_URL}
                    alt="HABEEBATUSSUNNAH Logo"
                    className="w-full h-full object-contain"
                    onError={e => {
                      (e.target as HTMLImageElement).src = OFFICIAL_LOGO_REMOTE;
                    }}
                  />
                </div>
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-black tracking-tight text-white truncate">
                  HABEEBATUSSUNNAH
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black tracking-wider uppercase text-amber-300 truncate">
                    Executive Portal
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-emerald-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats Pill Bar inside sidebar */}
          <div className="px-5 py-3 bg-emerald-950/40 border-b border-emerald-900/60 flex items-center justify-between text-[11px]">
            <span className="text-emerald-300 font-medium">Confirmed Sales</span>
            <strong className="text-amber-400 font-black">{formatPrice(stats.totalSales)}</strong>
          </div>

          {/* Sidebar Navigation Links */}
          <nav className="p-3 space-y-1 flex-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20 translate-x-1'
                      : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-300 group-hover:text-amber-300'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-slate-950 text-amber-300'
                          : item.badgeColor || 'bg-emerald-900 text-emerald-200'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Controls */}
          <div className="p-4 border-t border-emerald-900 bg-[#043327]/60 space-y-2">
            {onExitToStore && (
              <button
                onClick={onExitToStore}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-emerald-700/40"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                <span>View Storefront</span>
              </button>
            )}

            <button
              onClick={() => {
                logoutAdmin();
                onExitToStore?.();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-rose-800/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 capitalize tracking-tight">
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'products' && 'Product Catalog Management'}
                  {activeTab === 'orders' && 'Order Processing & Tracking'}
                  {activeTab === 'customers' && 'Verified Customer Directory'}
                  {activeTab === 'analytics' && 'Business Analytics & Reports'}
                  {activeTab === 'inventory' && 'Inventory Stock Controller'}
                  {activeTab === 'categories' && 'Categories & Departments'}
                  {activeTab === 'messages' && 'Customer Inquiries & Messages'}
                  {activeTab === 'settings' && 'Store Profile & Bank Settings'}
                  {activeTab === 'firebase' && 'Firebase Cloud Database & Image Storage'}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Live Database
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                HABEEBATUSSUNNAH ONLINE BUSINESS · Administrative Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleOpenNewProduct}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Add Product</span>
            </button>

            {onExitToStore && (
              <button
                onClick={onExitToStore}
                className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer hidden sm:flex items-center gap-1 text-xs font-bold"
                title="Open customer storefront"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Store</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable View Content */}
        <main className="p-4 sm:p-8 space-y-6 flex-1">
          {/* ================================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Stat Cards in Brand Emerald, Gold & White */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* 1. Total Sales */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-emerald-500 transition-colors">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Confirmed Sales</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-emerald-900 tracking-tight">
                    {formatPrice(stats.totalSales)}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{stats.confirmedPayments} verified payments</span>
                  </div>
                </div>

                {/* 2. Orders & Pending */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-amber-500 transition-colors">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Orders</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">
                    {stats.totalOrders}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black">
                      {stats.pendingOrders} pending fulfillment
                    </span>
                  </div>
                </div>

                {/* 3. Products & Stock */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-emerald-500 transition-colors">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Catalog Products</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">
                    {stats.totalProducts}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                    {stats.lowStock > 0 ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold">
                        {stats.lowStock} low stock alert
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">All items stocked</span>
                    )}
                  </div>
                </div>

                {/* 4. Verified Customers */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-emerald-500 transition-colors">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Customer Base</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">
                    {stats.uniqueCustomersCount}
                  </p>
                  <div className="mt-2 text-[11px] text-slate-500 font-medium">
                    Avg. Order Value: <strong className="text-slate-800">{formatPrice(stats.averageOrderValue)}</strong>
                  </div>
                </div>
              </div>

              {/* Action Banner & Quick Operations */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Orders Stream */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-emerald-700" />
                      <h3 className="text-sm font-extrabold text-slate-900">Recent Customer Orders</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>Manage All ({orders.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      No customer orders recorded yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-emerald-800">{o.id}</span>
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  o.payment_status === 'Confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {o.payment_status}
                              </span>
                            </div>
                            <p className="text-slate-600 mt-1">
                              <strong>{o.customer.full_name}</strong> · {o.customer.city}, {o.customer.state}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="font-black text-slate-900 text-sm block">
                              {formatPrice(o.total_amount)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                              {o.tracking_stage || 'SELLER CONFIRMED'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right 1 Col: Quick Shortcuts & Health */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-extrabold text-slate-900">Operations Hub</h3>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={handleOpenNewProduct}
                      className="w-full py-2.5 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Add New Product (Image Upload)</span>
                      <Plus className="w-4 h-4 text-amber-300" />
                    </button>

                    <button
                      onClick={() => setActiveTab('orders')}
                      className="w-full py-2.5 px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-between border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span>Review Pending Orders</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                        {stats.awaitingPayments} to confirm
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('customers')}
                      className="w-full py-2.5 px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-between border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span>Customer Directory & Spend</span>
                      <Users className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full py-2.5 px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-between border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span>Update OPAY & Themes</span>
                      <SettingsIcon className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <strong className="block font-black">Total Inventory Value:</strong>
                    <p className="text-sm font-extrabold text-emerald-800">
                      {formatPrice(stats.inventoryTotalValue)} ({stats.totalInventoryUnits} units across {products.length} products)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: PRODUCT MANAGEMENT */}
          {/* ================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Header & Filters */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      placeholder="Search products by title, SKU, category..."
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenNewProduct}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                  {/* Category Filter */}
                  <select
                    value={productCategoryFilter}
                    onChange={e => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  {/* Gender Filter */}
                  <select
                    value={productGenderFilter}
                    onChange={e => setProductGenderFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
                  >
                    <option value="all">All Genders</option>
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>

                  {/* Stock Filter */}
                  <select
                    value={productStockFilter}
                    onChange={e => setProductStockFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
                  >
                    <option value="all">All Stock Levels</option>
                    <option value="in_stock">In Stock ({products.filter(p => p.stock > 0).length})</option>
                    <option value="low_stock">Low Stock (≤ 5)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={productStatusFilter}
                    onChange={e => setProductStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Storefront</option>
                    <option value="archived">Archived / Hidden</option>
                  </select>
                </div>
              </div>

              {/* Product Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-4">Photo Preview</th>
                        <th className="p-4">Product & Category</th>
                        <th className="p-4">SKU / Gender</th>
                        <th className="p-4">Retail Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Storefront Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            No products match your current search or filters.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(p => {
                          const cat = categories.find(c => c.id === p.category_id);
                          return (
                            <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* Photo Preview */}
                              <td className="p-4">
                                <div className="w-12 h-14 rounded-xl bg-slate-50 overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center p-1">
                                  <img
                                    src={p.main_image || p.images?.[0]}
                                    alt={p.name}
                                    className="w-full h-full object-contain object-center"
                                    onError={e => {
                                      (e.target as HTMLImageElement).src =
                                        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80';
                                    }}
                                  />
                                </div>
                              </td>

                              {/* Title & Category */}
                              <td className="p-4">
                                <strong className="text-slate-900 block text-xs font-bold line-clamp-1">
                                  {p.name}
                                </strong>
                                <span className="text-[11px] text-emerald-800 font-semibold">
                                  {cat?.name || 'General Category'}
                                </span>
                              </td>

                              {/* SKU & Gender */}
                              <td className="p-4 font-mono text-slate-500">
                                <span>{p.sku}</span>
                                <span className="block text-[10px] text-slate-400 font-sans">{p.gender}</span>
                              </td>

                              {/* Price */}
                              <td className="p-4">
                                <strong className="text-slate-900 font-black">
                                  {formatPrice(p.discount_price || p.price)}
                                </strong>
                                {p.discount_price && (
                                  <span className="block text-[10px] text-slate-400 line-through">
                                    {formatPrice(p.price)}
                                  </span>
                                )}
                              </td>

                              {/* Stock */}
                              <td className="p-4">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                    p.stock <= 0
                                      ? 'bg-rose-100 text-rose-800'
                                      : p.stock <= 5
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {p.stock} units
                                </span>
                              </td>

                              {/* Status Toggle */}
                              <td className="p-4">
                                <button
                                  type="button"
                                  onClick={() => handleTogglePublish(p)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                                    p.status === 'active'
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                  }`}
                                  title="Click to toggle active or archived"
                                >
                                  {p.status === 'active' ? '● Active' : '○ Archived'}
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                                  title="Edit product details & images"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    setConfirmDialog({
                                      isOpen: true,
                                      title: 'Delete Product',
                                      message: `Are you sure you want to permanently delete "${p.name}"? This action cannot be undone.`,
                                      onConfirm: () => {
                                        deleteProduct(p.id);
                                        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                                      }
                                    });
                                  }}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: ORDER MANAGEMENT & TRACKING CONTROLLER */}
          {/* ================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Search & Filters */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={e => setOrderSearchQuery(e.target.value)}
                      placeholder="Search orders by Order Number, Customer Name, or Phone..."
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <select
                    value={orderPaymentFilter}
                    onChange={e => setOrderPaymentFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
                  >
                    <option value="all">All Payment Statuses</option>
                    <option value="Confirmed">Confirmed Payments</option>
                    <option value="Awaiting Confirmation">Awaiting OPAY Confirmation</option>
                    <option value="Payment Submitted">Payment Submitted</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <select
                    value={orderTrackingFilter}
                    onChange={e => setOrderTrackingFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
                  >
                    <option value="all">All Fulfillment Stages</option>
                    {TRACKING_STEPS.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order Cards List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                  No orders match your filter criteria.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => {
                    const currentTracking = order.tracking_stage || 'SELLER CONFIRMED';
                    const trackingIdx = TRACKING_STEPS.indexOf(currentTracking);

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 hover:border-emerald-500/50 transition-colors"
                      >
                        {/* Top order summary header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-base font-black text-emerald-900">
                                {order.id}
                              </span>
                              <span
                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                  order.payment_status === 'Confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {order.payment_status}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                              Ordered on {new Date(order.created_at).toLocaleString()}
                            </span>
                          </div>

                          {/* Quick action buttons (Receipt, WhatsApp) */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDownloadReceipt(order)}
                              disabled={generatingPdfId === order.id}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                              title="Download official PDF receipt with official logo"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{generatingPdfId === order.id ? 'Generating...' : 'PDF Receipt'}</span>
                            </button>

                            <a
                              href={`https://wa.me/${order.customer.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${order.customer.full_name}, this is HABEEBATUSSUNNAH regarding your order ${order.id}. Current tracking stage: ${currentTracking}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp Customer</span>
                            </a>
                          </div>
                        </div>

                        {/* Customer & Address Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3.5 rounded-xl bg-slate-50 text-xs">
                          <div>
                            <span className="text-slate-400 font-bold uppercase text-[10px] block">Customer</span>
                            <strong className="text-slate-900">{order.customer.full_name}</strong>
                            <p className="text-slate-500 mt-0.5">{order.customer.phone_number}</p>
                          </div>

                          <div>
                            <span className="text-slate-400 font-bold uppercase text-[10px] block">Delivery Location</span>
                            <strong className="text-slate-900">{order.customer.city}, {order.customer.state}</strong>
                            <p className="text-slate-500 mt-0.5 line-clamp-1">{order.customer.delivery_address}</p>
                          </div>

                          <div>
                            <span className="text-slate-400 font-bold uppercase text-[10px] block">Amount Paid</span>
                            <strong className="text-emerald-800 font-black text-sm">
                              {formatPrice(order.total_amount)}
                            </strong>
                            <span className="text-[10px] text-slate-500 block">
                              Items: {formatPrice(order.subtotal)} | Delivery: {formatPrice(order.delivery_fee)}
                            </span>
                          </div>
                        </div>

                        {/* Ordered Items Preview */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Ordered Items ({order.items.length})
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {order.items.map(item => (
                              <div
                                key={item.id}
                                className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 bg-white"
                              >
                                <img
                                  src={item.product_image}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-contain p-0.5 bg-white border border-slate-200 shrink-0"
                                />
                                <div className="text-xs overflow-hidden">
                                  <p className="font-bold text-slate-800 truncate">{item.product_name}</p>
                                  <span className="text-slate-500 text-[11px]">
                                    Qty {item.quantity} · {formatPrice(item.unit_price)}
                                    {item.selected_size && ` · Size: ${item.selected_size}`}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 6-STAGE TRACKING TIMELINE CONTROLLER WITH TICKS */}
                        <div className="pt-3 border-t border-slate-100 space-y-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <span className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5">
                              <Truck className="w-4 h-4 text-emerald-700" />
                              <span>Live Order Tracking Controller</span>
                            </span>

                            {/* Payment Status Dropdown Controller */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 font-bold">Payment:</span>
                              <select
                                value={order.payment_status}
                                onChange={e => updatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                                className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                                  order.payment_status === 'Confirmed'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="Confirmed">✓ Confirmed</option>
                                <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                                <option value="Payment Submitted">Payment Submitted</option>
                                <option value="Pending">Pending</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                          </div>

                          {/* Stepper buttons with clear ticks */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                            {TRACKING_STEPS.map((step, idx) => {
                              const isCompleted = trackingIdx >= idx;
                              const isCurrent = currentTracking === step;

                              return (
                                <button
                                  key={step}
                                  type="button"
                                  onClick={() => updateOrderTrackingStage(order.id, step)}
                                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                    isCurrent
                                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                                      : isCompleted
                                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-black tracking-widest uppercase opacity-75">
                                      Stage {idx + 1}
                                    </span>
                                    {isCompleted && (
                                      <CheckCircle2
                                        className={`w-3.5 h-3.5 ${
                                          isCurrent ? 'text-amber-300' : 'text-emerald-600'
                                        }`}
                                      />
                                    )}
                                  </div>
                                  <span className="text-[11px] font-black leading-tight block truncate">
                                    {step}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: CUSTOMERS DIRECTORY */}
          {/* ================================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={customerSearchQuery}
                    onChange={e => setCustomerSearchQuery(e.target.value)}
                    placeholder="Search verified customers by name, phone, city, or email..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Total Verified Customers: <strong className="text-emerald-800">{stats.uniqueCustomersCount}</strong>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Contact (Phone / Email)</th>
                        <th className="p-4">Location (City, State)</th>
                        <th className="p-4">Total Orders</th>
                        <th className="p-4">Total Spent</th>
                        <th className="p-4">Last Order Date</th>
                        <th className="p-4 text-right">Quick Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            No customers found. Customers appear here automatically when orders are placed.
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4">
                              <strong className="text-slate-900 block font-bold">{c.name}</strong>
                            </td>
                            <td className="p-4">
                              <p className="font-mono text-slate-700">{c.phone}</p>
                              <span className="text-slate-400 text-[11px] block">{c.email || 'N/A'}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-slate-800 font-medium">{c.city}, {c.state}</span>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                                {c.orders} {c.orders === 1 ? 'order' : 'orders'}
                              </span>
                            </td>
                            <td className="p-4 font-black text-emerald-800">
                              {formatPrice(c.total)}
                            </td>
                            <td className="p-4 text-slate-500">
                              {new Date(c.lastOrder).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right space-x-1.5">
                              {c.phone && (
                                <a
                                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                    `Hello ${c.name}, thank you for choosing HABEEBATUSSUNNAH ONLINE BUSINESS!`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] transition-colors"
                                >
                                  <MessageCircle className="w-3 h-3 fill-current" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                              {c.email && (
                                <a
                                  href={`mailto:${c.email}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Email</span>
                                </a>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: ANALYTICS & REPORTS */}
          {/* ================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Header Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Gross Verified Revenue
                  </span>
                  <p className="text-3xl font-black text-emerald-900">{formatPrice(stats.totalSales)}</p>
                  <p className="text-xs text-slate-500">Across {stats.confirmedPayments} verified bank payments</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Average Order Value (AOV)
                  </span>
                  <p className="text-3xl font-black text-amber-600">{formatPrice(stats.averageOrderValue)}</p>
                  <p className="text-xs text-slate-500">Calculated from confirmed transactions</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Warehouse Inventory Valuation
                  </span>
                  <p className="text-3xl font-black text-slate-900">{formatPrice(stats.inventoryTotalValue)}</p>
                  <p className="text-xs text-slate-500">{stats.totalInventoryUnits} units across {products.length} products</p>
                </div>
              </div>

              {/* Best Selling Products list calculated from real order items */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-700" />
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Top Products by Customer Order Frequency
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Real Order Sales</span>
                </div>

                {products.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No catalog products available.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {products.slice(0, 6).map((prod, idx) => {
                      // Count total quantity sold in all orders
                      const unitsSold = orders.reduce((total, o) => {
                        const match = o.items.find(item => item.product_id === prod.id);
                        return total + (match ? match.quantity : 0);
                      }, 0);

                      return (
                        <div key={prod.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <img
                              src={prod.main_image || prod.images?.[0]}
                              alt=""
                              className="w-10 h-12 rounded-lg object-contain p-0.5 bg-slate-50 border border-slate-200 shrink-0"
                            />
                            <div>
                              <strong className="text-slate-900 block font-bold">{prod.name}</strong>
                              <span className="text-[11px] text-slate-400">SKU: {prod.sku} · {prod.gender}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-black text-emerald-800 text-sm block">
                              {formatPrice(prod.price)}
                            </span>
                            <span className="text-[11px] font-bold text-amber-700">
                              {unitsSold} units ordered
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: INVENTORY STOCK CONTROLLER */}
          {/* ================================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900">Inventory Stock Controller</h2>
                  <p className="text-xs text-slate-500">Quickly adjust stock units or audit out-of-stock items</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  {stats.totalInventoryUnits} units in total
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Current Stock</th>
                      <th className="p-4">Stock Status</th>
                      <th className="p-4 text-right">Quick Stock Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50/70">
                        <td className="p-4 font-bold text-slate-900">{product.name}</td>
                        <td className="p-4 font-mono text-slate-500">{product.sku}</td>
                        <td className="p-4 font-black text-slate-900 text-sm">{product.stock}</td>
                        <td className="p-4">
                          {product.stock <= 0 ? (
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold text-[10px]">
                              OUT OF STOCK
                            </span>
                          ) : product.stock <= 5 ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                              LOW STOCK
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              IN STOCK
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => updateInventory(product.id, Math.max(0, product.stock - 5))}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => updateInventory(product.id, Math.max(0, product.stock - 1))}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => updateInventory(product.id, product.stock + 1)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => updateInventory(product.id, product.stock + 10)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold cursor-pointer"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: CATEGORIES MANAGEMENT */}
          {/* ================================================================= */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Categories */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
                  Store Categories ({categories.length})
                </h3>

                <form onSubmit={handleCreateCategory} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block">Add New Category</span>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="Category Name (e.g. Abayas, Footwear, Perfumes)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={e => setNewCatDesc(e.target.value)}
                    placeholder="Short Description"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <input
                    type="url"
                    value={newCatImage}
                    onChange={e => setNewCatImage(e.target.value)}
                    placeholder="Cover Image URL"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                  >
                    Create Category
                  </button>
                </form>

                <div className="divide-y divide-slate-100">
                  {categories.map(cat => (
                    <div key={cat.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 block">{cat.name}</strong>
                        <span className="text-[11px] text-slate-400 font-mono">/{cat.slug}</span>
                      </div>
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Delete Category',
                            message: `Delete category "${cat.name}"? Products under this category might need reassignment.`,
                            onConfirm: () => {
                              deleteCategory(cat.id);
                              setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                            }
                          });
                        }}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Subcategories */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
                  Subcategories ({subcategories.length})
                </h3>

                <form onSubmit={handleCreateSubcategory} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block">Add New Subcategory</span>
                  <select
                    required
                    value={newSubCatId}
                    onChange={e => setNewSubCatId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="">Select Parent Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    required
                    value={newSubName}
                    onChange={e => setNewSubName(e.target.value)}
                    placeholder="Subcategory Name (e.g. Silk Hijabs, Handbags)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                  >
                    Create Subcategory
                  </button>
                </form>

                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {subcategories.map(sub => {
                    const parent = categories.find(c => c.id === sub.category_id);
                    return (
                      <div key={sub.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-slate-900">{sub.name}</strong>
                          <span className="text-[11px] text-slate-400 ml-2">({parent?.name || 'Unassigned'})</span>
                        </div>
                        <button
                          onClick={() => deleteSubcategory(sub.id)}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: CUSTOMER INQUIRIES & MESSAGES */}
          {/* ================================================================= */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-base font-black text-slate-900">
                Customer Contact Inquiries ({contactMessages.length})
              </h2>

              {contactMessages.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                  No inquiries submitted yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`bg-white p-5 rounded-2xl border transition-all ${
                        msg.is_read ? 'border-slate-200 opacity-80' : 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <strong className="text-sm font-extrabold text-slate-900">{msg.name}</strong>
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 space-y-0.5 mb-3">
                        {msg.phone && <p>Tel: {msg.phone}</p>}
                        {msg.email && <p>Email: {msg.email}</p>}
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line leading-relaxed mb-4">
                        "{msg.message}"
                      </p>

                      <div className="flex items-center justify-between text-xs pt-1">
                        {!msg.is_read ? (
                          <button
                            onClick={() => markMessageRead(msg.id)}
                            className="text-emerald-700 hover:underline font-bold cursor-pointer"
                          >
                            Mark as Read
                          </button>
                        ) : (
                          <span className="text-slate-400">Read</span>
                        )}

                        {msg.phone && (
                          <a
                            href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${msg.name}, thank you for contacting HABEEBATUSSUNNAH ONLINE BUSINESS!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Reply WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 9: STORE SETTINGS & BACKGROUND THEMES */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Official Store Settings & Customization
                  </h2>
                  <p className="text-xs text-slate-500">
                    Control brand identity, bank transfer receiver, and website background themes.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
                {/* 1. HERO SECTION BACKGROUND CUSTOMIZATION (5 PRESTIGE OPTIONS WITH LIVE PREVIEW) */}
                <div className="p-5 bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
                        <Layout className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 text-sm uppercase tracking-wider block">
                          Hero Section Background Customization
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Select from 5 premium curated backdrops for the home page hero section.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-[10px] uppercase tracking-wider border border-emerald-300/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Active: {HERO_BACKGROUND_CONFIGS[settings.hero_background || 'royal_emerald']?.name || 'Royal Emerald & Gold'}</span>
                      </span>
                    </div>
                  </div>

                  {/* 5 Distinct Aesthetic Background Option Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {HERO_BACKGROUND_LIST.map(opt => {
                      const isSelected = previewHeroBg === opt.id;
                      const isCurrentLive = (settings.hero_background || 'royal_emerald') === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setPreviewHeroBg(opt.id);
                            setSettingsForm(prev => ({ ...prev, hero_background: opt.id }));
                          }}
                          className={`group text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                            isSelected
                              ? 'ring-2 ring-amber-500 border-amber-500 bg-white shadow-md'
                              : 'border-slate-200/90 bg-white/90 hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 text-amber-300">
                                {opt.badge}
                              </span>
                              {isCurrentLive && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  <Check className="w-2.5 h-2.5 text-emerald-600" /> Live
                                </span>
                              )}
                            </div>

                            {/* Color Palette Swatch Bar */}
                            <div className={`h-10 w-full rounded-xl bg-gradient-to-r ${opt.swatchGradient} ${opt.borderClass} border shadow-inner mb-2.5 relative overflow-hidden flex items-center justify-between px-2.5`}>
                              <div className="w-3.5 h-3.5 rounded-full bg-amber-400/30 blur-xs" />
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80 shadow-xs" />
                            </div>

                            <span className="font-extrabold text-slate-950 block text-xs leading-tight mb-1">
                              {opt.name}
                            </span>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              {opt.desc}
                            </p>
                          </div>

                          <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
                            <span className={isSelected ? 'text-amber-700' : 'text-slate-400'}>
                              {isSelected ? '✓ Selected' : 'Click to preview'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* LIVE INTERACTIVE PREVIEW BOX */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-700" />
                        <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                          Live Hero Banner Preview
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          (Interactive mock preview of how visitors see your hero section)
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-2">
                        <span>Selected Backdrop:</span>
                        <strong className="text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md font-extrabold">
                          {HERO_BACKGROUND_CONFIGS[previewHeroBg]?.name}
                        </strong>
                        {previewHeroBg !== (settings.hero_background || 'royal_emerald') && (
                          <span className="text-amber-600 text-[10px] font-bold animate-pulse">
                            (Unsaved Changes)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Scaled Realistic Hero Mock Window */}
                    {(() => {
                      const cfg = HERO_BACKGROUND_CONFIGS[previewHeroBg] || HERO_BACKGROUND_CONFIGS.royal_emerald;
                      return (
                        <div className={`relative overflow-hidden ${cfg.gradientClass} rounded-2xl p-4 sm:p-6 border ${cfg.borderClass} text-white shadow-inner transition-colors duration-500`}>
                          {/* Glow Orbs */}
                          <div className={`absolute top-0 right-1/4 -mt-10 w-44 h-44 rounded-full ${cfg.orb1Class} blur-2xl pointer-events-none`} />
                          <div className={`absolute bottom-0 left-6 -mb-10 w-44 h-44 rounded-full ${cfg.orb2Class} blur-2xl pointer-events-none`} />

                          {/* Subtle geometric pattern overlay */}
                          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60" />

                          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                            {/* Left Copy Mockup */}
                            <div className="md:col-span-8 space-y-2.5 text-left">
                              {/* Brand pill */}
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${cfg.kickerBgClass} text-[9.5px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                <span className="text-amber-300">HABEEVATUSSUNNAH</span>
                                <span className="opacity-40">|</span>
                                <span className="text-white/90">NIGERIA'S PREMIER ONLINE BOUTIQUE</span>
                              </div>

                              <div>
                                <h3 className="text-lg sm:text-2xl font-black text-white leading-tight tracking-tight">
                                  CURATED FASHION &{' '}
                                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-serif italic">
                                    TIMELESS ELEGANCE.
                                  </span>
                                </h3>
                                <p className={`text-xs ${cfg.subtextColor} max-w-lg mt-1 leading-relaxed`}>
                                  Discover refined modest wear, contemporary dresses, tailored men apparel, and luxury lifestyle essentials delivered directly to your doorstep across Nigeria.
                                </p>
                              </div>

                              {/* Buttons */}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                                  SHOP NOW <ArrowUpRight className="w-3.5 h-3.5" />
                                </span>
                                <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/25 text-white font-black text-[10px] uppercase tracking-wider backdrop-blur-xs">
                                  EXPLORE COLLECTION
                                </span>
                              </div>

                              {/* Trust Highlights */}
                              <div className="grid grid-cols-4 gap-1.5 pt-1.5">
                                {[
                                  { title: 'Nationwide', sub: 'Fast Nigeria delivery' },
                                  { title: 'Quality', sub: '100% Inspected' },
                                  { title: 'OPAY Bank', sub: 'Smooth checkout' },
                                  { title: 'WhatsApp', sub: 'Instant confirmation' }
                                ].map((tItem, tIdx) => (
                                  <div key={tIdx} className={`p-1.5 rounded-xl ${cfg.cardBgClass} border text-[9px] backdrop-blur-xs`}>
                                    <span className="font-extrabold text-amber-300 block leading-tight">{tItem.title}</span>
                                    <span className="text-[8px] text-white/70 block truncate">{tItem.sub}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Right Image Mockup */}
                            <div className="md:col-span-4 flex justify-center md:justify-end">
                              <div className="relative w-32 sm:w-40 aspect-4/5 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl bg-slate-900">
                                <img
                                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80"
                                  alt="Preview Collection"
                                  className="w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                                <div className={`absolute bottom-2 left-2 right-2 p-1.5 rounded-xl ${cfg.cardBgClass} backdrop-blur-md border border-amber-400/40 text-[9px]`}>
                                  <span className="text-[8px] font-black uppercase text-amber-300 block">HABEEVATUSSUNNAH</span>
                                  <span className="font-extrabold text-white block">Ready-To-Wear</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Explicit Apply & Reset Action Controls */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={isSavingHeroBg}
                        onClick={async () => {
                          setIsSavingHeroBg(true);
                          setSettingsForm(prev => ({ ...prev, hero_background: previewHeroBg }));
                          await updateHeroBackground(previewHeroBg);
                          setIsSavingHeroBg(false);
                        }}
                        className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Save className="w-4 h-4 text-amber-300" />
                        <span>
                          {isSavingHeroBg ? 'Applying & Saving...' : 'Apply & Save Hero Background'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          setPreviewHeroBg('royal_emerald');
                          setSettingsForm(prev => ({ ...prev, hero_background: 'royal_emerald' }));
                          await updateHeroBackground('royal_emerald');
                        }}
                        className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reset to Royal Emerald (Signature)</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-500 italic">
                      Persistent: Saved in database and remains active across reloads.
                    </span>
                  </div>
                </div>

                {/* 2. BACKGROUND COLOUR THEME OPTIONS */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-slate-900 uppercase tracking-wider block">
                        Website Background Theme
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[10px] uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Active: {settings.background_theme?.toUpperCase() || 'WHITE'}</span>
                    </span>
                  </div>

                  <p className="text-slate-500 text-[11px]">
                    Select a theme to permanently change the store canvas. Settings persist across page refreshes, devices, and sessions.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                    {[
                      { id: 'white' as BackgroundTheme, label: 'WHITE', desc: 'Crisp Luxury', bg: 'bg-white', border: 'border-slate-300' },
                      { id: 'amber' as BackgroundTheme, label: 'AMBER', desc: 'Warm Gold', bg: 'bg-amber-100', border: 'border-amber-300' },
                      { id: 'emerald' as BackgroundTheme, label: 'EMERALD', desc: 'Royal Mint', bg: 'bg-emerald-100', border: 'border-emerald-300' },
                      { id: 'sapphire' as BackgroundTheme, label: 'SAPPHIRE', desc: 'Deep Navy', bg: 'bg-slate-900', border: 'border-slate-700' },
                      { id: 'rose' as BackgroundTheme, label: 'ROSE', desc: 'Blush Velvet', bg: 'bg-rose-100', border: 'border-rose-300' }
                    ].map(theme => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          setSettingsForm({ ...settingsForm, background_theme: theme.id });
                          updateBackgroundTheme(theme.id);
                        }}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          settingsForm.background_theme === theme.id
                            ? 'ring-2 ring-emerald-600 border-emerald-600 bg-white shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-400'
                        }`}
                      >
                        <div className={`w-8 h-8 mx-auto rounded-full ${theme.bg} ${theme.border} border shadow-xs mb-2`} />
                        <span className="font-black text-slate-900 block text-xs">{theme.label}</span>
                        <span className="text-[10px] text-slate-400 block">{theme.desc}</span>
                      </button>
                    ))}
                  </div>

                  {/* Explicit Save & Reset Theme Controls */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => updateBackgroundTheme(settingsForm.background_theme || 'white')}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-amber-300" />
                      <span>Confirm & Save Theme</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSettingsForm({ ...settingsForm, background_theme: 'white' });
                        updateBackgroundTheme('white');
                      }}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset Theme to Default</span>
                    </button>
                  </div>
                </div>

                {/* 2. Business Details */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Brand Title</label>
                  <input
                    type="text"
                    value={settingsForm.business_name}
                    onChange={e => setSettingsForm({ ...settingsForm, business_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Primary Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={settingsForm.phone_number}
                      onChange={e => setSettingsForm({ ...settingsForm, phone_number: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Secondary Phone Number</label>
                    <input
                      type="text"
                      value={settingsForm.secondary_phone || '+2348065812090'}
                      onChange={e => setSettingsForm({ ...settingsForm, secondary_phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.email || 'habibamohammed02090@gmail.com'}
                    onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900"
                  />
                </div>

                {/* 3. Bank Account Information (OPAY) */}
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <span className="font-bold text-emerald-950 uppercase tracking-wider block">
                    Official OPay Bank Transfer Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Bank / Provider</label>
                      <input
                        type="text"
                        value={settingsForm.payment_provider}
                        onChange={e => setSettingsForm({ ...settingsForm, payment_provider: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Account Name</label>
                      <input
                        type="text"
                        value={settingsForm.account_name}
                        onChange={e => setSettingsForm({ ...settingsForm, account_name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Account Number</label>
                      <input
                        type="text"
                        value={settingsForm.account_number}
                        onChange={e => setSettingsForm({ ...settingsForm, account_number: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold text-emerald-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Default Delivery Fee (₦)</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g. 2500"
                    value={settingsForm.default_delivery_fee === 0 ? '' : (settingsForm.default_delivery_fee ?? '')}
                    onChange={e => {
                      const val = e.target.value;
                      setSettingsForm({ ...settingsForm, default_delivery_fee: val === '' ? 0 : Number(val) });
                    }}
                    onFocus={e => {
                      if (settingsForm.default_delivery_fee === 0) {
                        e.target.select();
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>SAVE ALL STORE SETTINGS</span>
                </button>
              </form>
            </div>

            {/* Dedicated Admin Security & Password Settings Section */}
            <div className="max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 mt-6">
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-amber-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/20">
                    <Lock className="w-5 h-5 text-amber-200" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <span>Admin Security & Password Settings</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage administrator authentication, salted SHA-256 cryptographic credentials, and access recovery.
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase tracking-wider self-start sm:self-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SHA-256 Salted Hashing</span>
                </span>
              </div>

              {/* Status & Feedback Alert */}
              {pwdFeedback && (
                <div
                  className={`p-4 rounded-2xl border text-xs flex items-start gap-3 animate-in fade-in duration-200 ${
                    pwdFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  {pwdFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 font-semibold leading-relaxed">
                    {pwdFeedback.message}
                  </div>
                </div>
              )}

              <form
                onSubmit={async e => {
                  e.preventDefault();
                  if (isChangingPwd) return;
                  setPwdFeedback(null);

                  if (!currentPwd.trim()) {
                    setPwdFeedback({ type: 'error', message: 'Please enter your current administrator password.' });
                    return;
                  }
                  if (newPwd.trim().length < 8) {
                    setPwdFeedback({ type: 'error', message: 'New password must be at least 8 characters long.' });
                    return;
                  }
                  if (newPwd !== confirmPwd) {
                    setPwdFeedback({ type: 'error', message: 'The new password and confirmation password do not match.' });
                    return;
                  }

                  setIsChangingPwd(true);
                  try {
                    const result = await updateAdminPassword(currentPwd, newPwd, confirmPwd);
                    if (result.success) {
                      setPwdFeedback({ type: 'success', message: result.message });
                      setCurrentPwd('');
                      setNewPwd('');
                      setConfirmPwd('');
                    } else {
                      setPwdFeedback({ type: 'error', message: result.message });
                    }
                  } catch (err) {
                    setPwdFeedback({ type: 'error', message: 'Failed to update password due to a cryptographic error.' });
                  } finally {
                    setIsChangingPwd(false);
                  }
                }}
                className="space-y-4 text-xs"
              >
                {/* 1. Current Password */}
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Current Administrator Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showCurrentPwd ? 'text' : 'password'}
                      required
                      value={currentPwd}
                      onChange={e => setCurrentPwd(e.target.value)}
                      placeholder="Enter active administrator password"
                      autoComplete="current-password"
                      className="w-full pl-3.5 pr-11 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
                      title={showCurrentPwd ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 2. New Password */}
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">
                      New Administrator Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showNewPwd ? 'text' : 'password'}
                        required
                        value={newPwd}
                        onChange={e => setNewPwd(e.target.value)}
                        placeholder="Minimum 8 characters"
                        autoComplete="new-password"
                        className="w-full pl-3.5 pr-11 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
                        title={showNewPwd ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {newPwd && newPwd.length < 8 && (
                      <span className="text-[11px] text-amber-600 font-bold mt-1 block">
                        Must be at least 8 characters ({newPwd.length}/8)
                      </span>
                    )}
                  </div>

                  {/* 3. Confirm New Password */}
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">
                      Confirm New Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        required
                        value={confirmPwd}
                        onChange={e => setConfirmPwd(e.target.value)}
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                        className={`w-full pl-3.5 pr-11 py-2.5 rounded-xl border text-sm font-medium text-slate-900 ${
                          confirmPwd && confirmPwd !== newPwd
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
                        title={showConfirmPwd ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPwd && confirmPwd === newPwd && (
                      <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Passwords match
                      </span>
                    )}
                  </div>
                </div>

                {/* Security Action Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isChangingPwd}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 disabled:opacity-60 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isChangingPwd ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                        <span>UPDATING SECURE HASH...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 text-amber-300" />
                        <span>UPDATE ADMINISTRATOR PASSWORD</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to restore the default administrator password? This resets the authentication hash.')) {
                        resetAdminPassword();
                        setCurrentPwd('');
                        setNewPwd('');
                        setConfirmPwd('');
                        setPwdFeedback({
                          type: 'success',
                          message: 'Administrator password successfully reset to default master credential.'
                        });
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reset to Default Master Password</span>
                  </button>
                </div>
              </form>

              {/* Informational Security Callout */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-950 block">Cryptographic Protection Standards:</strong>
                  Passwords are processed exclusively through salted SHA-256 Web Cryptography digests. Plain-text passwords are never stored in the database, local storage, logs, or network payloads.
                </div>
              </div>
            </div>
          </div>
        )}

          {/* ================================================================= */}
          {/* TAB 10: FIREBASE CLOUD & STORAGE ARCHITECTURE */}
          {/* ================================================================= */}
          {activeTab === 'firebase' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Firebase Cloud Database & Storage Architecture
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live production status for Firestore database, security rules, and product image storage.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    setIsTestingStorage(true);
                    setStorageTestResult(null);
                    try {
                      const res = await testFirebaseStorageConnection();
                      setStorageTestResult(res);
                      if (res.success) {
                        showToast('Firebase Storage is live & working!', 'success');
                      } else {
                        showToast('Firebase Storage check notice displayed', 'info');
                      }
                    } catch (e: any) {
                      setStorageTestResult({
                        success: false,
                        message: e.message || 'Storage test failed',
                        bucket: storage.app.options.storageBucket || 'default'
                      });
                    } finally {
                      setIsTestingStorage(false);
                    }
                  }}
                  disabled={isTestingStorage}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-amber-300 ${isTestingStorage ? 'animate-spin' : ''}`} />
                  <span>{isTestingStorage ? 'Testing Connection...' : 'Test Storage Connection'}</span>
                </button>
              </div>

              {/* Status Banner */}
              {storageTestResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs flex items-start gap-3 animate-in fade-in ${
                    storageTestResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  {storageTestResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <strong className="block font-bold">
                      {storageTestResult.success ? 'Storage Verification Succeeded' : 'Firebase Storage Setup Guidance'}
                    </strong>
                    <p className="leading-relaxed">{storageTestResult.message}</p>
                    <p className="text-[11px] font-mono text-slate-600">
                      Target Bucket: <strong>{storageTestResult.bucket}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Config & Security rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Active Firebase Configuration
                  </span>
                  <div className="space-y-1 font-mono text-[11px] text-slate-700">
                    <p><strong>Project ID:</strong> peppy-command-tsjh2</p>
                    <p><strong>Database:</strong> ai-studio-habeevatussunnah-82bc6bd4-f134-4d7f-8c93-ccaec98a6570</p>
                    <p><strong>Storage Bucket:</strong> {storage.app.options.storageBucket || 'peppy-command-tsjh2.firebasestorage.app'}</p>
                    <p><strong>Auth:</strong> Email/Password + Google Admin Whitelist</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Firebase Storage Rules
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        const rules = `rules_version = '2';\nservice firebase.storage {\n  match /b/{bucket}/o {\n    match /products/{imageId} {\n      allow read: if true;\n      allow write: if request.resource.size < 25 * 1024 * 1024 && request.resource.contentType.matches('image/.*');\n    }\n    match /connection-test/{testId} {\n      allow read, write: if true;\n    }\n  }\n}`;
                        const ok = await copyToClipboard(rules);
                        if (ok) {
                          setRulesCopied(true);
                          showToast('Storage rules copied to clipboard!', 'success');
                          setTimeout(() => setRulesCopied(false), 3000);
                        }
                      }}
                      className="text-emerald-700 font-bold hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      {rulesCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{rulesCopied ? 'Copied' : 'Copy Rules'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-xl text-[10.5px] font-mono overflow-x-auto max-h-32">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{imageId} {
      allow read: if true;
      allow write: if request.resource.size < 25 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}`}
                  </pre>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                <strong className="block font-bold">100% Guaranteed Image Persistence:</strong>
                <p>
                  Every product photo uploaded directly from your mobile camera, gallery, or computer is stored permanently in Firebase and linked directly to your products. All photos remain available and visible across refreshes, reloads, and device switches.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================== */}
      {/* ADD / EDIT PRODUCT MODAL (WITH DIRECT IMAGE UPLOAD) */}
      {/* ===================================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-amber-500/20 p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {editingProductId ? 'Edit Product Details & Photos' : 'Add New Product to Store'}
                </h3>
              </div>

              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              {/* Product Title */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Royal Silk Maxi Dress with Gold Embroidery"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* DIRECT PRODUCT IMAGE UPLOADER (Phone & Computer) */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-black text-slate-800 block uppercase tracking-wider text-[11px]">
                  Direct Product Photos (Phone & Computer Uploads) *
                </span>
                <p className="text-[11px] text-slate-500 mb-3">
                  Upload multiple photos from your mobile camera, gallery, or computer. You can replace, remove, or choose the primary photo.
                </p>

                <ProductImageUploader
                  images={productForm.images}
                  mainImage={productForm.main_image}
                  onChange={(updatedImages, updatedMain) => {
                    setProductForm({
                      ...productForm,
                      images: updatedImages,
                      main_image: updatedMain
                    });
                  }}
                />
              </div>

              {/* Category, Subcategory, Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    required
                    value={productForm.category_id}
                    onChange={e => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subcategory</label>
                  <select
                    value={productForm.subcategory_id}
                    onChange={e => setProductForm({ ...productForm, subcategory_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="">None / General</option>
                    {subcategories
                      .filter(s => !productForm.category_id || s.category_id === productForm.category_id)
                      .map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Gender</label>
                  <select
                    value={productForm.gender}
                    onChange={e => setProductForm({ ...productForm, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              {/* Price, Discount Price, Stock, SKU */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Original Price (₦) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g. 25000"
                    required
                    value={productForm.price === '' ? '' : productForm.price}
                    onChange={e => {
                      const val = e.target.value;
                      setProductForm(prev => ({
                        ...prev,
                        price: val === '' ? '' : Number(val)
                      }));
                    }}
                    onFocus={e => {
                      e.target.select();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Sale Price (₦) <span className="text-slate-400 font-normal text-xs">(optional)</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g. 22000"
                    value={productForm.discount_price === '' ? '' : productForm.discount_price}
                    onChange={e => {
                      const val = e.target.value;
                      setProductForm(prev => ({
                        ...prev,
                        discount_price: val === '' ? '' : Number(val)
                      }));
                    }}
                    onFocus={e => {
                      e.target.select();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Warehouse Stock</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="10"
                    required
                    value={productForm.stock === '' ? '' : productForm.stock}
                    onChange={e => {
                      const val = e.target.value;
                      setProductForm(prev => ({
                        ...prev,
                        stock: val === '' ? '' : Number(val)
                      }));
                    }}
                    onFocus={e => {
                      e.target.select();
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sizes and Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.sizes_text}
                    onChange={e => setProductForm({ ...productForm, sizes_text: e.target.value })}
                    placeholder="e.g. S, M, L, XL or 38, 39, 40"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.colors_text}
                    onChange={e => setProductForm({ ...productForm, colors_text: e.target.value })}
                    placeholder="e.g. Emerald, Gold, Black, White"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detail fabric, cut, occasion, and elegance..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 leading-relaxed"
                />
              </div>

              {/* Badges / Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={e => setProductForm({ ...productForm, is_featured: e.target.checked })}
                    className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="font-bold text-slate-700">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is_new_arrival}
                    onChange={e => setProductForm({ ...productForm, is_new_arrival: e.target.checked })}
                    className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="font-bold text-slate-700">Mark as New Arrival</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{editingProductId ? 'SAVE CHANGES' : 'PUBLISH PRODUCT'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CONFIRMATION DIALOG MODAL */}
      {/* ===================================================================== */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900">{confirmDialog.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{confirmDialog.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
