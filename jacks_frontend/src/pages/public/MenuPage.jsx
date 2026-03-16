import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { menuAPI } from '../../services/api';
import MenuItemCard from '../../components/ui/MenuItemCard';
import SectionHeader from '../../components/ui/SectionHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category'); // e.g. "main-menu", "drinks"

  useEffect(() => {
    Promise.all([
      menuAPI.getCategories().then(r => {
        setCategories(r.data);
        if (categoryParam) {
          // Match slug to category name (e.g. "main-menu" → "Main Menu")
          const match = r.data.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === categoryParam);
          if (match) setActiveCategory(match.id);
        }
      }),
      menuAPI.getAll().then(r => setItems(r.data)),
    ]).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Re-select category if URL param changes after initial load
  useEffect(() => {
    if (!categoryParam) { setActiveCategory('all'); return; }
    const match = categories.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === categoryParam);
    if (match) setActiveCategory(match.id);
  }, [categoryParam, categories]);

  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'all' || item.categoryId === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative py-24 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-pub-dark/80" />
        <div className="relative z-10 text-center">
          <SectionHeader subtitle="Explore" title="Our Menu" description="Fresh, locally sourced ingredients crafted with passion" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-pub-brown/60 border border-white/20 text-white placeholder-white/40 px-5 py-3 rounded-lg focus:outline-none focus:border-pub-gold"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeCategory === 'all' ? 'bg-pub-gold text-pub-dark' : 'bg-pub-brown/60 text-white/70 hover:bg-pub-gold/20 border border-white/10'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat.id ? 'bg-pub-gold text-pub-dark' : 'bg-pub-brown/60 text-white/70 hover:bg-pub-gold/20 border border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            <p className="text-xl">No items found</p>
            <p className="text-sm mt-2">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <motion.div
            key={`${activeCategory}-${search}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
