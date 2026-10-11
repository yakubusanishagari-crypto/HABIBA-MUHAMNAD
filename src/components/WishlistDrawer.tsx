import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  onViewProduct
}) => {
  const { wishlist, toggleWishlist, products, addToCart } = useShop();

  if (!isOpen) return null;

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-current" />
            <h2 className="text-base font-black text-slate-950">
              Saved Wishlist ({savedProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Save your favorite fashion items, shoes, and jewelry to review or purchase anytime.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedProducts.map(product => {
                const effectivePrice = product.discount_price || product.price;
                return (
                  <div key={product.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                    <img
                      src={product.main_image}
                      alt={product.name}
                      className="w-18 h-18 rounded-xl object-contain p-1 bg-white shrink-0 border border-slate-200"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {product.name}
                      </h4>
                      <div className="text-xs font-black text-blue-950 mt-1">
                        {formatPrice(effectivePrice)}
                      </div>

                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(product);
                            toggleWishlist(product.id);
                          }}
                          className="px-3 py-1.5 bg-slate-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Cart</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Continue Browsing Collections
          </button>
        </div>
      </div>
    </div>
  );
};
