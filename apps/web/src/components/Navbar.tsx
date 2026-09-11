import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Shield, Sun, Moon, Laptop, Gauge, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `font-medium text-sm transition-colors py-1 border-b-2 ${
      isActive
        ? 'text-primary border-primary font-semibold'
        : 'text-text-secondary border-transparent hover:text-foreground hover:border-border'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div className="font-display font-extrabold text-xl tracking-tight text-foreground">
              FH6<span className="text-primary">CARS</span>
            </div>
          </Link>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search cars, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface text-foreground placeholder:text-text-muted text-xs rounded-full pl-9 pr-4 py-2 border border-border focus:outline-none focus:border-primary transition-colors shadow-inner"
              />
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
            </div>
          </form>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/cars" className={navItemClass}>
              Browse Cars
            </NavLink>
            <NavLink to="/brands" className={navItemClass}>
              Brands
            </NavLink>
            <NavLink to="/compare" className={navItemClass}>
              Compare
            </NavLink>
            <NavLink to="/api" className={navItemClass}>
              API Docs
            </NavLink>
            <NavLink to="/about" className={navItemClass}>
              About
            </NavLink>
          </div>

          {/* Controls & Active Admin Session Indicator */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Switcher Button */}
            <button
              onClick={cycleTheme}
              className="p-2 text-text-secondary hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title={`Current Theme: ${theme.toUpperCase()} (Click to cycle)`}
            >
              {theme === 'dark' && <Moon className="w-4 h-4 text-primary" />}
              {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
              {theme === 'system' && <Laptop className="w-4 h-4 text-secondary" />}
              <span className="capitalize text-[11px] font-mono tracking-wider">{theme}</span>
            </button>

            {/* Render Admin Panel badge ONLY when authenticated */}
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin"
                  className="bg-primary/10 text-primary border border-primary/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 hover:bg-primary/20 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-text-muted hover:text-foreground px-2 py-1 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={cycleTheme}
              className="p-2 text-text-secondary hover:text-foreground flex items-center gap-1 text-xs"
              title={`Current Theme: ${theme.toUpperCase()}`}
            >
              {theme === 'dark' && <Moon className="w-5 h-5 text-primary" />}
              {theme === 'light' && <Sun className="w-5 h-5 text-amber-500" />}
              {theme === 'system' && <Laptop className="w-5 h-5 text-secondary" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text-secondary hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-3 bg-surface border-b border-border">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background text-foreground text-sm rounded-lg px-3 py-2 border border-border focus:border-primary"
            />
          </form>
          <div className="flex flex-col space-y-2 pt-2 text-sm font-medium">
            <Link to="/cars" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary py-1.5">Browse Cars</Link>
            <Link to="/brands" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary py-1.5">Brands</Link>
            <Link to="/compare" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary py-1.5">Compare Cars</Link>
            <Link to="/api" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary py-1.5">API Docs</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary py-1.5">About</Link>
            {isAuthenticated && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-primary py-1.5 font-bold">Admin Dashboard</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
