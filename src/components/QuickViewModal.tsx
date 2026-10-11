import React, { useState } from 'react';
import { X, ShoppingBag, Zap, Heart, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatters';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (product: Product) => void;
  onProceedToCheckout: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewFullDetails,
  onProceedToCheckout
}) => {
  const { addToCart, wishlist, toggleWishlist, categories } = useShop();

  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.main_image);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  const categoryName = categories.find(c => c.id === product.category_id)?.name || 'Collection';
  const hasDiscount = Boolean(product.discount_price && product.discount_price < product.price);
  const effectivePrice = hasDiscount ? product.discount_price! : product.price;
  const isSaved = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between">
            <div className="aspect-4/5 rounded-2xl overflow-hidden bg-white border border-slate-200/80 flex items-center justify-center p-4 sm:p-5">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain object-center select-none"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all bg-white flex items-center justify-center p-1 ${
                      selectedImage === img ? 'border-emerald-700 ring-2 ring-emerald-700/20' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Order */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {categoryName} · {product.gender}
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-950 mt-1 leading-snug">
                {product.name}
              </h2>

              <div className="mt-2 flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-slate-950">
                  {formatPrice(effectivePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Sizes Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-800 block">Size</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-slate-950 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-800 block">Color</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedColor === color
                          ? 'bg-slate-950 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-4 bg-slate-950 hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isSaved ? 'border-rose-300 text-rose-600 bg-rose-50' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewFullDetails(product);
                }}
                className="w-full text-center text-xs font-bold text-blue-900 hover:underline py-1 flex items-center justify-center gap-1"
              >
                <span>View Complete Product Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
