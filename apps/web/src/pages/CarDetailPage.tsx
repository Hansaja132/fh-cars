import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { ClassBadge } from '../components/ClassBadge';
import { StatGauge } from '../components/StatGauge';
import { ArrowLeft, ShieldCheck, Gauge, Sparkles, ExternalLink, Cpu, Car as CarIcon } from 'lucide-react';

export const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const carId = parseInt(id || '0', 10);
  const [imageFailed, setImageFailed] = useState(false);

  const { data: car, isLoading, isError } = useQuery({
    queryKey: ['car', carId],
    queryFn: () => apiService.getCarById(carId),
    enabled: carId > 0,
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto" />
        <div className="h-96 w-full bg-card rounded-2xl animate-pulse border border-border" />
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Car Not Found</h2>
        <p className="text-text-muted text-sm">The car ID you requested does not exist in our database.</p>
        <Link to="/cars" className="inline-block bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-xl shadow">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const primaryImage =
    car.images?.find((img) => img.isPrimary)?.imageUrl ||
    car.images?.[0]?.imageUrl ||
    null;

  const brandName = car.brand?.name || 'Manufacturer';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors">
      {/* Back Button */}
      <Link
        to="/cars"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cars Catalog</span>
      </Link>

      {/* Main Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Car Image / Placeholder Box */}
          <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[320px] bg-surface flex items-center justify-center border-b lg:border-b-0 lg:border-r border-border">
            {primaryImage && !imageFailed ? (
              <img
                src={primaryImage}
                alt={car.fullName}
                className="w-full h-full object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="w-full h-full min-h-[320px] bg-gradient-to-br from-card via-surface to-muted flex flex-col items-center justify-center p-8 text-center space-y-2 select-none">
                <CarIcon className="w-16 h-16 text-primary/40" />
                <span className="font-display font-extrabold text-lg uppercase tracking-wider text-foreground">
                  {car.fullName}
                </span>
                <span className="text-xs font-mono text-text-muted bg-card px-3 py-1 rounded-lg border border-border">
                  NO IMAGE ATTACHED
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-card/90 via-transparent to-transparent pointer-events-none" />
            {car.isDlc && (
              <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded shadow flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                DLC Content
              </div>
            )}
          </div>

          {/* Right Column: Key Overview Header */}
          <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Link to={`/brands/${car.brand?.slug}`} className="hover:underline">
                  {brandName}
                </Link>
                <span>•</span>
                <span>{car.year}</span>
                <span>•</span>
                <span>{car.country}</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground leading-tight">
                {car.model}
              </h1>
              <p className="text-xs text-text-muted">{car.fullName}</p>
            </div>

            {/* Quick Specs Badges */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-3">
                <ClassBadge className={car.class} pi={car.basePi} size="lg" />
                <span className="bg-muted px-3 py-1 rounded border border-border text-xs font-mono font-bold text-foreground">
                  {car.drivetrain}
                </span>
                <span className="bg-muted px-3 py-1 rounded border border-border text-xs font-medium text-text-secondary">
                  {car.carType}
                </span>
              </div>

              {car.carOrdinal && (
                <div className="text-xs text-text-muted font-mono">
                  Car Ordinal: #{car.carOrdinal}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Specs & Performance Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Performance Ratings (In-game 0-10 stats) */}
        <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center space-x-2">
              <Gauge className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg text-foreground">Performance Ratings</h3>
            </div>
            <span className="text-xs text-text-muted font-mono">Rating Scale: 0.0 - 10.0</span>
          </div>

          <div className="space-y-4">
            <StatGauge label="Speed" value={car.stats?.speed} color="bg-primary" />
            <StatGauge label="Handling" value={car.stats?.handling} color="bg-primary" />
            <StatGauge label="Acceleration" value={car.stats?.acceleration} color="bg-primary" />
            <StatGauge label="Launch" value={car.stats?.launch} color="bg-primary" />
            <StatGauge label="Braking" value={car.stats?.braking} color="bg-primary" />
            <StatGauge label="Offroad" value={car.stats?.offroad} color="bg-primary" />
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-3 border-b border-border">
            <Cpu className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-lg text-foreground">Technical Specifications</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface p-3.5 rounded-xl border border-border">
              <div className="text-xs text-text-muted uppercase font-semibold">Power</div>
              <div className="text-lg font-bold font-mono text-foreground mt-0.5">
                {car.stats?.powerHp ? `${car.stats.powerHp} HP` : 'N/A'}
              </div>
            </div>

            <div className="bg-surface p-3.5 rounded-xl border border-border">
              <div className="text-xs text-text-muted uppercase font-semibold">Torque</div>
              <div className="text-lg font-bold font-mono text-foreground mt-0.5">
                {car.stats?.torqueNm ? `${car.stats.torqueNm} Nm` : 'N/A'}
              </div>
            </div>

            <div className="bg-surface p-3.5 rounded-xl border border-border">
              <div className="text-xs text-text-muted uppercase font-semibold">Weight</div>
              <div className="text-lg font-bold font-mono text-foreground mt-0.5">
                {car.stats?.weightKg ? `${car.stats.weightKg} kg` : 'N/A'}
              </div>
            </div>

            <div className="bg-surface p-3.5 rounded-xl border border-border">
              <div className="text-xs text-text-muted uppercase font-semibold">Top Speed</div>
              <div className="text-lg font-bold font-mono text-foreground mt-0.5">
                {car.stats?.topSpeedKmh ? `${car.stats.topSpeedKmh} km/h` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Engine Specs Subpanel */}
          {car.engine && (
            <div className="bg-surface p-4 rounded-xl border border-border space-y-3">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-primary">Powertrain & Engine</h4>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <span className="text-text-muted">Engine Layout:</span>{' '}
                  <strong className="text-foreground">{car.engine.engineLayout || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-text-muted">Cylinders:</span>{' '}
                  <strong className="text-foreground">{car.engine.cylinders ?? 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-text-muted">Displacement:</span>{' '}
                  <strong className="text-foreground">
                    {car.engine.displacementCc ? `${car.engine.displacementCc} cc` : 'N/A'}
                  </strong>
                </div>
                <div>
                  <span className="text-text-muted">Aspiration:</span>{' '}
                  <strong className="text-foreground">{car.engine.aspiration || 'N/A'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sources & Data Provenance */}
      {car.sources && car.sources.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-success" />
            <h3 className="font-display font-bold text-lg text-foreground">Data Attribution & Verification</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {car.sources.map((src) => (
              <div key={src.id} className="bg-surface p-3.5 rounded-xl border border-border flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-foreground flex items-center space-x-1.5">
                    <span>{src.sourceName}</span>
                    {src.verified && (
                      <span className="bg-success/10 text-success text-[10px] px-1.5 py-0.2 rounded border border-success/30 font-mono">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <div className="text-text-muted text-[11px] mt-0.5">Type: {src.sourceType}</div>
                </div>
                {src.sourceUrl && (
                  <a
                    href={src.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center space-x-1 font-semibold"
                  >
                    <span>Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
