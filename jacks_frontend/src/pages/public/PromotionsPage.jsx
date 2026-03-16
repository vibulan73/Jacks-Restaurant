import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaTag, FaSun, FaStar } from 'react-icons/fa';
import { promotionAPI } from '../../services/api';
import SectionHeader from '../../components/ui/SectionHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const FALLBACK = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop';

const TABS = [
  { key: 'ALL',     label: 'All Promotions', icon: FaTag },
  { key: 'DAILY',   label: 'Daily Promotions', icon: FaSun },
  { key: 'SPECIAL', label: 'Special Promotions', icon: FaStar },
];

function PromoCard({ promo, index }) {
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-pub-brown/60 border border-white/10 rounded-xl overflow-hidden hover:border-pub-gold/40 transition-all duration-300 group flex flex-col"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={promo.imageUrl || FALLBACK}
          alt={promo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = FALLBACK; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pub-dark/70 to-transparent" />
        <div className="absolute top-4 right-4 bg-pub-gold text-pub-dark font-bold px-3 py-1.5 rounded flex items-center gap-2 text-sm">
          <FaTag size={12} />
          {promo.discount}
        </div>
        {promo.promotionType && (
          <div className={`absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
            promo.promotionType === 'DAILY'
              ? 'bg-blue-500/90 text-white'
              : 'bg-purple-500/90 text-white'
          }`}>
            {promo.promotionType === 'DAILY' ? <FaSun size={10} /> : <FaStar size={10} />}
            {promo.promotionType === 'DAILY' ? 'Daily' : 'Special'}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-white text-2xl font-bold mb-3">{promo.title}</h3>
        <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">{promo.description}</p>
        {promo.endDate && (
          <div className="flex items-center gap-2 text-white/40 text-xs mb-4">
            <FaCalendarAlt className="text-pub-gold" />
            <span>Valid until {formatDate(promo.endDate)}</span>
          </div>
        )}
        <Link to="/reservation" className="btn-primary text-center">Book Now</Link>
      </div>
    </motion.div>
  );
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const [activeTab, setActiveTab] = useState(typeParam && ['DAILY','SPECIAL'].includes(typeParam) ? typeParam : 'ALL');

  // Sync tab if URL param changes (e.g. navbar link clicked again)
  useEffect(() => {
    if (typeParam && ['DAILY','SPECIAL'].includes(typeParam)) setActiveTab(typeParam);
    else if (!typeParam) setActiveTab('ALL');
  }, [typeParam]);

  useEffect(() => {
    promotionAPI.getActive()
      .then(r => setPromotions(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'ALL'
    ? promotions
    : promotions.filter(p => p.promotionType === activeTab);

  return (
    <div className="min-h-screen pt-20">
      <div className="relative py-24 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-pub-dark/80" />
        <div className="relative z-10 text-center">
          <SectionHeader subtitle="Deals & Specials" title="Current Promotions" description="Take advantage of our exclusive offers" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeTab === key
                  ? 'bg-pub-gold text-pub-dark'
                  : 'bg-pub-brown/60 text-white/70 hover:bg-pub-gold/20 border border-white/10'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            <p className="text-xl">No active promotions at the moment</p>
            <p className="text-sm mt-2">Check back soon for new deals!</p>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((promo, i) => (
              <PromoCard key={promo.id} promo={promo} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
