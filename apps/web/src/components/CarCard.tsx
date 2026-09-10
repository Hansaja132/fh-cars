import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@fh6-cars/shared';
import { ClassBadge } from './ClassBadge';
import { Sparkles, Gauge, Zap } from 'lucide-react';

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
      className="group relative bg-slate-900/80 border border-slate-800 hover:border-red-500/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-red-500/10 flex flex-col justify-between"
    >
      {/* DLC Badge */}
      {car.isDlc && (
        <div className="absolute top-3 right-3 z-10 bg-amber-500/90 text-black text-xs font-black uppercase px-2 py-0.5 rounded shadow flex items-center gap-1 backdrop-blur-sm">
          <Sparkles className="w-3 h-3" />
          DLC
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={primaryImage}
          alt={car.fullName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
      </div>

      {/* Card Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
            {car.year} {brandName}
          </div>
          <h3 className="font-display font-bold text-lg text-white group-hover:text-red-400 transition-colors line-clamp-1">
            {car.model}
          </h3>
          <div className="text-xs text-slate-400 mt-0.5">{car.carType}</div>
        </div>

        {/* Footer badges */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <ClassBadge className={car.class} pi={car.basePi} size="sm" />

          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300">
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {car.drivetrain}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
