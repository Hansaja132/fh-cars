import { prisma } from '../config/prisma';
import { CarQueryParams } from '@fh6-cars/shared';
import { Prisma } from '@prisma/client';

export class CarRepository {
  async findMany(params: CarQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 25;
    const skip = (page - 1) * limit;

    const where: Prisma.CarWhereInput = {};

    if (params.search) {
      const q = params.search.trim();
      where.OR = [
        { model: { contains: q } },
        { fullName: { contains: q } },
        { country: { contains: q } },
        { brand: { name: { contains: q } } },
      ];
    }

    if (params.brand) {
      where.brand = {
        OR: [
          { slug: { equals: params.brand.toLowerCase() } },
          { name: { contains: params.brand } },
        ],
      };
    }

    if (params.class) {
      where.class = { equals: params.class.toUpperCase() };
    }

    if (params.year) {
      where.year = params.year;
    }

    if (params.drivetrain) {
      where.drivetrain = { equals: params.drivetrain.toUpperCase() };
    }

    if (params.carType) {
      where.carType = { contains: params.carType };
    }

    if (params.minPi !== undefined || params.maxPi !== undefined) {
      where.basePi = {};
      if (params.minPi !== undefined) where.basePi.gte = params.minPi;
      if (params.maxPi !== undefined) where.basePi.lte = params.maxPi;
    }

    if (params.isDlc !== undefined) {
      where.isDlc = params.isDlc;
    }

    let orderBy: Prisma.CarOrderByWithRelationInput = { fullName: 'asc' };
    const sortField = params.sort || 'fullName';
    const orderDirection = params.order === 'desc' ? 'desc' : 'asc';

    if (sortField === 'year') orderBy = { year: orderDirection };
    else if (sortField === 'basePi' || sortField === 'pi') orderBy = { basePi: orderDirection };
    else if (sortField === 'model') orderBy = { model: orderDirection };
    else if (sortField === 'class') orderBy = { class: orderDirection };
    else if (sortField === 'createdAt') orderBy = { createdAt: orderDirection };

    const [data, total] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          brand: true,
          stats: true,
          engine: true,
          images: { orderBy: { sortOrder: 'asc' } },
          sources: true,
        },
      }),
      prisma.car.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findById(id: number) {
    return prisma.car.findUnique({
      where: { id },
      include: {
        brand: true,
        stats: true,
        engine: true,
        images: { orderBy: { sortOrder: 'asc' } },
        sources: true,
      },
    });
  }

  async findByOrdinal(ordinal: number) {
    return prisma.car.findUnique({
      where: { carOrdinal: ordinal },
      include: {
        brand: true,
        stats: true,
        engine: true,
        images: { orderBy: { sortOrder: 'asc' } },
        sources: true,
      },
    });
  }

  async create(data: any) {
    const { stats, engine, images, sources, ...carData } = data;

    return prisma.car.create({
      data: {
        ...carData,
        stats: stats ? { create: stats } : undefined,
        engine: engine ? { create: engine } : undefined,
        images: images && images.length > 0 ? { create: images } : undefined,
        sources: sources && sources.length > 0 ? { create: sources } : undefined,
      },
      include: {
        brand: true,
        stats: true,
        engine: true,
        images: true,
        sources: true,
      },
    });
  }

  async update(id: number, data: any) {
    const { stats, engine, images, sources, ...carData } = data;

    return prisma.$transaction(async (tx) => {
      if (stats) {
        await tx.carStats.upsert({
          where: { carId: id },
          update: stats,
          create: { ...stats, carId: id },
        });
      }

      if (engine) {
        await tx.carEngine.upsert({
          where: { carId: id },
          update: engine,
          create: { ...engine, carId: id },
        });
      }

      return tx.car.update({
        where: { id },
        data: carData,
        include: {
          brand: true,
          stats: true,
          engine: true,
          images: true,
          sources: true,
        },
      });
    });
  }

  async delete(id: number) {
    return prisma.car.delete({
      where: { id },
    });
  }

  async getStatistics() {
    const totalCars = await prisma.car.count();
    const totalBrands = await prisma.brand.count();
    const totalDlcCars = await prisma.car.count({ where: { isDlc: true } });

    const classesGroup = await prisma.car.groupBy({
      by: ['class'],
      _count: { class: true },
    });

    const classes: Record<string, number> = {
      D: 0,
      C: 0,
      B: 0,
      A: 0,
      S1: 0,
      S2: 0,
      X: 0,
    };

    classesGroup.forEach((g: any) => {
      classes[g.class] = g._count.class;
    });

    const drivetrainsGroup = await prisma.car.groupBy({
      by: ['drivetrain'],
      _count: { drivetrain: true },
    });

    const drivetrains: Record<string, number> = {};
    drivetrainsGroup.forEach((g: any) => {
      drivetrains[g.drivetrain] = g._count.drivetrain;
    });

    const topBrandsList = await prisma.brand.findMany({
      take: 5,
      include: {
        _count: {
          select: { cars: true },
        },
      },
      orderBy: {
        cars: {
          _count: 'desc',
        },
      },
    });

    const topBrands = topBrandsList.map((b) => ({
      name: b.name,
      count: b._count.cars,
    }));

    return {
      totalCars,
      totalBrands,
      totalDlcCars,
      classes,
      drivetrains,
      topBrands,
    };
  }

  async getDistinctValues(field: 'class' | 'drivetrain' | 'carType' | 'country') {
    const cars = await prisma.car.findMany({
      select: {
        [field]: true,
      },
      distinct: [field],
    });

    return cars
      .map((c: any) => c[field])
      .filter(Boolean);
  }
}
