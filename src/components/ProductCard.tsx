import React from 'react';
import { ShoppingBag, Eye, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';
import { useShop } from '../context/ShopContext';
import { getLocalizedProductName, getLocalizedCategoryName } from '../utils/translations';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onViewProduct }) => {
  const { addToCart, categories, wishlist, toggleWishlist, setQuickViewProduct, language, t } = useShop();

  const matchedCat = categories.find(c => c.id === product.category_id);
  const categoryName = matchedCat ? getLocalizedCategoryName(matchedCat, language) : 'Collection';
  const localizedTitle = getLocalizedProductName(product, language);
  const hasDiscount = Boolean(product.discount_price && product.discount_price < product.price);
  const effectivePrice = hasDiscount ? product.discount_price! : product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isSaved = wishlist.includes(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = product.sizes?.[0];
    const defaultColor = product.colors?.[0];
    addToCart(product, defaultSize, defaultColor, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      onClick={() => onViewProduct(product)}
      className="group relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform-gpu"
    >
      {/* Image Container with Consistent Ratio */}
      <div className="relative aspect-4/5 w-full bg-slate-50/80 overflow-hidden flex items-center justify-center p-3 sm:p-4">
        <img
          src={product.main_image}
          alt={product.name}
          className="w-full h-full object-contain object-center transition-transform duration-300 ease-out select-none"
          loading="lazy"
          decoding="async"
        />

        {/* Top Badges Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.is_new_arrival && (
            <span className="bg-slate-950 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              NEW
            </span>
          )}
          {hasDiscount && (
            <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Top Actions Right: Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-sm ${
            isSaved
              ? 'bg-white text-rose-600'
              : 'bg-white/80 backdrop-blur-xs text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-10">
          <button
            type="button"
            onClick={handleQuickView}
            className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-xs hover:bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content Block */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Subtle Metadata (Category and Gender) */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mb-1 tracking-wide uppercase">
            <span>{categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>{product.gender}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-950 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
            {localizedTitle}
          </h3>

          {/* Stock Indicator */}
          <div className="mt-1 text-[11px]">
            {isOutOfStock ? (
              <span className="text-rose-600 font-bold">{t.outOfStock || 'Out of Stock'}</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-semibold">{t.lowStock || 'Low Stock'} ({product.stock} {t.unitsLeft || 'left'})</span>
            ) : (
              <span className="text-emerald-700 font-medium">{t.inStock || 'In Stock'}</span>
            )}
          </div>
        </div>

        {/* Price & Actions (ORDER Button) */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black text-slate-950">
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Clearly Visible ORDER Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewProduct(product);
              }}
              className="px-3.5 py-2 bg-[#07132B] hover:bg-blue-900 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              title={`Order ${product.name}`}
            >
              <span>ORDER</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            </button>

            {/* Quick Add to Cart Button */}
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-800 hover:bg-sky-50 hover:text-blue-900 active:scale-95'
              }`}
              title={isOutOfStock ? 'Out of stock' : 'Quick add to bag'}
              aria-label="Add to bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
