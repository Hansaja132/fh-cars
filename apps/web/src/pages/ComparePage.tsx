import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Car } from '@fh6-cars/shared';
import { ClassBadge } from '../components/ClassBadge';
import { Scale, Plus, X } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center space-x-2 text-primary mb-1">
            <Scale className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Side-By-Side Spec Analysis</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-foreground">Compare Cars</h1>
          <p className="text-xs text-text-muted mt-1">Select up to 4 Forza Horizon 6 cars to compare specs & ratings</p>
        </div>

        {/* Add Car Button */}
        {selectedCarIds.length < 4 && (
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="bg-secondary hover:bg-secondary-hover text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Car ({selectedCarIds.length}/4)</span>
            </button>

            {/* Dropdown search modal */}
            {searchOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-surface border border-border rounded-2xl shadow-xl z-30 p-3 space-y-3">
                <input
                  type="text"
                  placeholder="Type car or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background text-foreground text-xs rounded-xl px-3 py-2 border border-border focus:outline-none focus:border-primary"
                  autoFocus
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((car) => (
                      <button
                        key={car.id}
                        onClick={() => addCarToCompare(car.id)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-xs text-foreground flex justify-between items-center transition-colors"
                      >
                        <span className="truncate">{car.fullName}</span>
                        <ClassBadge className={car.class} pi={car.basePi} size="sm" />
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-text-muted p-2 text-center">No available cars found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {selectedCars.length > 0 ? (
        <div className="overflow-x-auto bg-card border border-border rounded-2xl shadow-sm">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="p-4 w-48 text-xs uppercase font-extrabold text-text-muted">Spec Metric</th>
                {selectedCars.map((car) => (
                  <th key={car.id} className="p-4 text-center border-l border-border">
                    <div className="relative space-y-2">
                      <button
                        onClick={() => removeCar(car.id)}
                        className="absolute -top-2 -right-2 text-text-muted hover:text-danger p-1 transition-colors"
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
                        className="w-28 h-16 object-cover mx-auto rounded-lg border border-border shadow-sm"
                      />
                      <div className="font-display font-bold text-sm text-foreground">{car.model}</div>
                      <div className="text-[11px] text-text-muted">{car.brand?.name}</div>
                      <ClassBadge className={car.class} pi={car.basePi} size="sm" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border text-xs">
              {/* Class & Base PI */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Base PI Rating</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-primary text-sm border-l border-border">
                    {car.basePi}
                  </td>
                ))}
              </tr>

              {/* Drivetrain */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Drivetrain</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-foreground border-l border-border">
                    {car.drivetrain}
                  </td>
                ))}
              </tr>

              {/* Speed */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Speed</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-foreground border-l border-border">
                    {car.stats?.speed?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Handling */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Handling</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-foreground border-l border-border">
                    {car.stats?.handling?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Acceleration */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Acceleration</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-foreground border-l border-border">
                    {car.stats?.acceleration?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Launch */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Launch</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-foreground border-l border-border">
                    {car.stats?.launch?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Braking */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Braking</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-foreground border-l border-border">
                    {car.stats?.braking?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Offroad */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Offroad</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono font-bold text-foreground border-l border-border">
                    {car.stats?.offroad?.toFixed(1) ?? 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Power */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Power (HP)</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono text-foreground border-l border-border">
                    {car.stats?.powerHp ? `${car.stats.powerHp} HP` : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Weight */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Weight (KG)</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono text-foreground border-l border-border">
                    {car.stats?.weightKg ? `${car.stats.weightKg} kg` : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Top Speed */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Top Speed</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center font-mono text-foreground border-l border-border">
                    {car.stats?.topSpeedKmh ? `${car.stats.topSpeedKmh} km/h` : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Aspiration */}
              <tr className="hover:bg-elevated/50 transition-colors">
                <td className="p-4 font-semibold text-text-secondary">Aspiration</td>
                {selectedCars.map((car) => (
                  <td key={car.id} className="p-4 text-center text-text-secondary border-l border-border">
                    {car.engine?.aspiration || 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-border p-12 rounded-2xl text-center space-y-4 shadow-sm">
          <div className="text-text-muted font-display text-lg">No cars selected for comparison</div>
          <button
            onClick={() => setSelectedCarIds([1, 2])}
            className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-xl shadow"
          >
            Load Sample Comparison
          </button>
        </div>
      )}
    </div>
  );
};
