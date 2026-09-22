import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Car } from '@fh6-cars/shared';
import { ClassBadge } from '../../components/ClassBadge';
import {
  Shield,
  Plus,
  FileSpreadsheet,
  Trash2,
  Edit,
  Search,
  X,
  Upload,
  Image as ImageIcon,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react';
interface CarImageFormItem {
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'cars' | 'audit'>('cars');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string>('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form states for Create/Edit
  const [formState, setFormState] = useState({
    year: 2022,
    brandId: 1,
    model: '',
    fullName: '',
    class: 'A',
    basePi: 750,
    drivetrain: 'RWD',
    carType: 'Modern Sports Cars',
    country: 'Japan',
    isDlc: false,
    speed: 7.5,
    handling: 7.0,
    acceleration: 7.2,
    launch: 7.0,
    braking: 7.1,
    offroad: 5.0,
    powerHp: 400,
    torqueNm: 500,
    weightKg: 1450,
    topSpeedKmh: 280,
  });

  // Supabase Storage Image management state
  const [carImages, setCarImages] = useState<CarImageFormItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualUrlInput, setManualUrlInput] = useState('');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-text-muted opacity-50 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-primary" />
    ) : (
      <ArrowDown className="w-3 h-3 text-primary" />
    );
  };

  // Queries
  const { data: carsData, isLoading: isLoadingCars } = useQuery({
    queryKey: ['adminCars', search, page, pageSize, sortField, sortOrder],
    queryFn: () =>
      apiService.getCars({
        search,
        page,
        limit: pageSize,
        sort: sortField,
        order: sortOrder,
      }),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => apiService.getBrands(),
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => apiService.getAuditLogs(),
    enabled: activeTab === 'audit',
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiService.deleteCar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCars'] });
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      editingCar
        ? apiService.updateCar(editingCar.id, data)
        : apiService.createCar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCars'] });
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      setModalOpen(false);
      setEditingCar(null);
    },
  });

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleOpenCreate = () => {
    setEditingCar(null);
    setCarImages([]);
    setUploadError(null);
    setManualUrlInput('');
    setFormState({
      year: 2024,
      brandId: brands[0]?.id || 1,
      model: '',
      fullName: '',
      class: 'A',
      basePi: 750,
      drivetrain: 'RWD',
      carType: 'Sports Car',
      country: 'Japan',
      isDlc: false,
      speed: 7.5,
      handling: 7.0,
      acceleration: 7.2,
      launch: 7.0,
      braking: 7.1,
      offroad: 5.0,
      powerHp: 400,
      torqueNm: 500,
      weightKg: 1450,
      topSpeedKmh: 280,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (car: Car) => {
    setEditingCar(car);
    setUploadError(null);
    setManualUrlInput('');
    setCarImages(
      car.images
        ? car.images.map((img, idx) => ({
            imageUrl: img.imageUrl,
            altText: img.altText || '',
            isPrimary: img.isPrimary ?? idx === 0,
            sortOrder: img.sortOrder ?? idx,
          }))
        : []
    );
    setFormState({
      year: car.year,
      brandId: car.brandId,
      model: car.model,
      fullName: car.fullName,
      class: car.class,
      basePi: car.basePi,
      drivetrain: car.drivetrain,
      carType: car.carType,
      country: car.country,
      isDlc: car.isDlc,
      speed: car.stats?.speed ?? 7.0,
      handling: car.stats?.handling ?? 7.0,
      acceleration: car.stats?.acceleration ?? 7.0,
      launch: car.stats?.launch ?? 7.0,
      braking: car.stats?.braking ?? 7.0,
      offroad: car.stats?.offroad ?? 5.0,
      powerHp: car.stats?.powerHp ?? 400,
      torqueNm: car.stats?.torqueNm ?? 500,
      weightKg: car.stats?.weightKg ?? 1450,
      topSpeedKmh: car.stats?.topSpeedKmh ?? 280,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const file = files[0];
      const result = await apiService.uploadCarImage(file);
      const newImage: CarImageFormItem = {
        imageUrl: result.imageUrl,
        thumbnailUrl: result.thumbnailUrl,
        altText: `${formState.model || 'Car'} Image`,
        isPrimary: carImages.length === 0,
        sortOrder: carImages.length,
      };
      setCarImages((prev) => [...prev, newImage]);

    } catch (err: any) {
      console.error('Failed to upload image:', err);
      setUploadError(err?.response?.data?.message || 'Failed to upload image to Supabase storage bucket.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput || !manualUrlInput.trim()) return;
    const newImage: CarImageFormItem = {
      imageUrl: manualUrlInput.trim(),
      altText: `${formState.model || 'Car'} Image`,
      isPrimary: carImages.length === 0,
      sortOrder: carImages.length,
    };
    setCarImages((prev) => [...prev, newImage]);
    setManualUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setCarImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    setCarImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = formState.fullName || `${formState.year} ${brands.find(b=>b.id===formState.brandId)?.name || ''} ${formState.model}`;
    
    saveMutation.mutate({
      year: Number(formState.year),
      brandId: Number(formState.brandId),
      model: formState.model,
      fullName,
      class: formState.class,
      basePi: Number(formState.basePi),
      drivetrain: formState.drivetrain,
      carType: formState.carType,
      country: formState.country,
      isDlc: formState.isDlc,
      images: carImages,
      stats: {
        speed: Number(formState.speed),
        handling: Number(formState.handling),
        acceleration: Number(formState.acceleration),
        launch: Number(formState.launch),
        braking: Number(formState.braking),
        offroad: Number(formState.offroad),
        powerHp: Number(formState.powerHp),
        torqueNm: Number(formState.torqueNm),
        weightKg: Number(formState.weightKg),
        topSpeedKmh: Number(formState.topSpeedKmh),
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors">
      {/* Top Banner */}
      <div className="bg-card border border-border p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-foreground">Admin Control Center</h1>
            <p className="text-xs text-text-muted">
              Authenticated as <strong className="text-foreground">{user?.email}</strong> ({user?.role})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/import"
            className="bg-surface hover:bg-muted text-foreground font-bold text-xs px-4 py-2.5 rounded-xl border border-border flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-success" />
            <span>JSON/CSV Batch Import</span>
          </Link>
          <button
            onClick={handleOpenCreate}
            className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Car</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border space-x-6">
        <button
          onClick={() => setActiveTab('cars')}
          className={`pb-3 font-display font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'cars' ? 'text-primary border-primary' : 'text-text-muted border-transparent hover:text-foreground'
          }`}
        >
          Manage Cars Catalog ({carsData?.pagination.total ?? 0})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 font-display font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'audit' ? 'text-primary border-primary' : 'text-text-muted border-transparent hover:text-foreground'
          }`}
        >
          Audit Log Records
        </button>
      </div>

      {/* Tab: Cars Datatable */}
      {activeTab === 'cars' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Filter admin cars table..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-surface text-foreground placeholder:text-text-muted text-xs rounded-xl pl-9 pr-3 py-2 border border-border focus:outline-none focus:border-primary transition-colors"
              />
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center space-x-3 text-xs text-text-muted">
              <span>Show per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-surface text-foreground font-semibold rounded-lg px-2.5 py-1.5 border border-border focus:outline-none focus:border-primary"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
                <option value={1000}>1000 (All)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto bg-card border border-border rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-text-muted uppercase font-extrabold select-none">
                  <th
                    onClick={() => handleSort('id')}
                    className="p-3.5 cursor-pointer hover:text-foreground transition-colors group"
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>ID</span>
                      {renderSortIcon('id')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('fullName')}
                    className="p-3.5 cursor-pointer hover:text-foreground transition-colors group"
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Car Model</span>
                      {renderSortIcon('fullName')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('brand')}
                    className="p-3.5 cursor-pointer hover:text-foreground transition-colors group"
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Brand</span>
                      {renderSortIcon('brand')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('class')}
                    className="p-3.5 cursor-pointer hover:text-foreground transition-colors group"
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Class / PI</span>
                      {renderSortIcon('class')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('drivetrain')}
                    className="p-3.5 cursor-pointer hover:text-foreground transition-colors group"
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Drivetrain</span>
                      {renderSortIcon('drivetrain')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('year')}
                    className="p-3.5 cursor-pointer hover:text-foreground transition-colors group"
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Year</span>
                      {renderSortIcon('year')}
                    </div>
                  </th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {isLoadingCars ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-text-muted">
                      <div className="flex justify-center items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>Loading cars catalog...</span>
                      </div>
                    </td>
                  </tr>
                ) : carsData?.data && carsData.data.length > 0 ? (
                  carsData.data.map((car) => (
                    <tr key={car.id} className="hover:bg-elevated transition-colors">
                      <td className="p-3.5 font-mono text-text-muted">#{car.id}</td>
                      <td className="p-3.5 font-bold text-foreground">{car.fullName}</td>
                      <td className="p-3.5 text-text-secondary">{car.brand?.name}</td>
                      <td className="p-3.5">
                        <ClassBadge className={car.class} pi={car.basePi} size="sm" />
                      </td>
                      <td className="p-3.5 font-mono font-bold text-text-secondary">{car.drivetrain}</td>
                      <td className="p-3.5 text-text-muted">{car.year}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(car)}
                          className="p-1.5 text-text-secondary hover:text-foreground bg-muted hover:bg-border rounded-lg transition-colors"
                          title="Edit car"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${car.fullName}?`)) {
                              deleteMutation.mutate(car.id);
                            }
                          }}
                          className="p-1.5 text-danger hover:text-danger/80 bg-danger/10 hover:bg-danger/20 rounded-lg border border-danger/30 transition-colors"
                          title="Delete car"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-text-muted">
                      No cars found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Controls Bar */}
          {carsData && carsData.pagination && (
            <div className="flex flex-col sm:flex-row justify-between items-center bg-card border border-border rounded-2xl px-5 py-3 gap-3 text-xs shadow-sm">
              <div className="text-text-muted font-medium">
                Showing{' '}
                <strong className="text-foreground">
                  {carsData.pagination.total > 0 ? (page - 1) * pageSize + 1 : 0}
                </strong>{' '}
                to{' '}
                <strong className="text-foreground">
                  {Math.min(page * pageSize, carsData.pagination.total)}
                </strong>{' '}
                of <strong className="text-foreground">{carsData.pagination.total}</strong> cars
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 bg-surface hover:bg-elevated border border-border rounded-xl font-semibold flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="px-3 py-1.5 bg-muted rounded-xl text-text-secondary font-mono font-bold">
                  Page {page} of {carsData.pagination.totalPages || 1}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(carsData.pagination.totalPages || 1, p + 1))}
                  disabled={page >= (carsData.pagination.totalPages || 1)}
                  className="px-3 py-1.5 bg-surface hover:bg-elevated border border-border rounded-xl font-semibold flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden p-6 space-y-4 shadow-sm">
          <h3 className="font-display font-bold text-lg text-foreground">System Audit Trail</h3>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="bg-surface p-3.5 rounded-xl border border-border text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-foreground flex items-center space-x-2">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-mono text-[10px] border border-primary/20">
                      {log.action}
                    </span>
                    <span>{log.details || 'No details specified'}</span>
                  </div>
                  <div className="text-text-muted text-[11px] mt-1">
                    By: {log.adminUser?.email || 'System'}
                  </div>
                </div>
                <div className="font-mono text-text-muted text-[11px]">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-display font-bold text-xl text-foreground">
                {editingCar ? `Edit Car: ${editingCar.model}` : 'Create New Forza Horizon 6 Car'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-text-secondary font-semibold">Model Name</label>
                  <input
                    type="text"
                    required
                    value={formState.model}
                    onChange={(e) => setFormState({ ...formState, model: e.target.value })}
                    className="w-full bg-surface text-foreground rounded-lg p-2.5 border border-border mt-1 focus:outline-none focus:border-primary"
                    placeholder="GR Supra"
                  />
                </div>

                <div>
                  <label className="text-text-secondary font-semibold">Brand / Manufacturer</label>
                  <select
                    value={formState.brandId}
                    onChange={(e) => setFormState({ ...formState, brandId: Number(e.target.value) })}
                    className="w-full bg-surface text-foreground rounded-lg p-2.5 border border-border mt-1 focus:outline-none focus:border-primary"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-text-secondary font-semibold">Year</label>
                  <input
                    type="number"
                    value={formState.year}
                    onChange={(e) => setFormState({ ...formState, year: Number(e.target.value) })}
                    className="w-full bg-surface text-foreground rounded-lg p-2.5 border border-border mt-1 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-text-secondary font-semibold">Class</label>
                  <select
                    value={formState.class}
                    onChange={(e) => setFormState({ ...formState, class: e.target.value })}
                    className="w-full bg-surface text-foreground rounded-lg p-2.5 border border-border mt-1 focus:outline-none focus:border-primary"
                  >
                    {['D', 'C', 'B', 'A', 'S1', 'S2', 'R', 'X'].map((c) => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-text-secondary font-semibold">Base PI Rating (100 - 999)</label>
                  <input
                    type="number"
                    min="100"
                    max="999"
                    value={formState.basePi}
                    onChange={(e) => setFormState({ ...formState, basePi: Number(e.target.value) })}
                    className="w-full bg-surface text-foreground rounded-lg p-2.5 border border-border mt-1 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-text-secondary font-semibold">Drivetrain</label>
                  <select
                    value={formState.drivetrain}
                    onChange={(e) => setFormState({ ...formState, drivetrain: e.target.value })}
                    className="w-full bg-surface text-foreground rounded-lg p-2.5 border border-border mt-1 focus:outline-none focus:border-primary"
                  >
                    <option value="RWD">RWD</option>
                    <option value="AWD">AWD</option>
                    <option value="FWD">FWD</option>
                  </select>
                </div>
              </div>

              {/* In-game stats */}
              <div className="pt-3 border-t border-border">
                <label className="text-primary font-extrabold uppercase tracking-wider block mb-2">
                  Performance Ratings (0.0 - 10.0)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-text-muted">Speed</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formState.speed}
                      onChange={(e) => setFormState({ ...formState, speed: Number(e.target.value) })}
                      className="w-full bg-surface text-foreground rounded p-2 border border-border mt-1 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <span className="text-text-muted">Handling</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formState.handling}
                      onChange={(e) => setFormState({ ...formState, handling: Number(e.target.value) })}
                      className="w-full bg-surface text-foreground rounded p-2 border border-border mt-1 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <span className="text-text-muted">Acceleration</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formState.acceleration}
                      onChange={(e) => setFormState({ ...formState, acceleration: Number(e.target.value) })}
                      className="w-full bg-surface text-foreground rounded p-2 border border-border mt-1 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Supabase Storage Image Gallery */}
              <div className="pt-3 border-t border-border space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-primary font-extrabold uppercase tracking-wider block">
                    Car Images (Supabase Storage Bucket)
                  </label>
                  <span className="text-[11px] text-text-muted">
                    {carImages.length} image(s) attached
                  </span>
                </div>

                {uploadError && (
                  <div className="bg-danger/10 border border-danger/30 text-danger p-2.5 rounded-xl text-xs">
                    {uploadError}
                  </div>
                )}

                {/* Upload & Add Controls */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 cursor-pointer bg-surface hover:bg-elevated border border-dashed border-border hover:border-primary px-3 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-colors text-xs text-text-secondary hover:text-foreground">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        <span>Uploading to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-primary" />
                        <span>Upload Image File to Supabase</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Or paste image URL..."
                      value={manualUrlInput}
                      onChange={(e) => setManualUrlInput(e.target.value)}
                      className="bg-surface text-foreground placeholder:text-text-muted text-xs rounded-xl px-3 py-2 border border-border focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualUrl}
                      className="bg-muted hover:bg-border text-foreground text-xs px-3 py-2 rounded-xl font-bold transition-colors"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Image List Preview */}
                {carImages.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {carImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative p-2 rounded-xl border flex items-center space-x-3 transition-colors ${
                          img.isPrimary
                            ? 'bg-primary/10 border-primary/40'
                            : 'bg-surface border-border'
                        }`}
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.altText || 'Car'}
                          className="w-14 h-10 object-cover rounded-lg bg-muted"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.opacity = '0.3';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            placeholder="Alt text..."
                            value={img.altText || ''}
                            onChange={(e) => {
                              const newAlt = e.target.value;
                              setCarImages((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, altText: newAlt } : item))
                              );
                            }}
                            className="w-full bg-transparent text-xs text-foreground placeholder:text-text-muted border-b border-transparent hover:border-border focus:border-primary focus:outline-none py-0.5"
                          />
                          <div className="text-[10px] text-text-muted truncate mt-0.5" title={img.imageUrl}>
                            {img.imageUrl}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              img.isPrimary
                                ? 'text-amber-400 bg-amber-400/20'
                                : 'text-text-muted hover:text-amber-400 hover:bg-surface'
                            }`}
                            title={img.isPrimary ? 'Primary image' : 'Set as primary image'}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 text-danger hover:bg-danger/20 rounded-lg transition-colors"
                            title="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-muted text-text-secondary hover:text-foreground rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending || isUploading}
                  className="px-5 py-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-bold shadow"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
