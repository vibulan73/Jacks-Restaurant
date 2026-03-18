import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaClock, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { menuAPI, promotionAPI } from '../../services/api';
import MenuItemCard from '../../components/ui/MenuItemCard';
import SectionHeader from '../../components/ui/SectionHeader';
import SpecialsPopup from '../../components/ui/SpecialsPopup';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const reviews = [
  { name: 'Sarah M.', rating: 5, text: 'Absolutely love this place! The wings are the best in Adelaide and the atmosphere is incredible.', date: '2 weeks ago' },
  { name: 'James T.', rating: 5, text: "Jack's Norwood is our go-to spot for Friday nights. Amazing burgers and fantastic live music!", date: '1 month ago' },
  { name: 'Emily R.', rating: 5, text: 'The staff are so friendly and the food is always fresh. The cocktails are to die for!', date: '3 weeks ago' },
  { name: 'Michael K.', rating: 4, text: 'Great pub with a proper local feel. Love the sports nights and the Happy Hour deals.', date: '1 week ago' },
];

export default function HomePage() {
  const [popularItems, setPopularItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    Promise.all([
      menuAPI.getPopular().then(r => setPopularItems(r.data.slice(0, 6))),
      promotionAPI.getActive().then(r => setPromotions(r.data.slice(0, 3))),
    ])
      .catch(console.error)
      .finally(() => setLoadingMenu(false));
  }, []);

  return (
    <div>
      {/* Specials popup — shows once per session */}
      <SpecialsPopup />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-pub-light/95" />

        {/* Floating decorative circles */}
        <motion.div
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.45, 0.2] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute top-1/4 left-16 w-24 h-24 rounded-full border border-pub-gold/30 hidden lg:block pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 14, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-1/3 right-20 w-16 h-16 rounded-full bg-pub-gold/15 hidden lg:block pointer-events-none"
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-subtitle"
          >
            Welcome to
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-tight mb-4 drop-shadow-lg"
          >
            Jack's{' '}
            <span className="text-gradient">Norwood</span>
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '4rem' }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="h-0.5 bg-pub-gold mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-white/90 text-xl md:text-2xl font-light mb-10 drop-shadow"
          >
            Your Neighbourhood Pub &amp; Restaurant
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/menu" className="btn-primary">View Our Menu</Link>
            <Link to="/promotions" className="btn-outline">View Specials</Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 text-xs uppercase tracking-widest"
        >
          <span>Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </section>

      {/* TODAY'S SPECIALS */}
      {promotions.length > 0 && (
        <section className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader subtitle="Limited Time" title="Today's Specials" description="Take advantage of our exclusive deals" />
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {promotions.map((promo) => (
                <motion.div key={promo.id} variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-pub-gold/40 hover:shadow-lg transition-all duration-300 group">
                  {promo.imageUrl && (
                    <div className="h-44 overflow-hidden">
                      <img src={promo.imageUrl} alt={promo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="inline-block bg-pub-gold text-white font-bold text-sm px-3 py-1 rounded mb-3">
                      {promo.discount}
                    </div>
                    <h3 className="font-display text-pub-text text-xl font-semibold mb-2">{promo.title}</h3>
                    <p className="text-stone-500 text-sm mb-4">{promo.description}</p>
                    <Link to="/promotions" className="text-pub-gold text-sm font-semibold hover:underline">
                      View All Specials →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* POPULAR MENU */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Our Favourites" title="Popular Menu Items" description="Crowd-pleasing dishes that keep our guests coming back" />
          {loadingMenu ? (
            <div className="text-center text-stone-400 py-10">Loading menu...</div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {popularItems.map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <MenuItemCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
          <div className="text-center mt-10">
            <Link to="/menu" className="btn-outline">View Full Menu</Link>
          </div>
        </div>
      </section>

      {/* ABOUT SNIPPET */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <p className="section-subtitle">Our Story</p>
              <h2 className="section-title">A True Norwood Landmark</h2>
              <div className="gold-divider ml-0"></div>
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                Jack's Norwood has been the heart of the community since the day we opened our doors.
                We believe in good food, honest drinks, and a warm welcome for everyone who walks through our door.
              </p>
              <p className="text-stone-500 leading-relaxed mb-8">
                Whether you're stopping in for a cold one after work, celebrating a special occasion, or
                bringing the family for Sunday lunch — Jack's is your home away from home.
              </p>
              <Link to="/about" className="btn-outline">Our Story</Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { src: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&h=300&fit=crop', alt: 'Bar', cls: '' },
                { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', alt: 'Food', cls: 'mt-6' },
                { src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop', alt: 'Drinks', cls: '-mt-6' },
                { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop', alt: 'Atmosphere', cls: '' },
              ].map(({ src, alt, cls }) => (
                <motion.img
                  key={alt}
                  whileHover={{ scale: 1.04 }}
                  src={src}
                  alt={alt}
                  className={`rounded-xl h-48 w-full object-cover shadow-md ${cls}`}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="What People Say" title="Customer Reviews" />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {reviews.map((review, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 8px 30px rgba(0,0,0,0.10)' }}
                className="bg-white border border-stone-200 rounded-xl p-6 hover:border-pub-gold/30 transition-all duration-300">
                <FaQuoteLeft className="text-pub-gold/30 text-3xl mb-4" />
                <p className="text-stone-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(review.rating)].map((_, j) => (
                    <FaStar key={j} className="text-pub-gold" size={12} />
                  ))}
                </div>
                <p className="text-pub-gold text-sm font-semibold">{review.name}</p>
                <p className="text-stone-400 text-xs">{review.date}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Find Us" title="Location & Hours" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-stone-200 h-80 lg:h-96 shadow-sm">
              {import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL?.trim() ? (
                <iframe
                  title="Jack's Norwood Location"
                  src={import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL.trim()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allow="fullscreen"
                />
              ) : (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(import.meta.env.VITE_RESTAURANT_ADDRESS || '123 The Parade, Norwood SA 5067')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full h-full bg-stone-50 text-stone-400 hover:text-pub-gold transition-colors text-sm"
                >
                  View on Google Maps
                </a>
              )}
            </div>
            {/* Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-pub-gold/10 border border-pub-gold/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-pub-gold" />
                </div>
                <div>
                  <h4 className="text-pub-text font-semibold mb-1">Address</h4>
                  <p className="text-stone-500">123 The Parade, Norwood SA 5067, Australia</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-pub-gold/10 border border-pub-gold/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-pub-gold" />
                </div>
                <div>
                  <h4 className="text-pub-text font-semibold mb-1">Phone</h4>
                  <a href="tel:+61882345678" className="text-stone-500 hover:text-pub-gold transition-colors">(08) 8234 5678</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-pub-gold/10 border border-pub-gold/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-pub-gold" />
                </div>
                <div>
                  <h4 className="text-pub-text font-semibold mb-3">Opening Hours</h4>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Monday – Thursday', '11:00 AM – 10:00 PM'],
                      ['Friday – Saturday', '11:00 AM – 12:00 AM'],
                      ['Sunday', '12:00 PM – 9:00 PM'],
                    ].map(([day, time]) => (
                      <div key={day} className="flex justify-between gap-8">
                        <span className="text-stone-500">{day}</span>
                        <span className="text-pub-gold font-medium">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
