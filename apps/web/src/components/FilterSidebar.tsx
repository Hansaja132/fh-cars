import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Brand } from '@fh6-cars/shared';

interface FilterSidebarProps {
  brands: Brand[];
  selectedBrand: string;
  selectedClass: string;
  selectedDrivetrain: string;
  minPi: number;
  maxPi: number;
  isDlc: boolean | undefined;
  onBrandChange: (brand: string) => void;
  onClassChange: (carClass: string) => void;
  onDrivetrainChange: (drivetrain: string) => void;
  onPiChange: (min: number, max: number) => void;
  onDlcChange: (isDlc: boolean | undefined) => void;
  onReset: () => void;
}

const CLASSES = ['D', 'C', 'B', 'A', 'S1', 'S2', 'R', 'X'];
const DRIVETRAINS = ['FWD', 'RWD', 'AWD'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  brands,
  selectedBrand,
  selectedClass,
  selectedDrivetrain,
  minPi,
  maxPi,
  isDlc,
  onBrandChange,
  onClassChange,
  onDrivetrainChange,
  onPiChange,
  onDlcChange,
  onReset,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-6 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-foreground text-base">Filter Cars</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-text-muted hover:text-primary flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Class Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Performance Class
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => onClassChange('')}
            className={`px-2 py-1 text-xs font-bold rounded border transition-colors ${
              !selectedClass
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-muted text-text-secondary border-border hover:text-foreground'
            }`}
          >
            All
          </button>
          {CLASSES.map((c) => (
            <button
              key={c}
              onClick={() => onClassChange(selectedClass === c ? '' : c)}
              className={`px-2 py-1 text-xs font-bold rounded border transition-colors ${
                selectedClass === c
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-muted text-text-secondary border-border hover:text-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Manufacturer / Brand
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="w-full bg-surface text-foreground text-xs rounded-lg px-3 py-2 border border-border focus:outline-none focus:border-primary transition-colors"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Drivetrain Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Drivetrain
        </label>
        <div className="grid grid-cols-3 gap-2">
          {DRIVETRAINS.map((dt) => (
            <button
              key={dt}
              onClick={() => onDrivetrainChange(selectedDrivetrain === dt ? '' : dt)}
              className={`px-2 py-1.5 text-xs font-mono font-bold rounded border transition-colors ${
                selectedDrivetrain === dt
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-muted text-text-secondary border-border hover:text-foreground'
              }`}
            >
              {dt}
            </button>
          ))}
        </div>
      </div>

      {/* PI Range */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-text-secondary">
          <span className="uppercase tracking-wider">PI Range</span>
          <span className="font-mono text-primary font-bold">
            {minPi} - {maxPi}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="100"
            max="999"
            placeholder="Min PI"
            value={minPi || ''}
            onChange={(e) => onPiChange(Number(e.target.value) || 100, maxPi)}
            className="w-full bg-surface text-foreground text-xs rounded px-2 py-1.5 border border-border focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            min="100"
            max="999"
            placeholder="Max PI"
            value={maxPi || ''}
            onChange={(e) => onPiChange(minPi, Number(e.target.value) || 999)}
            className="w-full bg-surface text-foreground text-xs rounded px-2 py-1.5 border border-border focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* DLC Filter */}
      <div className="pt-2 border-t border-border">
        <label className="flex items-center space-x-2 cursor-pointer text-xs text-text-secondary hover:text-foreground transition-colors">
          <input
            type="checkbox"
            checked={isDlc === true}
            onChange={(e) => onDlcChange(e.target.checked ? true : undefined)}
            className="rounded border-border text-primary focus:ring-primary bg-surface accent-primary"
          />
          <span>Show DLC Cars Only</span>
        </label>
      </div>
    </div>
  );
};
