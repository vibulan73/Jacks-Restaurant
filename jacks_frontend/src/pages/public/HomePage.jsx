import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaClock, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { menuAPI, promotionAPI, eventAPI } from '../../services/api';
import MenuItemCard from '../../components/ui/MenuItemCard';
import SectionHeader from '../../components/ui/SectionHeader';

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
  const [events, setEvents] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    Promise.all([
      menuAPI.getPopular().then(r => setPopularItems(r.data.slice(0, 6))),
      promotionAPI.getActive().then(r => setPromotions(r.data.slice(0, 3))),
      eventAPI.getUpcoming().then(r => setEvents(r.data.slice(0, 3))),
    ])
      .catch(console.error)
      .finally(() => setLoadingMenu(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pub-dark/80 via-pub-dark/50 to-pub-dark" />

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
            className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-tight mb-4"
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
            className="text-white/80 text-xl md:text-2xl font-light mb-10"
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
            <Link to="/reservation" className="btn-outline">Book a Table</Link>
            <Link to="/promotions" className="btn-outline">View Specials</Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs uppercase tracking-widest"
        >
          <span>Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* TODAY'S SPECIALS */}
      {promotions.length > 0 && (
        <section className="py-20 bg-pub-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader subtitle="Limited Time" title="Today's Specials" description="Take advantage of our exclusive deals and promotions" />
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {promotions.map((promo) => (
                <motion.div key={promo.id} variants={fadeUp}
                  className="bg-pub-brown/60 border border-pub-gold/20 rounded-lg overflow-hidden hover:border-pub-gold/60 transition-all duration-300 group">
                  {promo.imageUrl && (
                    <div className="h-44 overflow-hidden">
                      <img src={promo.imageUrl} alt={promo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="inline-block bg-pub-gold text-pub-dark font-bold text-sm px-3 py-1 rounded mb-3">
                      {promo.discount}
                    </div>
                    <h3 className="font-display text-white text-xl font-semibold mb-2">{promo.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{promo.description}</p>
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
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Our Favourites" title="Popular Menu Items" description="Crowd-pleasing dishes that keep our guests coming back" />
          {loadingMenu ? (
            <div className="text-center text-white/50 py-10">Loading menu...</div>
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
      <section className="py-20 bg-pub-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <p className="section-subtitle">Our Story</p>
              <h2 className="section-title">A True Norwood Landmark</h2>
              <div className="gold-divider ml-0"></div>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                Jack's Norwood has been the heart of the community since the day we opened our doors.
                We believe in good food, honest drinks, and a warm welcome for everyone who walks through our door.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Whether you're stopping in for a cold one after work, celebrating a special occasion, or
                bringing the family for Sunday lunch — Jack's is your home away from home.
              </p>
              <Link to="/about" className="btn-outline">Our Story</Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              <img src="https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&h=300&fit=crop" alt="Bar" className="rounded-lg h-48 w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" alt="Food" className="rounded-lg h-48 w-full object-cover mt-6" />
              <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop" alt="Drinks" className="rounded-lg h-48 w-full object-cover -mt-6" />
              <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop" alt="Events" className="rounded-lg h-48 w-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      {events.length > 0 && (
        <section className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader subtitle="What's On" title="Upcoming Events" description="Live entertainment, sports nights and more" />
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {events.map((event) => (
                <motion.div key={event.id} variants={fadeUp}
                  className="bg-pub-brown/60 border border-white/10 rounded-lg overflow-hidden hover:border-pub-gold/40 transition-all duration-300 group">
                  {event.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-pub-gold text-xs uppercase tracking-wider mb-3">
                      <span>{event.date}</span>
                      {event.time && <><span>•</span><span>{event.time}</span></>}
                    </div>
                    <h3 className="font-display text-white text-lg font-semibold mb-2">{event.title}</h3>
                    <p className="text-white/60 text-sm line-clamp-2">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="text-center mt-10">
              <Link to="/events" className="btn-outline">All Events</Link>
            </div>
          </div>
        </section>
      )}

      {/* REVIEWS */}
      <section className="py-20 bg-pub-dark">
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
                className="bg-pub-brown/60 border border-white/10 rounded-lg p-6 hover:border-pub-gold/30 transition-all duration-300">
                <FaQuoteLeft className="text-pub-gold/30 text-3xl mb-4" />
                <p className="text-white/70 text-sm leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(review.rating)].map((_, j) => (
                    <FaStar key={j} className="text-pub-gold" size={12} />
                  ))}
                </div>
                <p className="text-pub-gold text-sm font-semibold">{review.name}</p>
                <p className="text-white/30 text-xs">{review.date}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Find Us" title="Location & Hours" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Map */}
            <div className="rounded-lg overflow-hidden border border-white/10 h-80 lg:h-96">
              <iframe
                title="Jack's Norwood Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.5847!2d138.6243!3d-34.9266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDU1JzM2LjAiUyAxMzjCsDM3JzI3LjUiRQ!5e0!3m2!1sen!2sau!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
            {/* Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-pub-gold text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Address</h4>
                  <p className="text-white/60">123 The Parade, Norwood SA 5067, Australia</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaPhone className="text-pub-gold text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Phone</h4>
                  <a href="tel:+61882345678" className="text-white/60 hover:text-pub-gold transition-colors">(08) 8234 5678</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaClock className="text-pub-gold text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-3">Opening Hours</h4>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Monday – Thursday', '11:00 AM – 10:00 PM'],
                      ['Friday – Saturday', '11:00 AM – 12:00 AM'],
                      ['Sunday', '12:00 PM – 9:00 PM'],
                    ].map(([day, time]) => (
                      <div key={day} className="flex justify-between gap-8">
                        <span className="text-white/60">{day}</span>
                        <span className="text-pub-gold font-medium">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link to="/reservation" className="btn-primary">Reserve a Table</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
