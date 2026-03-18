import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTag, FaTimes } from 'react-icons/fa';
import { promotionAPI } from '../../services/api';

const FALLBACK = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=300&fit=crop';

export default function SpecialsPopup() {
  const [visible, setVisible] = useState(false);
  const [specials, setSpecials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem('specials_popup_shown')) return;

    promotionAPI.getActive()
      .then(r => {
        const items = r.data.slice(0, 3);
        if (items.length > 0) {
          setSpecials(items);
          // Slight delay so page loads first
          setTimeout(() => setVisible(true), 800);
        }
      })
      .catch(() => {});
  }, []);

  const close = () => {
    setVisible(false);
    sessionStorage.setItem('specials_popup_shown', '1');
  };

  const goToSpecials = () => {
    close();
    navigate('/promotions');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-pub-dark/60 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={e => { e.stopPropagation(); goToSpecials(); }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden cursor-pointer"
          >
            {/* Header */}
            <div className="bg-pub-dark px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pub-gold rounded-full flex items-center justify-center">
                  <FaTag size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-pub-gold text-xs uppercase tracking-widest font-semibold">Don't miss out</p>
                  <h2 className="font-display text-white text-xl font-bold">Today's Specials</h2>
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); close(); }}
                className="text-white/50 hover:text-white transition-colors p-1"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Specials list */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {specials.map(promo => (
                <div key={promo.id} className="flex gap-4 items-start bg-pub-light rounded-xl overflow-hidden border border-stone-200">
                  <div className="w-24 h-20 flex-shrink-0 overflow-hidden">
                    <img
                      src={promo.imageUrl || FALLBACK}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = FALLBACK; }}
                    />
                  </div>
                  <div className="py-3 pr-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-pub-gold text-white text-xs font-bold px-2 py-0.5 rounded">
                        {promo.discount}
                      </span>
                    </div>
                    <h3 className="font-display text-pub-text font-semibold text-base">{promo.title}</h3>
                    <p className="text-stone-500 text-sm line-clamp-2 mt-0.5">{promo.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={e => { e.stopPropagation(); goToSpecials(); }}
                className="flex-1 btn-primary text-center"
              >
                View All Specials
              </button>
              <button
                onClick={e => { e.stopPropagation(); close(); }}
                className="flex-1 border-2 border-stone-300 text-stone-600 font-semibold px-6 py-3 rounded-sm hover:bg-stone-100 transition-all duration-200 uppercase tracking-wider text-sm"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
