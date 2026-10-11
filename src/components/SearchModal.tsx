import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ArrowRight, Tag, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryId: string) => void;
}

const POPULAR_SEARCH_TERMS = [
  'Royal Silk Dress',
  'Urban Sneaker',
  'Leather Handbag',
  'Gold Jewelry',
  'Oxford Shirt',
  'Duvet Bed Set',
  'Kids Trainers'
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory
}) => {
  const { products, categories } = useShop();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('habeevat_recent_searches');
      return saved ? JSON.parse(saved) : ['Dress', 'Sneakers', 'Handbag'];
    } catch {
      return ['Dress', 'Sneakers', 'Handbag'];
    }
  });

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter(t => t.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('habeevat_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.sku.toLowerCase().includes(lower) ||
        p.gender.toLowerCase().includes(lower) ||
        categories.find(c => c.id === p.category_id)?.name.toLowerCase().includes(lower)
    );
  }, [query, products, categories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && query.trim()) {
                saveRecentSearch(query);
              }
            }}
            placeholder="Search fashion, footwear, dresses, bags, jewelry, beauty..."
            className="w-full text-slate-950 placeholder-slate-400 text-sm sm:text-base font-semibold focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-lg bg-slate-100"
          >
            ESC
          </button>
        </div>

        {/* Search Content */}
        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6">
          {!query.trim() ? (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(term);
                          saveRecentSearch(term);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-900" />
                  <span>Trending Suggestions</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCH_TERMS.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(term);
                        saveRecentSearch(term);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 text-xs font-bold transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Categories */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2.5">
                  Explore By Department
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCategory(c.id);
                        onClose();
                      }}
                      className="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 hover:text-sky-900 text-xs font-bold text-slate-800 transition-colors border border-slate-100"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-bold text-slate-900">No products matching "{query}"</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Check for typos or browse our main departments below.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {categories.slice(0, 4).map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCategory(c.id);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-xs font-bold text-slate-700 transition-colors"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                <span>Matching Items ({filteredProducts.length})</span>
                <span>Press Enter to Save Search</span>
              </div>
              {filteredProducts.map(product => {
                const effectivePrice = product.discount_price || product.price;
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      saveRecentSearch(query);
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={product.main_image}
                        alt={product.name}
                        className="w-14 h-16 rounded-xl object-contain p-1 bg-slate-50 shrink-0 border border-slate-200/80"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-950 group-hover:text-blue-900 transition-colors">
                          {product.name}
                        </h4>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{product.gender}</span>
                          <span>·</span>
                          <span>SKU: {product.sku}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-950 block">
                        {formatPrice(effectivePrice)}
                      </span>
                      <span className="text-xs text-blue-900 font-bold group-hover:underline flex items-center justify-end gap-1 mt-0.5">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
