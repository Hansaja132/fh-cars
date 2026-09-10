import { prisma } from '../config/prisma';

export class BrandRepository {
  async findAll() {
    return prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { cars: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.brand.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        cars: {
          include: {
            stats: true,
            images: { where: { isPrimary: true } },
          },
          orderBy: { fullName: 'asc' },
        },
        _count: {
          select: { cars: true },
        },
      },
    });
  }

  async findById(id: number) {
    return prisma.brand.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return prisma.brand.findUnique({
      where: { name },
    });
  }

  async create(data: { name: string; slug: string; country?: string | null; logoUrl?: string | null }) {
    return prisma.brand.create({
      data,
    });
  }

  async update(id: number, data: { name?: string; slug?: string; country?: string | null; logoUrl?: string | null }) {
    return prisma.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.brand.delete({
      where: { id },
    });
  }
}
