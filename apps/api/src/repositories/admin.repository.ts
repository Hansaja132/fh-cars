import { prisma } from '../config/prisma';

export class AdminRepository {
  async findByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: number) {
    return prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });
  }

  async updateLastLogin(id: number) {
    return prisma.adminUser.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }

  async createAuditLog(data: {
    adminUserId?: number | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    details?: string | null;
  }) {
    return prisma.auditLog.create({
      data,
    });
  }

  async findAuditLogs(limit = 50) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        adminUser: {
          select: { username: true, email: true },
        },
      },
    });
  }
}
