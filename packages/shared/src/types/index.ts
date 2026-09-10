export type AdminRole = 'ADMIN' | 'EDITOR';

export type SourceType = 'OFFICIAL' | 'COMMUNITY' | 'DATABASE' | 'MANUAL' | 'OTHER';

export interface Brand {
  id: number;
  name: string;
  slug: string;
  country?: string | null;
  logoUrl?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CarStats {
  id: number;
  carId: number;
  speed: number | null;
  handling: number | null;
  acceleration: number | null;
  launch: number | null;
  braking: number | null;
  offroad: number | null;
  powerHp: number | null;
  torqueNm: number | null;
  weightKg: number | null;
  topSpeedKmh: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CarEngine {
  id: number;
  carId: number;
  engineType: string | null;
  engineLayout: string | null;
  cylinders: number | null;
  displacementCc: number | null;
  aspiration: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CarImage {
  id: number;
  carId: number;
  imageUrl: string;
  thumbnailUrl?: string | null;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string | Date;
}

export interface CarSource {
  id: number;
  carId: number;
  sourceName: string;
  sourceUrl?: string | null;
  sourceType: SourceType;
  verified: boolean;
  lastVerifiedAt?: string | Date | null;
  createdAt: string | Date;
}

export interface Car {
  id: number;
  carOrdinal?: number | null;
  year: number;
  brandId: number;
  brand?: Brand;
  model: string;
  fullName: string;
  class: string;
  basePi: number;
  drivetrain: string;
  carType: string;
  country: string;
  collection?: string | null;
  isDlc: boolean;
  isAvailable: boolean;
  stats?: CarStats | null;
  engine?: CarEngine | null;
  images?: CarImage[];
  sources?: CarSource[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuditLog {
  id: number;
  adminUserId?: number | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: string | null;
  createdAt: string | Date;
  adminUser?: {
    username: string;
    email: string;
  } | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, any>;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface CarQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  class?: string;
  year?: number;
  drivetrain?: string;
  carType?: string;
  minPi?: number;
  maxPi?: number;
  isDlc?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface OverviewStatistics {
  totalCars: number;
  totalBrands: number;
  totalDlcCars: number;
  classes: Record<string, number>;
  drivetrains: Record<string, number>;
  topBrands: { name: string; count: number }[];
}

export interface ImportSummary {
  total: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: number;
  details?: string[];
}
