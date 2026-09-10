import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Car } from '@fh6-cars/shared';
import { ClassBadge } from '../components/ClassBadge';
import { Scale, Plus, X, Search, Check } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const [selectedCarIds, setSelectedCarIds] = useState<number[]>([1, 2]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  // Fetch all cars for selection picker
  const { data: carsCatalog } = useQuery({
    queryKey: ['allCarsForCompare'],
    queryFn: () => apiService.getCars({ limit: 100 }),
  });

  const availableCars = carsCatalog?.data || [];

  const selectedCars = selectedCarIds
    .map((id) => availableCars.find((c) => c.id === id))
    .filter((c): c is Car => c !== undefined);

  const addCarToCompare = (carId: number) => {
    if (selectedCarIds.length < 4 && !selectedCarIds.includes(carId)) {
      setSelectedCarIds([...selectedCarIds, carId]);
    }
    setSearchOpen(false);
  };

  const removeCar = (carId: number) => {
    setSelectedCarIds(selectedCarIds.filter((id) => id !== carId));
  };

  const filteredOptions = availableCars.filter(
    (c) =>
      !selectedCarIds.includes(c.id) &&
      (c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-red-500 mb-1">
            <Scale className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Side-By-Side Spec Analysis</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-white">Compare Cars</h1>
          <p className="text-xs text-slate-400 mt-1">Select up to 4 Forza Horizon 6 cars to compare specs & ratings</p>
        </div>

        {/* Add Car Button */}
        {selectedCarIds.length < 4 && (
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Car ({selectedCarIds.length}/4)</span>
            </button>

            {/* Dropdown search modal */}
            {searchOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-30 p-3 space-y-3">
                <input
                  type="text"
                  placeholder="Type car or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-red-500"
                  autoFocus
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((car) => (
                      <button
                        key={car.id}
                        onClick={() => addCarToCompare(car.id)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex justify-between items-center"
                      >
                        <span className="truncate">{car.fullName}</span>
                        <ClassBadge className={car.class} pi={car.basePi} size="sm" />
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 p-2 text-center">No available cars found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {selectedCars.length > 0 ? (
        <div className="overflow-x-auto bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60">
                <th className="p-4 w-48 text-xs uppercase font-extrabold text-slate-400">Spec Metric</th>
                {selectedCars.map((car) => (
                  <th key={car.id} className="p-4 text-center border-l border-slate-800/80">
                    <div className="relative space-y-2">
                      <button
                        onClick={() => removeCar(car.id)}
                        className="absolute -top-2 -right-2 text-slate-500 hover:text-red-400 p-1"
                        title="Remove car"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img
                        src={
                          car.images?.[0]?.imageUrl ||
                          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={car.fullName}
                        className="w-28 h-16 object-cover mx-auto rounded-lg border border-slate-800"
                      />
                      <div className="font-display font-bold text-sm text-white">{car.model}</div>
                      <div className="text-[11px] text-slate-400">{car.brand?.name}</div>
                      <ClassBadge className={car.class} pi={car.basePi} size="sm" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs">
              {/* Class & Base PI */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Base PI Rating</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-red-400 text-sm border-l border-slate-800/60">
                    {car.basePi}
                  </td>
                ))}
              </tr>

              {/* Drivetrain */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Drivetrain</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-slate-200 border-l border-slate-800/60">
                    {car.drivetrain}
                  </td>
                ))}
              </tr>

              {/* Speed */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Speed</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-white border-l border-slate-800/60">
                    {car.stats?.speed?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Handling */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Handling</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-white border-l border-slate-800/60">
                    {car.stats?.handling?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Acceleration */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Acceleration</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-white border-l border-slate-800/60">
                    {car.stats?.acceleration?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Launch */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Launch</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-white border-l border-slate-800/60">
                    {car.stats?.launch?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Braking */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Braking</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-white border-l border-slate-800/60">
                    {car.stats?.braking?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Offroad */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Offroad</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-white border-l border-slate-800/60">
                    {car.stats?.offroad?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Power */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Power (HP)</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono text-white border-l border-slate-800/60">
                    {car.stats?.powerHp ? `${car.stats.powerHp} HP` : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Weight */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Weight (KG)</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono text-white border-l border-slate-800/60">
                    {car.stats?.weightKg ? `${car.stats.weightKg} kg` : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Top Speed */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Top Speed</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono text-white border-l border-slate-800/60">
                    {car.stats?.topSpeedKmh ? `${car.stats.topSpeedKmh} km/h` : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Aspiration */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Aspiration</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center text-slate-300 border-l border-slate-800/60">
                    {car.engine?.aspiration || 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-2xl text-center space-y-4">
          <div className="text-slate-400 font-display text-lg">No cars selected for comparison</div>
          <button
            onClick={() => setSelectedCarIds([1, 2])}
            className="bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            Load Sample Comparison
          </button>
        </div>
      )}
    </div>
  );
};
