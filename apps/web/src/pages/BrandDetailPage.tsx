import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { CarCard } from '../components/CarCard';
import { ArrowLeft, Building2 } from 'lucide-react';

export const BrandDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: brand, isLoading, isError } = useQuery({
    queryKey: ['brand', slug],
    queryFn: () => apiService.getBrandBySlug(slug || ''),
    enabled: !!slug,
  });

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-text-muted">Loading brand details...</div>;
  }

  if (isError || !brand) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Brand Not Found</h2>
        <Link to="/brands" className="inline-block bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-xl shadow">
          Back to Brands
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors">
      <Link to="/brands" className="inline-flex items-center space-x-2 text-xs font-semibold text-text-muted hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Brands</span>
      </Link>

      <div className="bg-card border border-border p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>{brand.country || 'Global'}</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl text-foreground">{brand.name}</h1>
          <p className="text-xs text-text-muted">Total cataloged cars: {brand.cars?.length ?? 0}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display font-bold text-xl text-foreground">Models by {brand.name}</h2>
        {brand.cars && brand.cars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brand.cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border p-8 rounded-xl text-center text-text-muted text-sm shadow-sm">
            No models currently registered under {brand.name}.
          </div>
        )}
      </div>
    </div>
  );
};
