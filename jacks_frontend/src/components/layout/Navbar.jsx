import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { FaSun, FaStar } from 'react-icons/fa';
import logoImg from '../../assets/images/JN L 2.png';

const MENU_CATEGORIES = [
  { label: 'Main Menu',  to: '/menu?category=main-menu' },
  { label: 'Dessert',    to: '/menu?category=dessert' },
  { label: 'Kids Menu',  to: '/menu?category=kids-menu' },
  { label: 'Drinks',     to: '/menu?category=drinks' },
];

const PROMOTION_ITEMS = [
  { icon: FaSun,  to: '/promotions?type=DAILY',   label: "Today's Specials" },
  { icon: FaStar, to: '/promotions?type=SPECIAL', label: 'Other Specials' },
];

function DropdownNav({ label, to, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on route change
  useEffect(() => { setOpen(false); }, [location]);

  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink
        to={to}
        className={`flex items-center gap-1 text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
          isActive ? 'text-pub-gold' : 'text-white/80 hover:text-pub-gold'
        }`}
      >
        {label}
        <HiChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </NavLink>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 mt-2 w-52 bg-pub-dark/98 border border-pub-gold/20 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50"
          >
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-pub-gold hover:bg-pub-gold/10 text-sm font-medium transition-colors duration-150 border-b border-white/5 last:border-b-0"
              >
                {item.icon && <item.icon size={13} className="text-pub-gold/70 flex-shrink-0" />}
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(null); // 'menu' | 'promotions' | null
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMobileMenu(null);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-pub-dark/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="Jack's Norwood" className="h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  isActive ? 'text-pub-gold' : 'text-white/80 hover:text-pub-gold'
                }`
              }
            >
              Home
            </NavLink>

            <DropdownNav label="Menu" to="/menu" items={MENU_CATEGORIES} />
            <DropdownNav label="Promotions" to="/promotions" items={PROMOTION_ITEMS} />

            {[
              { to: '/events',  label: 'Events' },
              { to: '/gallery', label: 'Gallery' },
              { to: '/about',   label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                    isActive ? 'text-pub-gold' : 'text-white/80 hover:text-pub-gold'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Book Table Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/reservation" className="btn-primary text-xs px-5 py-2.5">
              Book a Table
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-pub-dark/98 border-t border-pub-gold/20"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              <NavLink to="/" end className={({ isActive }) => mobileLinkCls(isActive)}>Home</NavLink>

              {/* Menu accordion */}
              <div>
                <button
                  onClick={() => setMobileMenu(mobileMenu === 'menu' ? null : 'menu')}
                  className="w-full flex items-center justify-between text-sm font-semibold uppercase tracking-wider py-2.5 border-b border-white/10 text-white/80"
                >
                  Menu
                  <HiChevronDown size={16} className={`transition-transform duration-200 ${mobileMenu === 'menu' ? 'rotate-180 text-pub-gold' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileMenu === 'menu' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 flex flex-col"
                    >
                      {MENU_CATEGORIES.map(item => (
                        <Link key={item.to} to={item.to} className="text-sm text-white/60 hover:text-pub-gold py-2 border-b border-white/5">
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Promotions accordion */}
              <div>
                <button
                  onClick={() => setMobileMenu(mobileMenu === 'promotions' ? null : 'promotions')}
                  className="w-full flex items-center justify-between text-sm font-semibold uppercase tracking-wider py-2.5 border-b border-white/10 text-white/80"
                >
                  Promotions
                  <HiChevronDown size={16} className={`transition-transform duration-200 ${mobileMenu === 'promotions' ? 'rotate-180 text-pub-gold' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileMenu === 'promotions' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 flex flex-col"
                    >
                      {PROMOTION_ITEMS.map(item => (
                        <Link key={item.to} to={item.to} className="flex items-center gap-2 text-sm text-white/60 hover:text-pub-gold py-2 border-b border-white/5">
                          <item.icon size={12} className="text-pub-gold/70" />
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { to: '/events',  label: 'Events' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/about',   label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => mobileLinkCls(isActive)}>
                  {link.label}
                </NavLink>
              ))}

              <Link to="/reservation" className="btn-primary text-center mt-4">Book a Table</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function mobileLinkCls(isActive) {
  return `text-sm font-semibold uppercase tracking-wider py-2.5 border-b border-white/10 ${
    isActive ? 'text-pub-gold' : 'text-white/80'
  }`;
}
