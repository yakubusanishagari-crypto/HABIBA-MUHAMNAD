import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getLocalizedCategoryName } from '../utils/translations';

interface FeaturedCategoriesProps {
  onSelectCategory: (categoryId: string, gender?: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const { categories, language, t } = useShop();

  // Curated category items with high visual appeal
  const categoryTiles = [
    {
      id: 'cat-women',
      defaultName: 'WOMEN',
      subtitle: language === 'ha' ? 'Dogayen riguna, abaya & mayafai' : language === 'ar' ? 'فساتين، عبايات وأزياء نسائية' : 'Dresses, Abayas & Fashion',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      gender: 'Women'
    },
    {
      id: 'cat-men',
      defaultName: 'MEN',
      subtitle: language === 'ha' ? 'Riguna, wanduna & shadda' : language === 'ar' ? 'قمصان، بناطيل وأزياء رجالية' : 'Shirts, Pants & Native Wear',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      gender: 'Men'
    },
    {
      id: 'cat-kids',
      defaultName: 'KIDS',
      subtitle: language === 'ha' ? 'Suturar yara maza da mata' : language === 'ar' ? 'تشكيلة الأولاد والبنات' : 'Boys & Girls Wardrobe',
      image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80',
      gender: 'Kids'
    },
    {
      id: 'cat-shoes',
      defaultName: 'SHOES',
      subtitle: language === 'ha' ? 'Takalman motsi, silifas & heels' : language === 'ar' ? 'أحذية رياضية، رسمية وصنادل' : 'Sneakers, Heels & Sandals',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cat-bags',
      defaultName: 'BAGS',
      subtitle: language === 'ha' ? 'Jakunkunan mata na zamani' : language === 'ar' ? 'حقائب يد وظهر راقية' : 'Handbags & Backpacks',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cat-jewelry',
      defaultName: 'JEWELRY',
      subtitle: language === 'ha' ? 'Agogo & awarwaron alfarma' : language === 'ar' ? 'ساعات ومجوهرات فاخرة' : 'Watches & Fine Pieces',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cat-cosmetics',
      defaultName: 'COSMETICS',
      subtitle: language === 'ha' ? 'Kayan kwalliya & gyaran fata' : language === 'ar' ? 'مستحضرات تجميل وعناية' : 'Beauty & Skincare Care',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cat-home',
      defaultName: 'HOME & KITCHEN',
      subtitle: language === 'ha' ? 'Zannuwan gado & kayan kicin' : language === 'ar' ? 'مفارش سرير وأدوات مطبخ' : 'Beds, Organizers & Living',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="featured-categories" className="py-16 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 block mb-1">
              {t.curatedCollections || 'Curated Collections'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.featuredCategoriesTitle || 'Featured Categories'}
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('')}
            className="text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 group cursor-pointer"
          >
            <span>{t.browseAllCatalogue || 'Browse Full Catalogue'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 8-Grid Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categoryTiles.map(item => {
            const existingCat = categories.find(c => c.id === item.id);
            const displayName = existingCat
              ? getLocalizedCategoryName(existingCat, language)
              : item.defaultName;
            const displayImg = existingCat?.image_url || item.image;

            return (
              <button
                key={item.id}
                onClick={() => onSelectCategory(item.id, item.gender)}
                className="group relative text-left rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-3/4 flex flex-col justify-end p-5 bg-slate-900 focus:outline-none cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={displayImg}
                  alt={displayName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-95"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide uppercase">
                    {displayName}
                  </h3>
                  <p className="text-xs text-sky-200 mt-0.5 line-clamp-1 font-medium">
                    {item.subtitle}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t.shopNow || 'Shop Collection'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
