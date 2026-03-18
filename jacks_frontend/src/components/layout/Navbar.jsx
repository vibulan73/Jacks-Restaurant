import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { FaSun, FaStar } from 'react-icons/fa';
import logoImg from '../../assets/images/JN L 2.png';

const MENU_CATEGORIES = [
  { label: 'Main Menu',   to: '/menu?category=main-menu' },
  { label: 'Kids Menu',   to: '/menu?category=kids-menu' },
  { label: 'Desserts',    to: '/menu?category=dessert' },
  { label: 'Drinks Menu', to: '/menu?category=drinks' },
];

const SPECIALS_ITEMS = [
  { icon: FaSun,  to: '/promotions?type=DAILY',   label: 'Daily Specials' },
  { icon: FaStar, to: '/promotions?type=SPECIAL', label: 'Featured Specials' },
];

function DropdownNav({ label, to, items }) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  const isOpen = open || pinned;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setPinned(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setPinned(false); setOpen(false); }, [location]);

  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setPinned(p => !p)}
        className={`flex items-center gap-1 text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
          isActive ? 'text-pub-gold' : 'text-stone-700 hover:text-pub-gold'
        }`}
      >
        {label}
        <HiChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl shadow-black/10 overflow-hidden z-50"
          >
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:text-pub-gold hover:bg-pub-light text-sm font-medium transition-colors duration-150 border-b border-stone-100 last:border-b-0"
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
  const [mobileMenu, setMobileMenu] = useState(null);
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
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4">
      {/* Floating pill */}
      <nav className={`w-full max-w-4xl transition-all duration-500 rounded-full border ${
        scrolled
          ? 'bg-white/98 backdrop-blur-md border-stone-200 shadow-lg shadow-stone-300/40'
          : 'bg-white/90 backdrop-blur-sm border-stone-200/70 shadow-md shadow-stone-200/30'
      }`}>
        <div className="flex items-center justify-between px-5 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logoImg} alt="Jack's Norwood" className="h-11 w-auto object-contain" />
          </Link>

          {/* Desktop Nav — centered */}
          <div className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  isActive ? 'text-pub-gold' : 'text-stone-700 hover:text-pub-gold'
                }`
              }
            >
              Home
            </NavLink>

            <DropdownNav label="Menu" to="/menu" items={MENU_CATEGORIES} />
            <DropdownNav label="Specials" to="/promotions" items={SPECIALS_ITEMS} />

            {[
              { to: '/gallery', label: 'Gallery' },
              { to: '/about',   label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                    isActive ? 'text-pub-gold' : 'text-stone-700 hover:text-pub-gold'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side spacer (desktop) — mirrors logo width to keep links truly centered */}
          <div className="hidden lg:block w-11 flex-shrink-0" />

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-stone-700 p-1.5"
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu — drops below the pill */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden w-full max-w-4xl mt-2 bg-white border border-stone-200 rounded-3xl shadow-xl shadow-stone-200/50 overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              <NavLink to="/" end className={({ isActive }) => mobileLinkCls(isActive)}>Home</NavLink>

              {/* Menu accordion */}
              <div>
                <button
                  onClick={() => setMobileMenu(mobileMenu === 'menu' ? null : 'menu')}
                  className="w-full flex items-center justify-between text-sm font-semibold uppercase tracking-wider py-2.5 border-b border-stone-200 text-stone-700"
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
                        <Link key={item.to} to={item.to} className="text-sm text-stone-500 hover:text-pub-gold py-2 border-b border-stone-100">
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Specials accordion */}
              <div>
                <button
                  onClick={() => setMobileMenu(mobileMenu === 'specials' ? null : 'specials')}
                  className="w-full flex items-center justify-between text-sm font-semibold uppercase tracking-wider py-2.5 border-b border-stone-200 text-stone-700"
                >
                  Specials
                  <HiChevronDown size={16} className={`transition-transform duration-200 ${mobileMenu === 'specials' ? 'rotate-180 text-pub-gold' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileMenu === 'specials' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 flex flex-col"
                    >
                      {SPECIALS_ITEMS.map(item => (
                        <Link key={item.to} to={item.to} className="flex items-center gap-2 text-sm text-stone-500 hover:text-pub-gold py-2 border-b border-stone-100">
                          <item.icon size={12} className="text-pub-gold/70" />
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { to: '/gallery', label: 'Gallery' },
                { to: '/about',   label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => mobileLinkCls(isActive)}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function mobileLinkCls(isActive) {
  return `text-sm font-semibold uppercase tracking-wider py-2.5 border-b border-stone-200 ${
    isActive ? 'text-pub-gold' : 'text-stone-700'
  }`;
}
