import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Building2, ChevronRight } from 'lucide-react';

export const BrandsPage: React.FC = () => {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => apiService.getBrands(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors">
      {/* Header */}
      <div className="pb-6 border-b border-border space-y-1">
        <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Automotive Manufacturers</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-foreground">Car Brands</h1>
        <p className="text-xs text-text-muted">Explore manufacturers cataloged in Forza Horizon 6</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-elevated rounded-xl animate-pulse border border-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="group bg-card border border-border hover:border-primary p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {brand.name}
                </h3>
                <div className="text-xs text-text-muted">{brand.country || 'Global'}</div>
                <div className="text-xs font-mono text-primary font-semibold pt-1">
                  {(brand as any)._count?.cars ?? 0} Models
                </div>
              </div>
              <div className="p-2 bg-muted group-hover:bg-primary text-text-secondary group-hover:text-primary-foreground rounded-xl transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
