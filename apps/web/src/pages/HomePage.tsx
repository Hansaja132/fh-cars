import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Search, Gauge, Database, ArrowRight } from 'lucide-react';
import { ClassBadge } from '../components/ClassBadge';
import { CarCard } from '../components/CarCard';

const CLASSES = ['D', 'C', 'B', 'A', 'S1', 'S2', 'R', 'X'];

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ['statistics'],
    queryFn: () => apiService.getStatistics(),
  });

  const { data: featuredCars } = useQuery({
    queryKey: ['featuredCars'],
    queryFn: () => apiService.getCars({ limit: 6, sort: 'basePi', order: 'desc' }),
  });

  const { data: brands } = useQuery({
    queryKey: ['popularBrands'],
    queryFn: () => apiService.getBrands(),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16 transition-colors">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl bg-surface border border-border shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            <Gauge className="w-4 h-4 text-primary" />
            <span>Standalone FH6 Car Database & Public REST API</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-foreground tracking-tight leading-tight">
            Forza Horizon 6 <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-primary-hover bg-clip-text text-transparent">
              Car Database & API
            </span>
          </h1>

          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore complete car performance statistics, base PI ratings, classes, engines, manufacturers, and specifications. Open public REST API for developers.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
            <div className="relative flex items-center shadow-lg">
              <input
                type="text"
                placeholder="Search by model, manufacturer (e.g. Supra, Ferrari, GT-R)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background text-foreground placeholder:text-text-muted text-sm sm:text-base rounded-2xl pl-12 pr-32 py-4 border-2 border-border focus:outline-none focus:border-primary shadow-inner"
              />
              <Search className="w-5 h-5 text-text-muted absolute left-4" />
              <button
                type="submit"
                className="absolute right-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow transition-transform active:scale-95 flex items-center space-x-1"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/cars"
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              Browse All Cars
            </Link>
            <Link
              to="/api"
              className="bg-surface hover:bg-muted border border-border text-foreground font-bold px-6 py-3 rounded-xl transition-all flex items-center space-x-2 shadow-sm"
            >
              <Database className="w-4 h-4 text-primary" />
              <span>API Documentation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold font-display text-primary">
              {stats?.totalCars ?? 20}+
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-text-secondary">Cars Cataloged</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold font-display text-primary">
              {stats?.totalBrands ?? 15}+
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-text-secondary">Manufacturers</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold font-display text-primary">8</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-text-secondary">Classes (D to X)</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold font-display text-primary">100%</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-text-secondary">REST API Ready</div>
          </div>
        </div>
      </section>

      {/* Browse By Class */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-foreground">Browse By Performance Class</h2>
            <p className="text-xs text-text-muted mt-1">Filter cars by Forza Horizon PI performance tier</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {CLASSES.map((cls) => (
            <Link
              key={cls}
              to={`/cars?class=${cls}`}
              className="bg-card border border-border hover:border-primary p-4 rounded-xl text-center space-y-2 group transition-all hover:-translate-y-1 shadow-sm"
            >
              <div className="flex justify-center">
                <ClassBadge className={cls} size="lg" />
              </div>
              <div className="text-xs font-mono text-text-muted group-hover:text-foreground transition-colors">
                {stats?.classes?.[cls] ?? 0} Cars
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured High Performance Cars */}
      {featuredCars && featuredCars.data.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-foreground">Featured Cars</h2>
              <p className="text-xs text-text-muted mt-1">High PI hypercars & track monsters</p>
            </div>
            <Link to="/cars" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.data.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Manufacturers Grid */}
      {brands && brands.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-foreground">Popular Manufacturers</h2>
              <p className="text-xs text-text-muted mt-1">Browse cars by automotive brand</p>
            </div>
            <Link to="/brands" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center space-x-1">
              <span>All Brands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {brands.slice(0, 6).map((brand) => (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                className="bg-card border border-border hover:border-primary p-4 rounded-xl text-center space-y-2 group transition-all shadow-sm"
              >
                <div className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
                  {brand.name}
                </div>
                <div className="text-xs text-text-muted font-mono">
                  {brand.country || 'Global'}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
