import { BrandRepository } from '../repositories/brand.repository';
import { AppError } from '../middleware/error-handler';
import { AdminRepository } from '../repositories/admin.repository';

export class BrandService {
  private brandRepo = new BrandRepository();
  private adminRepo = new AdminRepository();

  async getBrands() {
    return this.brandRepo.findAll();
  }

  async getBrandBySlug(slug: string) {
    const brand = await this.brandRepo.findBySlug(slug);
    if (!brand) {
      throw new AppError(`Brand with slug '${slug}' not found`, 404, 'BRAND_NOT_FOUND');
    }
    return brand;
  }

  async createBrand(data: { name: string; slug: string; country?: string | null; logoUrl?: string | null }, adminUserId?: number) {
    const existingName = await this.brandRepo.findByName(data.name);
    if (existingName) {
      throw new AppError(`Brand with name '${data.name}' already exists`, 409, 'BRAND_EXISTS');
    }

    const brand = await this.brandRepo.create(data);

    if (adminUserId) {
      await this.adminRepo.createAuditLog({
        adminUserId,
        action: 'CREATE_BRAND',
        entityType: 'BRAND',
        entityId: brand.id.toString(),
        details: `Created brand ${brand.name}`,
      });
    }

    return brand;
  }

  async updateBrand(id: number, data: any, adminUserId?: number) {
    const existing = await this.brandRepo.findById(id);
    if (!existing) {
      throw new AppError(`Brand with ID ${id} not found`, 404, 'BRAND_NOT_FOUND');
    }

    const updated = await this.brandRepo.update(id, data);

    if (adminUserId) {
      await this.adminRepo.createAuditLog({
        adminUserId,
        action: 'UPDATE_BRAND',
        entityType: 'BRAND',
        entityId: id.toString(),
        details: `Updated brand ${updated.name}`,
      });
    }

    return updated;
  }

  async deleteBrand(id: number, adminUserId?: number) {
    const existing = await this.brandRepo.findById(id);
    if (!existing) {
      throw new AppError(`Brand with ID ${id} not found`, 404, 'BRAND_NOT_FOUND');
    }

    await this.brandRepo.delete(id);

    if (adminUserId) {
      await this.adminRepo.createAuditLog({
        adminUserId,
        action: 'DELETE_BRAND',
        entityType: 'BRAND',
        entityId: id.toString(),
        details: `Deleted brand ${existing.name}`,
      });
    }

    return { message: 'Brand deleted successfully' };
  }
}
