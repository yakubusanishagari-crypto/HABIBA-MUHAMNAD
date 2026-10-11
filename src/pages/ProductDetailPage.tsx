import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Zap,
  Share2,
  Check,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Truck,
  MessageCircle,
  Heart,
  Star,
  RefreshCw,
  Info
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice, copyToClipboard } from '../utils/formatters';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onViewProduct: (product: Product) => void;
  onBuyNow: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onViewProduct,
  onBuyNow
}) => {
  const { categories, addToCart, products, settings, showToast, wishlist, toggleWishlist } = useShop();

  const [selectedImage, setSelectedImage] = useState(product.main_image);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [shareCopied, setShareCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'returns'>('details');

  useEffect(() => {
    setSelectedImage(product.main_image);
    setSelectedSize(product.sizes?.[0] || '');
    setSelectedColor(product.colors?.[0] || '');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const category = categories.find(c => c.id === product.category_id);
  const categoryName = category?.name || 'Collection';

  // Variant resolution
  const matchedVariant = product.variants?.find(
    v =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor)
  );

  const effectiveStock = matchedVariant ? matchedVariant.stock : product.stock;
  const isOutOfStock = effectiveStock <= 0;
  const isLowStock = effectiveStock > 0 && effectiveStock <= 5;

  const basePrice = matchedVariant?.price || product.price;
  const hasDiscount = Boolean(product.discount_price && product.discount_price < basePrice);
  const effectivePrice = hasDiscount ? product.discount_price! : basePrice;

  const discountPercent = hasDiscount
    ? Math.round(((basePrice - product.discount_price!) / basePrice) * 100)
    : 0;

  const isSaved = wishlist.includes(product.id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    onBuyNow();
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Explore "${product.name}" at Habeevatussunnah Online Business for ${formatPrice(effectivePrice)}!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        // Fallback
      }
    }

    const success = await copyToClipboard(`${shareText} ${shareUrl}`);
    if (success) {
      setShareCopied(true);
      showToast('Product link copied to clipboard!', 'success');
      setTimeout(() => setShareCopied(false), 3000);
    }
  };

  const handleWhatsAppInquiry = () => {
    const text = `Hello Habeevatussunnah Online Business, I am interested in purchasing:
Product: ${product.name}
SKU: ${matchedVariant?.sku || product.sku}
Price: ${formatPrice(effectivePrice)}
Selected Size: ${selectedSize || 'N/A'}
Selected Color: ${selectedColor || 'N/A'}

Could you please confirm availability and delivery?`;
    const cleanNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category_id === product.category_id && p.status === 'active')
    .slice(0, 4);

  return (
    <div className="py-10 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-800 hover:text-blue-900 font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-600">{categoryName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-600">{product.gender}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Gallery Column (6 cols) */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-28">
            <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-slate-50/80 border border-slate-200/80 shadow-md flex items-center justify-center p-3 sm:p-5">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain object-center transition-transform duration-300 hover:scale-105"
                decoding="async"
              />
              {product.is_new_arrival && (
                <div className="absolute top-4 left-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center shadow-sm">
                  <span>NEW RELEASE</span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all shadow-md ${
                  isSaved
                    ? 'bg-white text-rose-600'
                    : 'bg-white/90 backdrop-blur-xs text-slate-700 hover:text-rose-600 hover:bg-white'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all bg-white flex items-center justify-center p-1 ${
                      selectedImage === img
                        ? 'border-slate-950 ring-2 ring-slate-950/20'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Ordering Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {/* Category, Gender, Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
                  {categoryName} · {product.gender} COLLECTION
                </span>

                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.9</span>
                  <span className="text-slate-400 font-normal">(Verified Quality)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight font-sans">
                {product.name}
              </h1>

              {/* Price & Savings */}
              <div className="mt-4 flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono">
                  {formatPrice(effectivePrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      {formatPrice(basePrice)}
                    </span>
                    <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                      SAVE {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status Badge */}
              <div className="mt-2.5 text-xs font-semibold">
                {isOutOfStock ? (
                  <span className="text-rose-600 font-bold">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="text-amber-600 font-bold">Low Stock: Only {effectiveStock} items available</span>
                ) : (
                  <span className="text-emerald-700 font-bold">In Stock ({effectiveStock} units ready for dispatch)</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Size Variants */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Select Size</span>
                  <span className="text-slate-500">Chosen: <strong className="text-slate-900">{selectedSize}</strong></span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-11 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-slate-950 text-white shadow-md'
                          : 'bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Variants */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Select Color</span>
                  <span className="text-slate-500">Chosen: <strong className="text-slate-900">{selectedColor}</strong></span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        selectedColor === color
                          ? 'bg-slate-950 text-white shadow-md'
                          : 'bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Primary Action Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-800">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-black text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(effectiveStock, q + 1))}
                    disabled={quantity >= effectiveStock}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-950 hover:bg-blue-900 text-white active:scale-[0.99]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.99]'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Secondary Actions: WhatsApp & Share */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-200 bg-emerald-50/60 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-current" />
                  <span>Inquire via WhatsApp</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {shareCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-slate-500" />
                      <span>Share Product</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Information Tabs (Specifications, Delivery, Returns) */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex border-b border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 px-3 border-b-2 transition-colors ${
                    activeTab === 'details' ? 'border-slate-950 text-slate-950' : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 px-3 border-b-2 transition-colors ${
                    activeTab === 'shipping' ? 'border-slate-950 text-slate-950' : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Nationwide Delivery
                </button>
                <button
                  onClick={() => setActiveTab('returns')}
                  className={`pb-2 px-3 border-b-2 transition-colors ${
                    activeTab === 'returns' ? 'border-slate-950 text-slate-950' : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Guarantees
                </button>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed p-2">
                {activeTab === 'details' && (
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li>SKU Code: <strong>{matchedVariant?.sku || product.sku}</strong></li>
                    <li>Collection: <strong>{product.gender}</strong></li>
                    <li>Department: <strong>{categoryName}</strong></li>
                    <li>Authenticity: 100% Genuine, Hand-checked standard</li>
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <p>
                    Fast delivery across Nigeria. Orders confirmed via WhatsApp are packaged and dispatched immediately with express waybill or doorstep courier.
                  </p>
                )}
                {activeTab === 'returns' && (
                  <p>
                    Inspect your items upon arrival. Any defect or incorrect specification is replaced promptly via our dedicated WhatsApp customer desk (+2348034343283).
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-slate-100">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mb-8 font-sans">
              Curated Recommendations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onViewProduct={onViewProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
