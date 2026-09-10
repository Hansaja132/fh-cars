import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { FilterSidebar } from '../components/FilterSidebar';
import { CarCard } from '../components/CarCard';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, Grid, List } from 'lucide-react';
import { ClassBadge } from '../components/ClassBadge';

export const CarsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Query Params state
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const brand = searchParams.get('brand') || '';
  const carClass = searchParams.get('class') || '';
  const drivetrain = searchParams.get('drivetrain') || '';
  const minPi = parseInt(searchParams.get('minPi') || '100', 10);
  const maxPi = parseInt(searchParams.get('maxPi') || '999', 10);
  const isDlc = searchParams.get('isDlc') === 'true' ? true : undefined;
  const sort = searchParams.get('sort') || 'fullName';
  const order = (searchParams.get('order') as 'asc' | 'desc') || 'asc';

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Queries
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => apiService.getBrands(),
  });

  const { data: carsData, isLoading, isError } = useQuery({
    queryKey: ['cars', page, search, brand, carClass, drivetrain, minPi, maxPi, isDlc, sort, order],
    queryFn: () =>
      apiService.getCars({
        page,
        limit: 12,
        search: search || undefined,
        brand: brand || undefined,
        class: carClass || undefined,
        drivetrain: drivetrain || undefined,
        minPi: minPi > 100 ? minPi : undefined,
        maxPi: maxPi < 999 ? maxPi : undefined,
        isDlc,
        sort,
        order,
      }),
  });

  const updateParam = (key: string, value: string | number | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === '' || value === null) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    // reset to page 1 on filter change
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search cars by name, model, country..."
            value={search}
            onChange={(e) => updateParam('search', e.target.value)}
            className="w-full bg-slate-950 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-700 focus:outline-none focus:border-red-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        {/* Sorting & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden bg-slate-800 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 border border-slate-700"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <select
            value={`${sort}-${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split('-');
              updateParam('sort', s);
              updateParam('order', o);
            }}
            className="bg-slate-950 text-white text-xs font-medium rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-red-500"
          >
            <option value="fullName-asc">Sort: Name (A-Z)</option>
            <option value="fullName-desc">Sort: Name (Z-A)</option>
            <option value="basePi-desc">Sort: PI (High to Low)</option>
            <option value="basePi-asc">Sort: PI (Low to High)</option>
            <option value="year-desc">Sort: Year (Newest)</option>
            <option value="year-asc">Sort: Year (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Main Catalog Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter (Desktop) */}
        <div className="hidden lg:block space-y-6">
          <FilterSidebar
            brands={brands}
            selectedBrand={brand}
            selectedClass={carClass}
            selectedDrivetrain={drivetrain}
            minPi={minPi}
            maxPi={maxPi}
            isDlc={isDlc}
            onBrandChange={(b) => updateParam('brand', b)}
            onClassChange={(c) => updateParam('class', c)}
            onDrivetrainChange={(dt) => updateParam('drivetrain', dt)}
            onPiChange={(min, max) => {
              updateParam('minPi', min);
              updateParam('maxPi', max);
            }}
            onDlcChange={(dlc) => updateParam('isDlc', dlc ? 'true' : undefined)}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1">
            <FilterSidebar
              brands={brands}
              selectedBrand={brand}
              selectedClass={carClass}
              selectedDrivetrain={drivetrain}
              minPi={minPi}
              maxPi={maxPi}
              isDlc={isDlc}
              onBrandChange={(b) => updateParam('brand', b)}
              onClassChange={(c) => updateParam('class', c)}
              onDrivetrainChange={(dt) => updateParam('drivetrain', dt)}
              onPiChange={(min, max) => {
                updateParam('minPi', min);
                updateParam('maxPi', max);
              }}
              onDlcChange={(dlc) => updateParam('isDlc', dlc ? 'true' : undefined)}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Cars Content Column */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 bg-slate-900 rounded-xl animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : isError ? (
            <div className="bg-red-950/40 border border-red-500/40 p-8 rounded-xl text-center space-y-2 text-red-200">
              <h3 className="font-bold text-lg">Unable to load cars</h3>
              <p className="text-xs text-red-300">Ensure the API backend is running and accessible.</p>
            </div>
          ) : carsData && carsData.data.length > 0 ? (
            <>
              {/* Results header */}
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>
                  Showing <strong className="text-white">{carsData.data.length}</strong> of{' '}
                  <strong className="text-white">{carsData.pagination.total}</strong> cars
                </span>
                <span>Page {carsData.pagination.page} of {carsData.pagination.totalPages}</span>
              </div>

              {/* Cars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {carsData.data.map((c) => (
                  <CarCard key={c.id} car={c} />
                ))}
              </div>

              {/* Pagination controls */}
              <div className="pt-6 flex justify-center items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => updateParam('page', page - 1)}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <div className="px-4 py-2 font-mono text-xs font-bold text-slate-300 bg-slate-950 rounded-lg border border-slate-800">
                  {page} / {carsData.pagination.totalPages}
                </div>
                <button
                  disabled={page >= carsData.pagination.totalPages}
                  onClick={() => updateParam('page', page + 1)}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-2xl text-center space-y-4">
              <div className="text-slate-400 font-display text-lg">No cars match your search filters</div>
              <button
                onClick={handleResetFilters}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
