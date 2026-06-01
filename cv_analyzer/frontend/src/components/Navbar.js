import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);

    // Check initial dark mode state
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const navBgClass = scrolled
    ? 'bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-lg'
    : 'bg-transparent border-b border-transparent';

  const textClass = 'text-on-surface';
  const linkClass = 'text-on-surface-variant hover:text-primary';

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBgClass}`}>
        <div className="w-full px-8 md:px-12 h-20 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className={`font-display font-bold text-xl tracking-tight transition-colors ${textClass}`}>
            SkillSync AI
          </Link>

          {/* Right side: Links + CTA */}
          <div className="hidden md:flex items-center gap-10">
            {/* Desktop links */}
            <ul className="flex items-center gap-10 m-0 p-0 list-none">
              <li>
                <a href="/#features" className={`font-body text-sm font-medium transition-colors ${linkClass}`}>Features</a>
              </li>
              <li>
                <a href="/#how-it-works" className={`font-body text-sm font-medium transition-colors ${linkClass}`}>How it works</a>
              </li>
            </ul>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${linkClass}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Desktop CTA */}
            <Link
              to="/dashboard"
              className={`inline-flex items-center gap-2 font-label font-semibold text-sm px-6 py-2 rounded-full transition-all whitespace-nowrap bg-primary text-on-primary hover:bg-surface-tint hover:-translate-y-0.5 hover:shadow-md`}
            >
              Analyse my profile
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={`md:hidden p-1 transition-colors ${linkClass}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer (Light Theme) */}
      <div className={`fixed top-16 left-0 right-0 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-outline-variant/30 z-40 p-6 flex flex-col gap-2 transition-all duration-300 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <a href="/#features" className="font-body font-medium text-on-surface-variant hover:text-primary py-3 border-b border-outline-variant/20" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="/#how-it-works" className="font-body font-medium text-on-surface-variant hover:text-primary py-3 border-b border-outline-variant/20" onClick={() => setMenuOpen(false)}>How it works</a>
        <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 mt-4 bg-primary text-on-primary font-label font-semibold text-base px-6 py-3 rounded-full hover:shadow-md transition-all" onClick={() => setMenuOpen(false)}>
          Analyse my profile
          <ArrowRight size={18} />
        </Link>
      </div>
    </>
  );
};

export default Navbar;
