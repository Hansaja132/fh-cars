import { CarRepository } from '../repositories/car.repository';
import { StorageService } from './storage.service';
import { CarQueryParams } from '@fh6-cars/shared';
import { AppError } from '../middleware/error-handler';
import { AdminRepository } from '../repositories/admin.repository';

export class CarService {
  private carRepo = new CarRepository();
  private adminRepo = new AdminRepository();
  private storageService = new StorageService();

  async getCars(params: CarQueryParams) {
    return this.carRepo.findMany(params);
  }

  async getCarById(id: number) {
    const car = await this.carRepo.findById(id);
    if (!car) {
      throw new AppError(`Car with ID ${id} not found`, 404, 'CAR_NOT_FOUND');
    }
    return car;
  }

  async getCarByOrdinal(ordinal: number) {
    const car = await this.carRepo.findByOrdinal(ordinal);
    if (!car) {
      throw new AppError(`Car with ordinal ${ordinal} not found`, 404, 'CAR_NOT_FOUND');
    }
    return car;
  }

  async searchCars(query: string) {
    if (!query || query.trim().length === 0) {
      return this.getCars({ limit: 10 });
    }
    return this.getCars({ search: query, limit: 25 });
  }

  async createCar(data: any, adminUserId?: number) {
    const car = await this.carRepo.create(data);

    if (adminUserId) {
      await this.adminRepo.createAuditLog({
        adminUserId,
        action: 'CREATE_CAR',
        entityType: 'CAR',
        entityId: car.id.toString(),
        details: `Created car ${car.fullName} (${car.class} PI ${car.basePi})`,
      });
    }

    return car;
  }

  async updateCar(id: number, data: any, adminUserId?: number) {
    const existing = await this.getCarById(id);

    // Automatically delete removed images from Supabase storage bucket
    if (data.images && Array.isArray(data.images) && existing.images) {
      const newUrls = new Set(data.images.map((img: any) => img.imageUrl));
      const removedImages = existing.images.filter((img) => !newUrls.has(img.imageUrl));

      for (const img of removedImages) {
        await this.storageService.deleteImage(img.imageUrl).catch(() => {});
      }
    }

    const updated = await this.carRepo.update(id, data);

    if (adminUserId) {
      await this.adminRepo.createAuditLog({
        adminUserId,
        action: 'UPDATE_CAR',
        entityType: 'CAR',
        entityId: id.toString(),
        details: `Updated car ${updated.fullName}`,
      });
    }

    return updated;
  }

  async deleteCar(id: number, adminUserId?: number) {
    const existing = await this.getCarById(id);

    // Automatically delete all associated images from Supabase storage bucket
    if (existing.images && existing.images.length > 0) {
      for (const img of existing.images) {
        await this.storageService.deleteImage(img.imageUrl).catch(() => {});
      }
    }

    await this.carRepo.delete(id);

    if (adminUserId) {
      await this.adminRepo.createAuditLog({
        adminUserId,
        action: 'DELETE_CAR',
        entityType: 'CAR',
        entityId: id.toString(),
        details: `Deleted car ${existing.fullName}`,
      });
    }

    return { message: 'Car deleted successfully' };
  }

  async getStatistics() {
    return this.carRepo.getStatistics();
  }

  async getDistinctValues(field: 'class' | 'drivetrain' | 'carType' | 'country') {
    return this.carRepo.getDistinctValues(field);
  }
}
