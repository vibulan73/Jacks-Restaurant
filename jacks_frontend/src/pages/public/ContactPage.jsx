import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { contactAPI } from '../../services/api';
import SectionHeader from '../../components/ui/SectionHeader';

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await contactAPI.send(data);
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const inputCls = 'w-full bg-pub-brown/60 border border-white/20 text-white placeholder-white/40 px-4 py-3 rounded-lg focus:outline-none focus:border-pub-gold transition-colors duration-200';
  const errorCls = 'text-red-400 text-xs mt-1';

  return (
    <div className="min-h-screen pt-20">
      <div className="relative py-24 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-pub-dark/80" />
        <div className="relative z-10 text-center">
          <SectionHeader subtitle="Get in Touch" title="Contact Us" description="We'd love to hear from you" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-white text-3xl font-bold mb-8">Send Us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <input {...register('name', { required: 'Name is required' })} placeholder="Your Name *" className={inputCls} />
                {errors.name && <p className={errorCls}>{errors.name.message}</p>}
              </div>
              <div>
                <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} placeholder="Email Address *" className={inputCls} />
                {errors.email && <p className={errorCls}>{errors.email.message}</p>}
              </div>
              <div>
                <input {...register('phone')} placeholder="Phone Number" className={inputCls} />
              </div>
              <div>
                <textarea {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Message too short' } })}
                  placeholder="Your Message *" rows={6} className={inputCls + ' resize-none'} />
                {errors.message && <p className={errorCls}>{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-white text-3xl font-bold mb-8">Restaurant Info</h2>
            <div className="space-y-6 mb-10">
              {[
                { icon: FaMapMarkerAlt, title: 'Address', content: '123 The Parade, Norwood SA 5067, Australia' },
                { icon: FaPhone, title: 'Phone', content: '(08) 8234 5678', href: 'tel:+61882345678' },
                { icon: FaEnvelope, title: 'Email', content: 'info@jacksnorwood.com.au', href: 'mailto:info@jacksnorwood.com.au' },
              ].map(({ icon: Icon, title, content, href }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pub-gold/10 border border-pub-gold/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="text-pub-gold" size={16} />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{title}</p>
                    {href ? (
                      <a href={href} className="text-white hover:text-pub-gold transition-colors">{content}</a>
                    ) : (
                      <p className="text-white">{content}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-pub-gold/10 border border-pub-gold/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-pub-gold" size={16} />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Opening Hours</p>
                  <div className="space-y-1 text-sm">
                    {[['Mon – Thu', '11:00 AM – 10:00 PM'], ['Fri – Sat', '11:00 AM – 12:00 AM'], ['Sunday', '12:00 PM – 9:00 PM']].map(([d, t]) => (
                      <div key={d} className="flex justify-between gap-6">
                        <span className="text-white/70">{d}</span>
                        <span className="text-pub-gold">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            {import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL?.trim() ? (
              <div className="rounded-xl overflow-hidden border border-white/10 h-60">
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
              </div>
            ) : (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(import.meta.env.VITE_RESTAURANT_ADDRESS || '123 The Parade, Norwood SA 5067')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 h-60 rounded-xl border border-white/10 bg-pub-brown/40 text-white/40 hover:text-pub-gold hover:border-pub-gold/30 transition-all duration-200 text-sm"
              >
                <FaMapMarkerAlt className="text-pub-gold" size={20} />
                View on Google Maps
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
