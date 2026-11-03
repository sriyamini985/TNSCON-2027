import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton';
import { siteContent } from '../../data/siteContent';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll detection for sticky header state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-[#FAF5ED]/95 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,51,153,0.06)] border-[#E5DCCB]'
          : 'bg-[#FAF5ED] border-[#E5DCCB]'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-6 h-[64px] lg:h-[76px] flex items-center justify-between gap-6">
        
        {/* Left: Official Logo + Un-truncated Two-Line Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-3.5 flex-shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003399] focus-visible:ring-offset-2 rounded-lg py-1"
          aria-label="TNSCON 2027 — Telangana Neurosciences Society Home"
        >
          <img
            src="/assets/images/tnscon_logo.png"
            alt="TNSCON 2027 Official Logo"
            className="h-[44px] w-auto object-contain flex-shrink-0 transition-transform duration-200 group-hover:scale-[1.02]"
            width="105"
            height="44"
          />
          <div className="flex flex-col text-left whitespace-nowrap">
            <span className="font-bold text-[#003399] text-[18px] lg:text-[20px] leading-tight tracking-tight">
              TNSCON 2027
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#556070] leading-none mt-0.5">
              Telangana Neurosciences Society
            </span>
          </div>
        </Link>

        {/* Center: Exactly 6 Navigation Links (Desktop, single line, no wrapping) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 xl:gap-8 whitespace-nowrap"
        >
          {siteContent.navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `group relative text-[15px] font-medium whitespace-nowrap transition-colors duration-200 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003399] focus-visible:ring-offset-2 rounded-sm ${
                  isActive
                    ? 'text-[#003399] font-semibold'
                    : 'text-[#182230] hover:text-[#003399]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.label}</span>
                  {/* Active underline (2px gold, 4px offset) with hover slide-in */}
                  <span
                    className={`absolute left-0 h-[2px] bg-[#D49B00] transition-all duration-200 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{ bottom: '-4px' }}
                    aria-hidden="true"
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right: Single Primary CTA Button (Desktop) */}
        <div className="hidden lg:flex items-center flex-shrink-0">
          <InteractiveHoverButton
            to={siteContent.navbarCta.path}
            text={siteContent.navbarCta.label}
            variant="blue"
            className="py-2.5 px-6 text-sm"
          />
        </div>

        {/* Mobile Hamburger Button (<1024px) */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-[#003399] hover:bg-[#F2EAE0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003399] focus-visible:ring-offset-2 transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-In Drawer & Overlay (<1024px) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden" id="mobile-navigation-drawer">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#001A4D]/50 backdrop-blur-xs z-40 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#FAF5ED] border-l border-[#E5DCCB] z-50 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#E5DCCB]">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/images/tnscon_logo.png"
                    alt="TNSCON 2027"
                    className="h-9 w-auto object-contain"
                  />
                  <div>
                    <span className="font-bold text-[#003399] text-base block leading-tight">
                      TNSCON 2027
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#556070] block">
                      Telangana Neurosciences Society
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-[#556070] hover:bg-[#F2EAE0] hover:text-[#003399] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003399]"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex flex-col gap-1 py-6">
                {siteContent.navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-[#F2EAE0] text-[#003399] font-semibold border-l-4 border-[#D49B00]'
                          : 'text-[#182230] hover:bg-[#F2EAE0] hover:text-[#003399]'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#D8CEBC]" />
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Drawer Footer & Primary CTA */}
            <div className="pt-6 border-t border-[#E5DCCB] space-y-4">
              <InteractiveHoverButton
                to={siteContent.navbarCta.path}
                text={siteContent.navbarCta.label}
                variant="blue"
                className="w-full py-3.5 px-6 text-sm"
              />

              <div className="text-center text-xs text-[#556070]">
                <p>12–14 March 2027 · Hyderabad</p>
                <p className="font-semibold text-[#003399] mt-0.5">tnscon2027hyd.com</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
