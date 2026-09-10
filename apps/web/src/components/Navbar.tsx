import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Car, Search, Shield, Sun, Moon, Scale, Code, Menu, X, Flame } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
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

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `font-medium text-sm transition-colors py-1 border-b-2 ${
      isActive
        ? 'text-red-500 border-red-500 font-semibold'
        : 'text-slate-300 border-transparent hover:text-white hover:border-slate-500'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-red-600 to-orange-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="font-display font-extrabold text-xl tracking-tight text-white">
              FH6<span className="text-red-500">CARS</span>
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
                className="w-full bg-slate-900/90 text-white text-xs rounded-full pl-9 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-red-500 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
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

          {/* User & Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Admin Link */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin"
                  className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 hover:bg-red-600/30"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-400"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-3 bg-slate-900 border-b border-slate-800">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-white text-sm rounded-lg px-3 py-2 border border-slate-700"
            />
          </form>
          <div className="flex flex-col space-y-2 pt-2">
            <Link to="/cars" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 py-1.5">Browse Cars</Link>
            <Link to="/brands" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 py-1.5">Brands</Link>
            <Link to="/compare" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 py-1.5">Compare Cars</Link>
            <Link to="/api" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 py-1.5">API Docs</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 py-1.5">About</Link>
            {isAuthenticated ? (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-red-400 py-1.5 font-bold">Admin Dashboard</Link>
            ) : (
              <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 py-1.5">Admin Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
