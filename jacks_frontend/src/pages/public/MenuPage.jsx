import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaFire, FaLeaf, FaStar } from 'react-icons/fa';
import { HiChevronRight } from 'react-icons/hi';
import { menuAPI } from '../../services/api';
import MenuItemCard from '../../components/ui/MenuItemCard';
import SectionHeader from '../../components/ui/SectionHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const FALLBACK = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop';

// Slugs for categories that show subcategory variety cards first
const VARIETY_SLUGS = ['main-menu', 'drinks'];

function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Card for direct-item categories (Desserts, Kids Menu)
function DirectItemCard({ item }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col hover:border-pub-gold/40 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.imageUrl || FALLBACK}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
          onError={e => { e.target.src = FALLBACK; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pub-dark/70 to-transparent" />
        <div className="absolute bottom-3 right-3 bg-pub-gold text-pub-dark font-bold px-3 py-1 rounded-lg text-sm">
          ${parseFloat(item.price).toFixed(2)}
        </div>
      </div>
      <div className="p-4 flex-1">
        <h3 className="font-display text-pub-text font-semibold text-lg leading-tight">{item.name}</h3>
        {item.description && (
          <p className="text-stone-500 text-sm leading-relaxed mt-1">{item.description}</p>
        )}
        <div className="flex gap-1 mt-2 flex-wrap">
          {item.isPopular && <span className="bg-pub-gold/20 text-pub-gold text-xs px-2 py-0.5 rounded flex items-center gap-1"><FaStar size={10} /> Popular</span>}
          {item.isSpicy && <span className="bg-red-600/20 text-red-400 text-xs px-2 py-0.5 rounded flex items-center gap-1"><FaFire size={10} /> Spicy</span>}
          {item.isVegan && <span className="bg-green-600/20 text-green-400 text-xs px-2 py-0.5 rounded flex items-center gap-1"><FaLeaf size={10} /> Vegan</span>}
        </div>
      </div>
    </motion.div>
  );
}

// Subcategory variety card for Main Menu / Drinks
function VarietyCard({ name, count, imageUrl, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="relative h-60 cursor-pointer overflow-hidden rounded-xl border border-white/10 hover:border-pub-gold/50 transition-all duration-300 group"
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={e => { e.target.src = FALLBACK; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-pub-dark/90 via-pub-dark/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
        <div>
          <h3 className="font-display text-white text-2xl font-bold">{name}</h3>
          <p className="text-white/60 text-sm mt-1">{count} {count === 1 ? 'item' : 'items'}</p>
        </div>
        <div className="bg-pub-gold rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <HiChevronRight size={18} className="text-pub-dark" />
        </div>
      </div>
    </motion.div>
  );
}

// Table-style item card for variety detail view (2 columns)
function TableItemCard({ item }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-pub-gold/40 hover:shadow-md transition-all duration-200 flex gap-4 p-4">
      <img
        src={item.imageUrl || FALLBACK}
        alt={item.name}
        className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
        onError={e => { e.target.src = FALLBACK; }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-display text-pub-text font-semibold text-base leading-tight">{item.name}</h3>
          <span className="text-pub-gold font-bold text-base whitespace-nowrap">${parseFloat(item.price).toFixed(2)}</span>
        </div>
        {item.description && (
          <p className="text-stone-500 text-sm leading-relaxed mt-1 line-clamp-2">{item.description}</p>
        )}
        <div className="flex gap-1 mt-2 flex-wrap">
          {item.isPopular && <span className="bg-pub-gold/20 text-pub-gold text-xs px-1.5 py-0.5 rounded flex items-center gap-1"><FaStar size={9} /> Popular</span>}
          {item.isSpicy && <span className="bg-red-600/20 text-red-400 text-xs px-1.5 py-0.5 rounded flex items-center gap-1"><FaFire size={9} /> Spicy</span>}
          {item.isVegan && <span className="bg-green-600/20 text-green-400 text-xs px-1.5 py-0.5 rounded flex items-center gap-1"><FaLeaf size={9} /> Vegan</span>}
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCategorySlug, setActiveCategorySlug] = useState('all');
  const [activeVariety, setActiveVariety] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    Promise.all([
      menuAPI.getCategories().then(r => {
        setCategories(r.data);
        if (categoryParam) {
          const match = r.data.find(c => toSlug(c.name) === categoryParam);
          if (match) {
            setActiveCategory(match.id);
            setActiveCategorySlug(categoryParam);
          }
        }
      }),
      menuAPI.getAll().then(r => setItems(r.data)),
    ]).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!categoryParam) {
      setActiveCategory('all');
      setActiveCategorySlug('all');
      setActiveVariety(null);
      return;
    }
    const match = categories.find(c => toSlug(c.name) === categoryParam);
    if (match) {
      setActiveCategory(match.id);
      setActiveCategorySlug(categoryParam);
      setActiveVariety(null);
    }
  }, [categoryParam, categories]);

  const handleCategoryClick = (catId, catSlug) => {
    setActiveCategory(catId);
    setActiveCategorySlug(catSlug ?? 'all');
    setActiveVariety(null);
    setSearch('');
  };

  const categoryItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.categoryId === activeCategory);

  const isVarietyCategory = VARIETY_SLUGS.includes(activeCategorySlug);
  const isDirectCategory = activeCategory !== 'all' && !isVarietyCategory;

  // Group items by subcategory for variety view
  const grouped = {};
  categoryItems.forEach(item => {
    const key = item.subcategory || 'Other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  const getGroupImage = (groupItems) => {
    const withImg = groupItems.find(i => i.imageUrl);
    return withImg ? withImg.imageUrl : FALLBACK;
  };

  const varietyItems = activeVariety
    ? categoryItems.filter(i => (i.subcategory || 'Other') === activeVariety)
    : [];

  const searchFiltered = categoryItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative py-24 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-pub-light/90" />
        <div className="relative z-10 text-center">
          <SectionHeader subtitle="Explore" title="Our Menu" description="Fresh, locally sourced ingredients crafted with passion" light={true} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeCategory === 'all' ? 'bg-pub-gold text-white' : 'bg-white text-stone-600 hover:bg-pub-gold/10 border border-stone-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id, toSlug(cat.name))}
              className={`px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat.id ? 'bg-pub-gold text-white' : 'bg-white text-stone-600 hover:bg-pub-gold/10 border border-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* ALL view — flat grid with search */}
            {activeCategory === 'all' && (
              <>
                <div className="max-w-md mx-auto mb-8">
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white border border-stone-200 text-pub-text placeholder-stone-400 px-5 py-3 rounded-lg focus:outline-none focus:border-pub-gold shadow-sm"
                  />
                </div>
                {searchFiltered.length === 0 ? (
                  <div className="text-center text-stone-400 py-20">
                    <p className="text-xl">No items found</p>
                    <p className="text-sm mt-2">Try adjusting your search</p>
                  </div>
                ) : (
                  <motion.div
                    key={search}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {searchFiltered.map(item => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </motion.div>
                )}
              </>
            )}

            {/* DIRECT view — Desserts, Kids Menu: item cards with image + price */}
            {isDirectCategory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {categoryItems.length === 0 ? (
                  <div className="col-span-full text-center text-stone-400 py-20">
                    <p className="text-xl">No items in this category</p>
                  </div>
                ) : categoryItems.map(item => (
                  <DirectItemCard key={item.id} item={item} />
                ))}
              </motion.div>
            )}

            {/* VARIETY view — Main Menu, Drinks: subcategory grid */}
            {isVarietyCategory && !activeVariety && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Object.keys(grouped).length === 0 ? (
                  <div className="col-span-full text-center text-stone-400 py-20">
                    <p className="text-xl">No items in this category</p>
                  </div>
                ) : Object.entries(grouped).map(([subcat, subcatItems]) => (
                  <VarietyCard
                    key={subcat}
                    name={subcat}
                    count={subcatItems.length}
                    imageUrl={getGroupImage(subcatItems)}
                    onClick={() => setActiveVariety(subcat)}
                  />
                ))}
              </motion.div>
            )}

            {/* VARIETY DETAIL view — 2-column tabular items */}
            {isVarietyCategory && activeVariety && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setActiveVariety(null)}
                  className="flex items-center gap-2 text-pub-gold hover:text-pub-gold/80 mb-8 font-semibold text-sm uppercase tracking-wider transition-colors"
                >
                  <FaArrowLeft size={14} /> Back to Categories
                </button>
                <h2 className="font-display text-pub-text text-3xl font-bold mb-8">{activeVariety}</h2>
                {varietyItems.length === 0 ? (
                  <div className="text-center text-stone-400 py-20">
                    <p className="text-xl">No items found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {varietyItems.map(item => (
                      <TableItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
