import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Container } from './Container';

const NAV_LINKS = [
  { label: 'Home',    to: '/' },
  { label: 'About',   to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Events',  to: '/events' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 w-full transition-all duration-300 font-outfit',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(26,44,107,0.08)] border-b border-navy/10'
          : 'bg-white border-b border-navy/10',
      )}
    >
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-3.5 flex-shrink-0 group"
            aria-label="Elkay 2K22 Home"
          >
            {/* Gradient ring frame around logo */}
            <div
              className="w-[52px] h-[52px] rounded-[14px] p-[2.5px] flex-shrink-0
                         shadow-[0_4px_12px_rgba(26,44,107,0.25)]"
              style={{ background: 'linear-gradient(135deg,#1a2c6b 0%,#4c67d8 100%)' }}
            >
              <div className="w-full h-full bg-white rounded-[11px] overflow-hidden flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Elkay 2K22 Batch"
                  className="w-[88%] h-[88%] object-contain
                             group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>

            {/* Text */}
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-[17px] font-extrabold tracking-[-0.3px] text-[#1a2c6b]">
                Elkay 2K22
              </span>
              <span className="text-[10.5px] font-semibold uppercase tracking-[1.2px] text-[#4c67d8]">
                Friends · Help · Care
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            className="hidden md:flex items-center gap-1 rounded-[14px] p-[5px]
                       bg-[#f4f6fb] border border-[rgba(26,44,107,0.08)]"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'px-4 py-2 rounded-[10px] text-sm font-semibold whitespace-nowrap transition-all duration-200',
                    isActive
                      ? 'bg-[#1a2c6b] text-white shadow-[0_2px_10px_rgba(26,44,107,0.3)]'
                      : 'text-[#4a5578] hover:text-[#1a2c6b] hover:bg-white hover:shadow-[0_1px_6px_rgba(26,44,107,0.1)]',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── CTA button ── */}
          <NavLink
            to="/help-request"
            className="hidden md:inline-flex items-center px-5 py-2.5 rounded-[10px]
                       bg-[#1a2c6b] text-white text-sm font-bold flex-shrink-0
                       shadow-[0_3px_12px_rgba(26,44,107,0.35)]
                       hover:bg-[#142255] hover:-translate-y-px
                       hover:shadow-[0_5px_16px_rgba(26,44,107,0.4)]
                       transition-all duration-200"
          >
            Request Help
          </NavLink>

          {/* ── Mobile menu button ── */}
          <button
            className="md:hidden p-2 rounded-lg text-[#1a2c6b] hover:bg-[#f4f6fb] transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-[rgba(26,44,107,0.08)]
                       shadow-[0_8px_24px_rgba(26,44,107,0.1)]"
          >
            <nav className="flex flex-col py-3 px-4 gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-[#1a2c6b] text-white'
                        : 'text-[#4a5578] hover:bg-[#f4f6fb] hover:text-[#1a2c6b]',
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
              <NavLink
                to="/help-request"
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl text-sm font-bold text-center
                           bg-[#1a2c6b] text-white"
              >
                Request Help
              </NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}