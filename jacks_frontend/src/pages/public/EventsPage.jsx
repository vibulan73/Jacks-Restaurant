import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaTicketAlt } from 'react-icons/fa';
import { eventAPI } from '../../services/api';
import SectionHeader from '../../components/ui/SectionHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const FALLBACK = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventAPI.getUpcoming()
      .then(r => setEvents(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const formatTime = (t) => t ? t.slice(0, 5) : '';

  return (
    <div className="min-h-screen pt-20">
      <div className="relative py-24 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-pub-dark/80" />
        <div className="relative z-10 text-center">
          <SectionHeader subtitle="What's On" title="Upcoming Events" description="Live music, trivia nights, sports events and more" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            <p className="text-xl">No upcoming events</p>
            <p className="text-sm mt-2">Stay tuned — something exciting is always in the works!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-pub-brown/60 border border-white/10 rounded-xl overflow-hidden hover:border-pub-gold/40 transition-all duration-300 group flex flex-col md:flex-row"
              >
                <div className="md:w-80 h-56 md:h-auto flex-shrink-0 overflow-hidden">
                  <img
                    src={event.imageUrl || FALLBACK}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = FALLBACK; }}
                  />
                </div>
                <div className="p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {event.date && (
                        <div className="flex items-center gap-2 text-pub-gold text-sm">
                          <FaCalendarAlt size={14} />
                          <span>{formatDate(event.date)}</span>
                        </div>
                      )}
                      {event.time && (
                        <div className="flex items-center gap-2 text-pub-gold text-sm">
                          <FaClock size={14} />
                          <span>{formatTime(event.time)}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-white text-3xl font-bold mb-3">{event.title}</h3>
                    <p className="text-white/60 leading-relaxed">{event.description}</p>
                  </div>
                  <div className="mt-6 flex gap-4">
                    {event.reservationLink ? (
                      <a href={event.reservationLink} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
                        <FaTicketAlt /> Reserve Your Spot
                      </a>
                    ) : (
                      <Link to="/reservation" className="btn-primary flex items-center gap-2">
                        <FaTicketAlt /> Book a Table
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
