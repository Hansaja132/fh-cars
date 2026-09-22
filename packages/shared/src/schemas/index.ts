import { z } from 'zod';

export const SourceTypeEnum = z.enum(['OFFICIAL', 'COMMUNITY', 'DATABASE', 'MANUAL', 'OTHER']);
export const AdminRoleEnum = z.enum(['ADMIN', 'EDITOR']);

export const brandCreateSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  slug: z.string().min(1, 'Slug is required'),
  country: z.string().optional().nullable(),
  logoUrl: z.string().url('Invalid logo URL').optional().nullable().or(z.literal('')),
});

export const brandUpdateSchema = brandCreateSchema.partial();

export const carStatsSchema = z.object({
  speed: z.number().min(0).max(10).optional().nullable(),
  handling: z.number().min(0).max(10).optional().nullable(),
  acceleration: z.number().min(0).max(10).optional().nullable(),
  launch: z.number().min(0).max(10).optional().nullable(),
  braking: z.number().min(0).max(10).optional().nullable(),
  offroad: z.number().min(0).max(10).optional().nullable(),
  powerHp: z.number().min(0).optional().nullable(),
  torqueNm: z.number().min(0).optional().nullable(),
  weightKg: z.number().min(0).optional().nullable(),
  topSpeedKmh: z.number().min(0).optional().nullable(),
});

export const carEngineSchema = z.object({
  engineType: z.string().optional().nullable(),
  engineLayout: z.string().optional().nullable(),
  cylinders: z.number().int().min(0).optional().nullable(),
  displacementCc: z.number().int().min(0).optional().nullable(),
  aspiration: z.string().optional().nullable(),
});

export const carImageSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  thumbnailUrl: z.string().url().optional().nullable().or(z.literal('')),
  altText: z.string().optional().nullable(),
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const carSourceSchema = z.object({
  sourceName: z.string().min(1, 'Source name is required'),
  sourceUrl: z.string().url().optional().nullable().or(z.literal('')),
  sourceType: SourceTypeEnum.default('COMMUNITY'),
  verified: z.boolean().default(false),
  lastVerifiedAt: z.string().optional().nullable(),
});

export const carCreateSchema = z.object({
  carOrdinal: z.number().int().positive().optional().nullable(),
  year: z.number().int().min(1900).max(2030, 'Invalid year'),
  brandId: z.number().int().positive('Valid Brand ID is required'),
  model: z.string().min(1, 'Model is required'),
  fullName: z.string().min(1, 'Full name is required'),
  class: z.string().min(1, 'Class is required'),
  basePi: z.number().int().min(100).max(999, 'PI must be between 100 and 999'),
  drivetrain: z.string().min(1, 'Drivetrain is required'),
  carType: z.string().min(1, 'Car type is required'),
  country: z.string().min(1, 'Country is required'),
  collection: z.string().optional().nullable(),
  isDlc: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  stats: carStatsSchema.optional().nullable(),
  engine: carEngineSchema.optional().nullable(),
  images: z.array(carImageSchema).optional().default([]),
  sources: z.array(carSourceSchema).optional().default([]),
});

export const carUpdateSchema = carCreateSchema.partial();

export const carQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(1000).default(25),

  search: z.string().optional(),
  brand: z.string().optional(),
  class: z.string().optional(),
  year: z.coerce.number().int().optional(),
  drivetrain: z.string().optional(),
  carType: z.string().optional(),
  minPi: z.coerce.number().int().min(0).max(999).optional(),
  maxPi: z.coerce.number().int().min(0).max(999).optional(),
  isDlc: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean().optional()),
  sort: z.string().default('fullName'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Verification code must be exactly 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const importCarRecordSchema = z.object({
  carOrdinal: z.number().optional().nullable(),
  year: z.number(),
  brand: z.string(),
  model: z.string(),
  fullName: z.string().optional(),
  class: z.string(),
  basePi: z.number(),
  drivetrain: z.string(),
  carType: z.string(),
  country: z.string().optional(),
  collection: z.string().optional().nullable(),
  isDlc: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
  speed: z.number().optional().nullable(),
  handling: z.number().optional().nullable(),
  acceleration: z.number().optional().nullable(),
  launch: z.number().optional().nullable(),
  braking: z.number().optional().nullable(),
  offroad: z.number().optional().nullable(),
  powerHp: z.number().optional().nullable(),
  torqueNm: z.number().optional().nullable(),
  weightKg: z.number().optional().nullable(),
  topSpeedKmh: z.number().optional().nullable(),
  engineType: z.string().optional().nullable(),
  engineLayout: z.string().optional().nullable(),
  cylinders: z.number().optional().nullable(),
  displacementCc: z.number().optional().nullable(),
  aspiration: z.string().optional().nullable(),
});
