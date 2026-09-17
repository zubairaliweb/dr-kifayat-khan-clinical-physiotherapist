import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Menu, 
  X, 
  MessageSquare, 
  Lock, 
  ShieldCheck, 
  Calendar,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  phone?: string;
  whatsapp?: string;
  onOpenAppointment: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  phone = "03138161676", 
  whatsapp = "https://wa.me/923138161676", 
  onOpenAppointment, 
  onOpenAdmin 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isAuthenticated, setIsAdminOpen, setIsLoginModalOpen } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleAdminClick = () => {
    if (onOpenAdmin) {
      onOpenAdmin();
    } else if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'education', 'services', 'skills', 'videos', 'blog', 'contact'];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Education', id: 'education' },
    { label: 'Services', id: 'services' },
    { label: 'Skills', id: 'skills' },
    { label: 'Videos', id: 'videos' },
    { label: 'Blog', id: 'blog' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-200/80 dark:border-slate-800/80 py-3'
          : 'bg-slate-100/85 dark:bg-slate-900/85 backdrop-blur-sm border-b border-slate-200/40 dark:border-slate-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Doctor Name */}
        <button
          onClick={() => scrollToSection('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
          id="nav-brand-btn"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <span className="block text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors">
              Dr. Kifayat Khan
            </span>
            <span className="block text-xs font-medium text-cyan-400/90 tracking-wide uppercase">
              Clinical Physiotherapist
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-full border border-slate-300/60 dark:border-slate-700/60 shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 hover:dark:bg-slate-700/50'
              }`}
              id={`nav-link-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions & WhatsApp CTA */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Light / Dark Theme Toggle */}
          <button
            onClick={toggleTheme}
            id="nav-theme-toggle"
            aria-label="Toggle light and dark theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative p-2 rounded-xl border text-xs transition-colors cursor-pointer bg-slate-200/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-amber-500 dark:text-cyan-300 hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Direct WhatsApp CTA */}
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-whatsapp-btn"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/30 transition-all active:scale-95"
            title={`Chat directly with Dr. Kifayat Khan on WhatsApp (${phone})`}
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* Book Appointment CTA */}
          <button
            onClick={onOpenAppointment}
            id="nav-appointment-btn"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-900/40 transition-all active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Clinic Visit</span>
          </button>

          {/* Admin Dashboard / Login Button */}
          <button
            onClick={handleAdminClick}
            id="nav-admin-btn"
            title={isAuthenticated ? "Open Doctor's Admin Portal" : "Admin Login"}
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              isAuthenticated
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900'
                : 'bg-slate-200/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 hover:dark:text-slate-200 hover:bg-slate-300 hover:dark:bg-slate-700'
            }`}
          >
            {isAuthenticated ? (
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            id="nav-theme-toggle-mobile"
            aria-label="Toggle light and dark theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-amber-500 dark:text-cyan-300 flex items-center justify-center"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center"
            title="WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 pt-3 pb-6 space-y-2.5 animate-in slide-in-from-top duration-200"
        >
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`py-2 px-3 text-left text-xs font-semibold rounded-lg ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 hover:dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAppointment();
              }}
              className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 cursor-pointer"
            >
              Book an Appointment
            </button>

            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white bg-emerald-600 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              Chat on WhatsApp ({phone})
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleAdminClick();
              }}
              className="w-full py-2 rounded-xl text-center text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              {isAuthenticated ? "Open Doctor's Admin Portal" : "Admin Login Portal"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
