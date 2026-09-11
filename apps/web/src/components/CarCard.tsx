import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@fh6-cars/shared';
import { ClassBadge } from './ClassBadge';
import { Sparkles } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const primaryImage =
    car.images?.find((img) => img.isPrimary)?.imageUrl ||
    car.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80';

  const brandName = car.brand?.name || 'Manufacturer';

  return (
    <Link
      to={`/cars/${car.id}`}
      className="group relative bg-card border border-border hover:border-primary rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
    >
      {/* DLC Badge */}
      {car.isDlc && (
        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-slate-950 text-xs font-black uppercase px-2 py-0.5 rounded shadow-md flex items-center gap-1 backdrop-blur-sm">
          <Sparkles className="w-3 h-3" />
          DLC
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img
          src={primaryImage}
          alt={car.fullName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />
      </div>

      {/* Card Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            {car.year} {brandName}
          </div>
          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {car.model}
          </h3>
          <div className="text-xs text-text-muted mt-0.5">{car.carType}</div>
        </div>

        {/* Footer badges */}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <ClassBadge className={car.class} pi={car.basePi} size="sm" />

          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-text-secondary">
            <span className="bg-muted px-2 py-0.5 rounded border border-border">
              {car.drivetrain}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
