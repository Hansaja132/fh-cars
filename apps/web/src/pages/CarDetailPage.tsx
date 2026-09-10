import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { ClassBadge } from '../components/ClassBadge';
import { StatGauge } from '../components/StatGauge';
import { ArrowLeft, ShieldCheck, Gauge, Zap, Sparkles, ExternalLink, Cpu, Scale } from 'lucide-react';

export const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const carId = parseInt(id || '0', 10);

  const { data: car, isLoading, isError } = useQuery({
    queryKey: ['car', carId],
    queryFn: () => apiService.getCarById(carId),
    enabled: carId > 0,
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="h-8 w-64 bg-slate-800 rounded animate-pulse mx-auto" />
        <div className="h-96 w-full bg-slate-900 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Car Not Found</h2>
        <p className="text-slate-400 text-sm">The car ID you requested does not exist in our database.</p>
        <Link to="/cars" className="inline-block bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const primaryImage =
    car.images?.find((img) => img.isPrimary)?.imageUrl ||
    car.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80';

  const brandName = car.brand?.name || 'Manufacturer';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link
        to="/cars"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cars Catalog</span>
      </Link>

      {/* Main Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Car Image */}
          <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[320px] bg-slate-950">
            <img
              src={primaryImage}
              alt={car.fullName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/90 via-transparent to-transparent" />
            {car.isDlc && (
              <div className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-black uppercase px-3 py-1 rounded shadow flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                DLC Content
              </div>
            )}
          </div>

          {/* Right Column: Key Overview Header */}
          <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-red-400">
                <Link to={`/brands/${car.brand?.slug}`} className="hover:underline">
                  {brandName}
                </Link>
                <span>•</span>
                <span>{car.year}</span>
                <span>•</span>
                <span>{car.country}</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight">
                {car.model}
              </h1>
              <p className="text-xs text-slate-400">{car.fullName}</p>
            </div>

            {/* Quick Specs Badges */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <ClassBadge className={car.class} pi={car.basePi} size="lg" />
                <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700 text-xs font-mono font-bold text-slate-200">
                  {car.drivetrain}
                </span>
                <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700 text-xs font-medium text-slate-300">
                  {car.carType}
                </span>
              </div>

              {car.carOrdinal && (
                <div className="text-xs text-slate-500 font-mono">
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
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Gauge className="w-5 h-5 text-red-500" />
              <h3 className="font-display font-bold text-lg text-white">Performance Ratings</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Rating Scale: 0.0 - 10.0</span>
          </div>

          <div className="space-y-4">
            <StatGauge label="Speed" value={car.stats?.speed} color="from-blue-600 to-cyan-400" />
            <StatGauge label="Handling" value={car.stats?.handling} color="from-emerald-600 to-teal-400" />
            <StatGauge label="Acceleration" value={car.stats?.acceleration} color="from-amber-500 to-yellow-400" />
            <StatGauge label="Launch" value={car.stats?.launch} color="from-orange-600 to-amber-500" />
            <StatGauge label="Braking" value={car.stats?.braking} color="from-rose-600 to-pink-500" />
            <StatGauge label="Offroad" value={car.stats?.offroad} color="from-lime-600 to-green-500" />
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Cpu className="w-5 h-5 text-red-500" />
            <h3 className="font-display font-bold text-lg text-white">Technical Specifications</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Power</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {car.stats?.powerHp ? `${car.stats.powerHp} HP` : 'N/A'}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Torque</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {car.stats?.torqueNm ? `${car.stats.torqueNm} Nm` : 'N/A'}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Weight</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {car.stats?.weightKg ? `${car.stats.weightKg} kg` : 'N/A'}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Top Speed</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {car.stats?.topSpeedKmh ? `${car.stats.topSpeedKmh} km/h` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Engine Specs Subpanel */}
          {car.engine && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-red-400">Powertrain & Engine</h4>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Engine Layout:</span>{' '}
                  <strong className="text-white">{car.engine.engineLayout || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Cylinders:</span>{' '}
                  <strong className="text-white">{car.engine.cylinders ?? 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Displacement:</span>{' '}
                  <strong className="text-white">
                    {car.engine.displacementCc ? `${car.engine.displacementCc} cc` : 'N/A'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">Aspiration:</span>{' '}
                  <strong className="text-white">{car.engine.aspiration || 'N/A'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sources & Data Provenance */}
      {car.sources && car.sources.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-lg text-white">Data Attribution & Verification</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {car.sources.map((src) => (
              <div key={src.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <span>{src.sourceName}</span>
                    {src.verified && (
                      <span className="bg-emerald-950 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded border border-emerald-800 font-mono">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Type: {src.sourceType}</div>
                </div>
                {src.sourceUrl && (
                  <a
                    href={src.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-400 hover:underline flex items-center space-x-1 font-semibold"
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
