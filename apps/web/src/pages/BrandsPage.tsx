import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Car, Building2, ChevronRight } from 'lucide-react';

export const BrandsPage: React.FC = () => {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => apiService.getBrands(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 space-y-1">
        <div className="flex items-center space-x-2 text-red-500 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Automotive Manufacturers</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-white">Car Brands</h1>
        <p className="text-xs text-slate-400">Explore manufacturers cataloged in Forza Horizon 6</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-900 rounded-xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="group bg-slate-900/80 border border-slate-800 hover:border-red-500/50 p-6 rounded-2xl flex items-center justify-between shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-white group-hover:text-red-400 transition-colors">
                  {brand.name}
                </h3>
                <div className="text-xs text-slate-400">{brand.country || 'Global'}</div>
                <div className="text-xs font-mono text-red-400/90 pt-1">
                  {(brand as any)._count?.cars ?? 0} Models
                </div>
              </div>
              <div className="p-2 bg-slate-800 group-hover:bg-red-600 text-slate-400 group-hover:text-white rounded-xl transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
