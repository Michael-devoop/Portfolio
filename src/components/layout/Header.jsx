import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollSpy } from '../../hooks/useScrollSpy';

const menuItems = [
  { id: 'home', label: 'Home' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

const sectionIds = menuItems.map((item) => item.id);

export default function Header() {
  const activeId = useScrollSpy(sectionIds, 200);

  // ─── useState: track mobile menu open/close ───
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ─── useState: track if scrolled past hero for bg opacity ───
  const [isScrolled, setIsScrolled] = useState(false);

  // ─── useRef: reference to the nav element ───
  const navRef = useRef(null);

  // ─── useEffect: detect scroll to toggle navbar background ───
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── useEffect: close mobile menu on resize to desktop ───
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── useEffect: close mobile menu on outside click ───
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  const handleClick = (e, id) => {
    e.preventDefault();
    setIsMobileOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl">
      <motion.nav
        ref={navRef}
        layout
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(201,201,201,0.9) 9%, rgba(161,161,161,0.85) 32%, rgba(117,117,117,0.8) 73%, rgba(255,255,255,0.95) 100%)',
          borderRadius: isMobileOpen ? '20px' : '999px',
          padding: '2px',
          boxShadow: isScrolled
            ? '0 4px 60px -12px rgba(0,0,0,0.15), 0 2px 20px -4px rgba(0,0,0,0.08)'
            : '0 2px 30px -8px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.3s ease, border-radius 0.3s ease',
        }}
      >
        {/* Inner glass surface */}
        <motion.div
          layout
          className="relative"
          style={{
            background: 'linear-gradient(150deg, rgb(228,228,230) 0%, rgb(242,242,244) 50%, rgb(218,218,222) 100%)',
            borderRadius: isMobileOpen ? '18px' : '999px',
            boxShadow: 'inset 0px 1px 1.5px 0px rgba(0,0,0,0.07), inset 0px -1px 1.5px 0px rgba(0,0,0,0.07)',
            padding: isMobileOpen ? '10px 14px 14px 14px' : '7px 10px 7px 16px',
            transition: 'border-radius 0.3s ease, padding 0.3s ease',
          }}
        >
          {/* Top row: Logo + Links (desktop) + Hamburger (mobile) */}
          <div className="flex items-center justify-between">
            {/* Brand */}
            <a
              href="#home"
              onClick={(e) => handleClick(e, 'home')}
              className="flex items-center gap-2 group"
            >
              {/* Gem icon */}
              <div className="w-7 h-7 flex items-center justify-center">
                <div
                  className="w-[17px] h-[17px] rounded-[3px] flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgb(244,245,248) 0%, rgb(196,200,208) 55%, rgb(158,162,172) 100%)',
                    boxShadow: 'inset 0px 1px 1px 0px rgba(255,255,255,0.9), 0px 4px 7px -1px rgba(0,0,0,0.35)',
                    transform: 'rotate(45deg)',
                  }}
                >
                  <div
                    className="w-[7px] h-[7px] rounded-[2px]"
                    style={{ backgroundColor: 'rgb(14,14,18)' }}
                  />
                </div>
              </div>
              <span
                className="text-[15px] font-semibold tracking-[-0.01em] leading-none select-none"
                style={{ color: 'rgb(10,10,12)' }}
              >
                Michael<span className="text-brand-accent">.</span>
              </span>
            </a>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleClick(e, id)}
                  className="relative px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-200 select-none"
                  style={{
                    color: activeId === id ? 'rgb(10,10,12)' : 'rgba(10,10,12,0.55)',
                    background: activeId === id
                      ? 'rgba(255,255,255,0.5)'
                      : 'transparent',
                    boxShadow: activeId === id
                      ? 'inset 0px 1px 0px 0px rgba(255,255,255,0.85), 0px 4px 12px -4px rgba(148,160,181,0.3)'
                      : 'none',
                  }}
                >
                  {label}
                </a>
              ))}

              {/* CTA Button */}
              <a
                href="#contact"
                onClick={(e) => handleClick(e, 'contact')}
                className="ml-1 px-4 py-2 rounded-full text-[13px] font-semibold text-white select-none transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'linear-gradient(180deg, rgb(50,50,55) 0%, rgb(25,25,30) 100%)',
                  boxShadow: '0px 2px 8px -2px rgba(0,0,0,0.3), inset 0px 1px 0px 0px rgba(255,255,255,0.1)',
                }}
              >
                Get in Touch
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: 'rgba(255,255,255,0.4)',
                boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.85), 0px 8px 20px -6px rgba(148,160,181,0.45)',
              }}
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <motion.span
                className="absolute w-[18px] h-[2px] rounded-sm"
                style={{ backgroundColor: 'rgb(10,10,12)', top: '15px', left: '11px' }}
                animate={{ rotate: isMobileOpen ? 45 : 0, top: isMobileOpen ? '19px' : '15px' }}
                transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
              />
              <motion.span
                className="absolute w-[18px] h-[2px] rounded-sm"
                style={{ backgroundColor: 'rgb(10,10,12)', top: '23px', left: '11px' }}
                animate={{ rotate: isMobileOpen ? -45 : 0, top: isMobileOpen ? '19px' : '23px' }}
                transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
              />
            </button>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {isMobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                className="overflow-hidden md:hidden"
              >
                <div className="flex flex-col gap-1 pt-4">
                  {menuItems.map(({ id, label }) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      onClick={(e) => handleClick(e, id)}
                      className="w-full px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200"
                      style={{
                        color: activeId === id ? 'rgb(10,10,12)' : 'rgba(10,10,12,0.55)',
                        background: activeId === id ? 'rgba(255,255,255,0.5)' : 'transparent',
                        boxShadow: activeId === id
                          ? 'inset 0px 1px 0px 0px rgba(255,255,255,0.85), 0px 4px 12px -4px rgba(148,160,181,0.3)'
                          : 'none',
                      }}
                    >
                      {label}
                    </a>
                  ))}
                  <a
                    href="#contact"
                    onClick={(e) => handleClick(e, 'contact')}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl text-[14px] font-semibold text-white text-center transition-all duration-200 hover:opacity-90"
                    style={{
                      background: 'linear-gradient(180deg, rgb(50,50,55) 0%, rgb(25,25,30) 100%)',
                      boxShadow: '0px 2px 8px -2px rgba(0,0,0,0.3), inset 0px 1px 0px 0px rgba(255,255,255,0.1)',
                    }}
                  >
                    Get in Touch
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.nav>
    </header>
  );
}
