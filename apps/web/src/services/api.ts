import axios from 'axios';
import {
  Car,
  Brand,
  CarQueryParams,
  PaginatedResponse,
  OverviewStatistics,
  ImportSummary,
  AdminUser,
  AuditLog,
} from '@fh6-cars/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('fh6_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Public Cars
  getCars: async (params: CarQueryParams): Promise<PaginatedResponse<Car>> => {
    const response = await apiClient.get('/cars', { params });
    return response.data;
  },

  searchCars: async (query: string): Promise<PaginatedResponse<Car>> => {
    const response = await apiClient.get('/cars/search', { params: { q: query } });
    return response.data;
  },

  getCarById: async (id: number): Promise<Car> => {
    const response = await apiClient.get(`/cars/${id}`);
    return response.data.data;
  },

  getCarByOrdinal: async (ordinal: number): Promise<Car> => {
    const response = await apiClient.get(`/cars/ordinal/${ordinal}`);
    return response.data.data;
  },

  // Lookups & Stats
  getBrands: async (): Promise<Brand[]> => {
    const response = await apiClient.get('/brands');
    return response.data.data;
  },

  getBrandBySlug: async (slug: string): Promise<Brand & { cars: Car[] }> => {
    const response = await apiClient.get(`/brands/${slug}`);
    return response.data.data;
  },

  getClasses: async (): Promise<string[]> => {
    const response = await apiClient.get('/classes');
    return response.data.data;
  },

  getDrivetrains: async (): Promise<string[]> => {
    const response = await apiClient.get('/drivetrains');
    return response.data.data;
  },

  getCarTypes: async (): Promise<string[]> => {
    const response = await apiClient.get('/car-types');
    return response.data.data;
  },

  getCountries: async (): Promise<string[]> => {
    const response = await apiClient.get('/countries');
    return response.data.data;
  },

  getStatistics: async (): Promise<OverviewStatistics> => {
    const response = await apiClient.get('/statistics');
    return response.data.data;
  },

  // Admin Auth
  loginAdmin: async (email: string, password: string): Promise<{ token: string; user: AdminUser }> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data.data;
  },

  getAdminMe: async (): Promise<AdminUser> => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  requestForgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data.data;
  },

  resetPassword: async (email: string, code: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/reset-password', { email, code, newPassword });
    return response.data.data;
  },

  // Admin CRUD
  createCar: async (carData: any): Promise<Car> => {
    const response = await apiClient.post('/admin/cars', carData);
    return response.data.data;
  },

  updateCar: async (id: number, carData: any): Promise<Car> => {
    const response = await apiClient.put(`/admin/cars/${id}`, carData);
    return response.data.data;
  },

  deleteCar: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/admin/cars/${id}`);
    return response.data.data;
  },

  createBrand: async (brandData: any): Promise<Brand> => {
    const response = await apiClient.post('/admin/brands', brandData);
    return response.data.data;
  },

  updateBrand: async (id: number, brandData: any): Promise<Brand> => {
    const response = await apiClient.put(`/admin/brands/${id}`, brandData);
    return response.data.data;
  },

  deleteBrand: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/admin/brands/${id}`);
    return response.data.data;
  },

  importCars: async (content: string, fileType: 'json' | 'csv'): Promise<ImportSummary> => {
    const headers = fileType === 'csv' ? { 'Content-Type': 'text/csv' } : { 'Content-Type': 'application/json' };
    const payload = fileType === 'csv' ? content : JSON.parse(content);
    const response = await apiClient.post('/admin/import/cars', payload, { headers });
    return response.data.data;
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    const response = await apiClient.get('/admin/audit-logs');
    return response.data.data;
  },
};
