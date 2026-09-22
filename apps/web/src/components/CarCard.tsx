import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@fh6-cars/shared';
import { ClassBadge } from './ClassBadge';
import { Sparkles, Car as CarIcon } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const primaryImage =
    car.images?.find((img) => img.isPrimary)?.imageUrl ||
    car.images?.[0]?.imageUrl ||
    null;

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

      {/* Image Container / Placeholder Text Box */}
      <div className="relative h-48 w-full overflow-hidden bg-surface flex items-center justify-center border-b border-border">
        {primaryImage && !imageFailed ? (
          <img
            src={primaryImage}
            alt={car.fullName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-card via-surface to-muted flex flex-col items-center justify-center p-4 text-center space-y-1.5 select-none">
            <CarIcon className="w-10 h-10 text-primary/40 group-hover:text-primary/70 transition-colors" />
            <span className="font-display font-extrabold text-xs uppercase tracking-wider text-text-muted group-hover:text-foreground transition-colors line-clamp-1">
              {car.fullName || `${car.year} ${brandName} ${car.model}`}
            </span>
            <span className="text-[10px] font-mono text-text-muted/60 bg-card/60 px-2 py-0.5 rounded border border-border">
              NO IMAGE ATTACHED
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90 pointer-events-none" />
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
