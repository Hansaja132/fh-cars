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
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-red-500" />
          <h3 className="font-display font-bold text-white text-base">Filter Cars</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-red-400 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Class Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Performance Class
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => onClassChange('')}
            className={`px-2 py-1 text-xs font-bold rounded border transition-colors ${
              !selectedClass
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
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
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Manufacturer / Brand
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="w-full bg-slate-950 text-white text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-red-500"
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
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Drivetrain
        </label>
        <div className="grid grid-cols-3 gap-2">
          {DRIVETRAINS.map((dt) => (
            <button
              key={dt}
              onClick={() => onDrivetrainChange(selectedDrivetrain === dt ? '' : dt)}
              className={`px-2 py-1.5 text-xs font-mono font-bold rounded border transition-colors ${
                selectedDrivetrain === dt
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {dt}
            </button>
          ))}
        </div>
      </div>

      {/* PI Range */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
          <span className="uppercase tracking-wider">PI Range</span>
          <span className="font-mono text-red-400 font-bold">
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
            className="w-full bg-slate-950 text-white text-xs rounded px-2 py-1.5 border border-slate-700"
          />
          <input
            type="number"
            min="100"
            max="999"
            placeholder="Max PI"
            value={maxPi || ''}
            onChange={(e) => onPiChange(minPi, Number(e.target.value) || 999)}
            className="w-full bg-slate-950 text-white text-xs rounded px-2 py-1.5 border border-slate-700"
          />
        </div>
      </div>

      {/* DLC Filter */}
      <div className="pt-2 border-t border-slate-800">
        <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300">
          <input
            type="checkbox"
            checked={isDlc === true}
            onChange={(e) => onDlcChange(e.target.checked ? true : undefined)}
            className="rounded border-slate-700 text-red-600 focus:ring-red-500 bg-slate-950"
          />
          <span>Show DLC Cars Only</span>
        </label>
      </div>
    </div>
  );
};
