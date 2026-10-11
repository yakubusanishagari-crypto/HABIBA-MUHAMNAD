import React, { useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { Product, SortOption } from '../types';
import { Filter, SlidersHorizontal, RotateCcw, Search, ChevronDown } from 'lucide-react';

interface ProductsPageProps {
  onViewProduct: (product: Product) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (subId: string) => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  pageTitle?: string;
  pageSubtitle?: string;
  isNewArrivalOnly?: boolean;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onViewProduct,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedGender,
  setSelectedGender,
  pageTitle = 'All Products',
  pageSubtitle = 'Browse our complete premium fashion, footwear, beauty and lifestyle collection',
  isNewArrivalOnly = false
}) => {
  const { products, categories, subcategories } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [availability, setAvailability] = useState<'all' | 'in-stock' | 'low-stock'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(70000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available subcategories for selected category
  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return subcategories.filter(s => s.category_id === selectedCategory);
  }, [subcategories, selectedCategory]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (product.status !== 'active') return false;

      // New arrivals filter
      if (isNewArrivalOnly && !product.is_new_arrival) {
        return false;
      }

      // Category filter
      if (selectedCategory && product.category_id !== selectedCategory) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory && product.subcategory_id !== selectedSubcategory) {
        return false;
      }

      // Gender filter
      if (selectedGender && selectedGender !== 'all' && product.gender !== selectedGender && product.gender !== 'Unisex') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesSku) return false;
      }

      // Price filter
      const effectivePrice = product.discount_price || product.price;
      if (effectivePrice > maxPriceFilter) {
        return false;
      }

      // Availability filter
      if (availability === 'in-stock' && product.stock <= 0) {
        return false;
      }
      if (availability === 'low-stock' && (product.stock <= 0 || product.stock > 5)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discount_price || a.price;
      const priceB = b.discount_price || b.price;

      if (sortBy === 'price-low-to-high') return priceA - priceB;
      if (sortBy === 'price-high-to-low') return priceB - priceA;
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'featured') return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      if (sortBy === 'popular') return (b.stock) - (a.stock);
      // Default newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [products, selectedCategory, selectedSubcategory, selectedGender, searchQuery, maxPriceFilter, availability, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedGender('all');
    setSearchQuery('');
    setAvailability('all');
    setMaxPriceFilter(70000);
    setSortBy('newest');
  };

  const hasActiveFilters = Boolean(
    selectedCategory ||
    selectedSubcategory ||
    (selectedGender && selectedGender !== 'all') ||
    searchQuery ||
    availability !== 'all' ||
    maxPriceFilter < 70000 ||
    sortBy !== 'newest'
  );

  return (
    <div className="py-10 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curated Editorial Collection Header */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-700 block">
              HABEEVATUSSUNNAH COLLECTION
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight font-sans">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              {pageSubtitle}
            </p>
          </div>

          {/* Quick Department Filter Strip if Women or Kids */}
          {selectedGender === 'Women' && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-400 self-center mr-1">Browse Women's:</span>
              {[
                { label: 'All Women', catId: '' },
                { label: 'Dresses', catId: 'cat-women' },
                { label: 'Shoes & Heels', catId: 'cat-shoes' },
                { label: 'Handbags', catId: 'cat-bags' },
                { label: 'Jewelry & Watches', catId: 'cat-jewelry' },
                { label: 'Cosmetics', catId: 'cat-cosmetics' }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => setSelectedCategory(item.catId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedCategory === item.catId
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {selectedGender === 'Kids' && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-400 self-center mr-1">Kids Departments:</span>
              {[
                { label: 'All Kids', subId: '' },
                { label: 'Boys Collection', subId: 'sub-kids-boys' },
                { label: 'Girls Collection', subId: 'sub-kids-girls' },
                { label: 'Kids Footwear', subId: 'sub-kids-shoes' },
                { label: 'Kids Bags', subId: 'sub-kids-bags' }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => setSelectedSubcategory(item.subId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedSubcategory === item.subId
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Top Controls Bar: Search, Sort & Mobile Filter Toggle */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU or keyword..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap hidden sm:inline uppercase tracking-wider">
                Sort:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low-to-high">Price: Low to High</option>
                  <option value="price-high-to-low">Price: High to Low</option>
                  <option value="popular">Popularity / Stock</option>
                  <option value="featured">Featured First</option>
                  <option value="oldest">Oldest</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(prev => !prev)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-xl transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6 bg-white p-6 rounded-3xl border border-slate-200/90 h-fit shadow-xs`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-900" />
                <span>Filters</span>
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-blue-900 hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">Gender</span>
              <div className="grid grid-cols-2 gap-1.5">
                {['all', 'Men', 'Women', 'Kids'].map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-colors ${
                      selectedGender === g
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {g === 'all' ? 'All Genders' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Filter */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">Categories</span>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSubcategory('');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    !selectedCategory ? 'bg-blue-50 text-blue-950' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.id);
                      setSelectedSubcategory('');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedCategory === c.id
                        ? 'bg-blue-50 text-blue-950'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories (if Category selected) */}
            {availableSubcategories.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">Subcategories</span>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedSubcategory('')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      !selectedSubcategory ? 'text-blue-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Subcategories
                  </button>
                  {availableSubcategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(sub.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        selectedSubcategory === sub.id ? 'text-blue-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      • {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Max Budget</span>
                <span className="font-black text-slate-950 font-mono">₦{maxPriceFilter.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="70000"
                step="5000"
                value={maxPriceFilter}
                onChange={e => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-slate-950"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₦10,000</span>
                <span>₦70,000</span>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">Availability</span>
              <div className="space-y-1 text-xs">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'in-stock', label: 'In Stock Only' },
                  { id: 'low-stock', label: 'Low Stock (< 5 left)' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === opt.id}
                      onChange={() => setAvailability(opt.id as any)}
                      className="accent-slate-950"
                    />
                    <span className="text-slate-700 font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid / Empty State */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
              <span>Showing <strong>{filteredProducts.length}</strong> items</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No items match your criteria</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your price range or resetting filters to browse all available pieces.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-6 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-900"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewProduct={onViewProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
