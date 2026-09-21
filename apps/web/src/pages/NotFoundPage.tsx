import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Compass, ShieldAlert, ArrowRight, Layers, Sparkles, Navigation } from 'lucide-react';
import { ClassBadge } from '../components/ClassBadge';

export const NotFoundPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 - Page Not Found | Forza Horizon 6 Cars Database';
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 transition-colors">
      <div className="max-w-3xl w-full space-y-8 text-center">
        {/* Main 404 Hero Card */}
        <div className="relative bg-card/90 backdrop-blur-xl border border-border/80 p-8 sm:p-14 rounded-3xl shadow-2xl overflow-hidden transition-all">
          {/* Decorative Radial Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            {/* Top Error Status Badge */}
            <div>
              <span className="inline-flex items-center space-x-2 bg-danger/10 text-danger border border-danger/25 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Error 404 • Navigation Lost</span>
              </span>
            </div>

            {/* Giant 404 Typography & PI Rating Pill */}
            <div className="space-y-3">
              <div className="font-display font-black text-7xl sm:text-9xl tracking-tight leading-none bg-gradient-to-r from-primary via-secondary to-primary-hover bg-clip-text text-transparent select-none drop-shadow-sm">
                404
              </div>
              <div className="inline-block bg-surface border border-border px-4 py-1 rounded-full shadow-xs">
                <span className="text-xs font-mono font-bold text-text-secondary uppercase tracking-widest flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                  <span>PI Rating: <strong className="text-primary font-extrabold">404</strong> (Out of Bounds)</span>
                </span>
              </div>
            </div>

            {/* Message Header & Explanation */}
            <div className="space-y-2 max-w-lg mx-auto">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
                Looks like you've driven off the map!
              </h1>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                The route or car page you are searching for is unavailable or has been relocated in the FH6 database.
              </p>
            </div>

            {/* Integrated Car Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto pt-2">
              <div className="relative flex items-center shadow-sm">
                <Search className="absolute left-4 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vehicles e.g. Supra, Ferrari, GT-R..."
                  className="w-full bg-surface border border-border text-foreground text-xs sm:text-sm pl-11 pr-24 py-3 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
                  id="not-found-search-input"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
                  id="not-found-search-btn"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Navigation Button Options */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-98"
                id="not-found-home-link"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </Link>

              <Link
                to="/cars"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-surface hover:bg-muted text-foreground border border-border hover:border-primary/50 font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-all active:scale-98"
                id="not-found-cars-link"
              >
                <Compass className="w-4 h-4 text-primary" />
                <span>Browse All Cars</span>
              </Link>

              <Link
                to="/brands"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-surface hover:bg-muted text-foreground border border-border hover:border-secondary/50 font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-all active:scale-98"
                id="not-found-brands-link"
              >
                <Layers className="w-4 h-4 text-secondary" />
                <span>View Manufacturers</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts Bar */}
        <div className="bg-surface/80 border border-border p-4 rounded-2xl max-w-xl mx-auto flex flex-wrap items-center justify-center gap-3 text-xs shadow-xs">
          <span className="font-bold text-foreground flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Popular Categories:</span>
          </span>
          
          <Link to="/cars?class=S2" className="inline-flex items-center space-x-1 hover:opacity-80 transition-opacity">
            <ClassBadge className="S2" size="sm" />
            <span className="text-text-secondary font-semibold">Hypercars</span>
          </Link>

          <Link to="/cars?class=S1" className="inline-flex items-center space-x-1 hover:opacity-80 transition-opacity">
            <ClassBadge className="S1" size="sm" />
            <span className="text-text-secondary font-semibold">Supercars</span>
          </Link>

          <Link to="/compare" className="text-primary hover:underline font-bold">
            Compare Cars
          </Link>

          <Link to="/api" className="text-text-muted hover:text-foreground font-medium">
            API Docs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
