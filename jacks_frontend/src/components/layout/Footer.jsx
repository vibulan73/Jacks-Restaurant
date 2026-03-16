import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import logoImg from '../../assets/images/JN L 2.png';
import { settingsAPI } from '../../services/api';

const quickLinks = [
  { to: '/menu', label: 'Menu' },
  { to: '/promotions', label: 'Promotions' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reservation', label: 'Reservations' },
  { to: '/about', label: 'About Us' },
];

const hours = [
  { day: 'Monday - Thursday', time: '11:00 AM - 10:00 PM' },
  { day: 'Friday - Saturday', time: '11:00 AM - 12:00 AM' },
  { day: 'Sunday', time: '12:00 PM - 9:00 PM' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [social, setSocial] = useState({ facebook: '', instagram: '', tiktok: '' });

  useEffect(() => {
    settingsAPI.getAll()
      .then(r => setSocial({
        facebook:  r.data['social.facebook']  || '',
        instagram: r.data['social.instagram'] || '',
        tiktok:    r.data['social.tiktok']    || '',
      }))
      .catch(() => {});
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    e.target.reset();
  };

  return (
    <footer className="bg-pub-dark border-t border-pub-gold/20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src={logoImg} alt="Jack's Norwood" className="h-20 w-auto object-contain mb-4" />
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Your neighbourhood pub & restaurant in Norwood. Great food, cold drinks, live entertainment and warm hospitality.
            </p>
            <div className="flex gap-4">
              {[
                { href: social.facebook,  Icon: FaFacebook },
                { href: social.instagram, Icon: FaInstagram },
{ href: social.tiktok,    Icon: FaTiktok },
              ].map(({ href, Icon }) =>
                href ? (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-pub-gold hover:text-pub-dark transition-all duration-300">
                    <Icon size={16} />
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-pub-gold text-lg font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-white/60 text-sm hover:text-pub-gold transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 bg-pub-gold rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-pub-gold text-lg font-semibold mb-5">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <FaMapMarkerAlt className="text-pub-gold mt-0.5 flex-shrink-0" />
                <span>123 The Parade, Norwood SA 5067, Australia</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <FaPhone className="text-pub-gold flex-shrink-0" />
                <a href="tel:+61882345678" className="hover:text-pub-gold transition-colors">(08) 8234 5678</a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <FaEnvelope className="text-pub-gold flex-shrink-0" />
                <a href="mailto:info@jacksnorwood.com.au" className="hover:text-pub-gold transition-colors">info@jacksnorwood.com.au</a>
              </li>
            </ul>

            <h3 className="font-display text-pub-gold text-lg font-semibold mt-6 mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              {hours.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <FaClock className="text-pub-gold mt-0.5 flex-shrink-0" size={12} />
                  <div>
                    <span className="text-white/80 block">{h.day}</span>
                    <span className="text-pub-gold">{h.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-pub-gold text-lg font-semibold mb-5">Newsletter</h3>
            <p className="text-white/60 text-sm mb-4">
              Subscribe to stay updated on our specials, events and promotions.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:border-pub-gold rounded-sm"
              />
              <button type="submit" className="btn-primary w-full text-center text-xs">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} Jack's Norwood. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Please drink responsibly. Must be 18+ to consume alcohol.
          </p>
        </div>
      </div>
    </footer>
  );
}
