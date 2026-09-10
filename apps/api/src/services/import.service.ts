import { parse } from 'csv-parse/sync';
import { BrandRepository } from '../repositories/brand.repository';
import { CarRepository } from '../repositories/car.repository';
import { AdminRepository } from '../repositories/admin.repository';
import { importCarRecordSchema } from '@fh6-cars/shared';

export class ImportService {
  private brandRepo = new BrandRepository();
  private carRepo = new CarRepository();
  private adminRepo = new AdminRepository();

  async importCars(
    content: string,
    fileType: 'json' | 'csv',
    adminUserId?: number
  ) {
    let records: any[] = [];
    const details: string[] = [];

    try {
      if (fileType === 'json') {
        records = JSON.parse(content);
        if (!Array.isArray(records)) {
          records = [records];
        }
      } else {
        records = parse(content, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          cast: (value, context) => {
            if (context.column === 'year' || context.column === 'basePi' || context.column === 'carOrdinal') {
              return value ? parseInt(value, 10) : undefined;
            }
            if (context.column === 'speed' || context.column === 'handling' || context.column === 'acceleration' || context.column === 'launch' || context.column === 'braking' || context.column === 'offroad') {
              return value ? parseFloat(value) : undefined;
            }
            if (context.column === 'isDlc' || context.column === 'isAvailable') {
              return value === 'true' || value === '1' || value === 'TRUE';
            }
            return value;
          },
        });
      }
    } catch (e: any) {
      return {
        total: 0,
        inserted: 0,
        updated: 0,
        skipped: 0,
        errors: 1,
        details: [`Failed to parse ${fileType.toUpperCase()} file: ${e.message}`],
      };
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (let index = 0; index < records.length; index++) {
      const raw = records[index];
      const validation = importCarRecordSchema.safeParse(raw);

      if (!validation.success) {
        errors++;
        details.push(`Row ${index + 1}: ${validation.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ')}`);
        continue;
      }

      const carData = validation.data;

      // Check or create Brand
      const brandName = carData.brand.trim();
      const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      let brand = await this.brandRepo.findByName(brandName);
      if (!brand) {
        brand = await this.brandRepo.create({
          name: brandName,
          slug: brandSlug,
          country: carData.country || 'Unknown',
        });
        details.push(`Created new brand: "${brandName}"`);
      }

      const fullName = carData.fullName || `${carData.year} ${carData.brand} ${carData.model}`;

      // Check existing
      let existing = carData.carOrdinal
        ? await this.carRepo.findByOrdinal(carData.carOrdinal)
        : null;

      if (!existing) {
        const foundCars = await this.carRepo.findMany({ search: fullName, limit: 1 });
        if (foundCars.data.length > 0 && foundCars.data[0].fullName.toLowerCase() === fullName.toLowerCase()) {
          existing = foundCars.data[0];
        }
      }

      const payload = {
        carOrdinal: carData.carOrdinal || undefined,
        year: carData.year,
        brandId: brand.id,
        model: carData.model,
        fullName: fullName,
        class: carData.class.toUpperCase(),
        basePi: carData.basePi,
        drivetrain: carData.drivetrain.toUpperCase(),
        carType: carData.carType,
        country: carData.country || brand.country || 'Unknown',
        collection: carData.collection || null,
        isDlc: carData.isDlc ?? false,
        isAvailable: carData.isAvailable ?? true,
        stats: {
          speed: carData.speed !== undefined ? carData.speed : null,
          handling: carData.handling !== undefined ? carData.handling : null,
          acceleration: carData.acceleration !== undefined ? carData.acceleration : null,
          launch: carData.launch !== undefined ? carData.launch : null,
          braking: carData.braking !== undefined ? carData.braking : null,
          offroad: carData.offroad !== undefined ? carData.offroad : null,
          powerHp: carData.powerHp !== undefined ? carData.powerHp : null,
          torqueNm: carData.torqueNm !== undefined ? carData.torqueNm : null,
          weightKg: carData.weightKg !== undefined ? carData.weightKg : null,
          topSpeedKmh: carData.topSpeedKmh !== undefined ? carData.topSpeedKmh : null,
        },
        engine: {
          engineType: carData.engineType || null,
          engineLayout: carData.engineLayout || null,
          cylinders: carData.cylinders !== undefined ? carData.cylinders : null,
          displacementCc: carData.displacementCc !== undefined ? carData.displacementCc : null,
          aspiration: carData.aspiration || null,
        },
      };

      if (existing) {
        await this.carRepo.update(existing.id, payload);
        updated++;
        details.push(`Updated existing car ID ${existing.id}: "${fullName}"`);
      } else {
        await this.carRepo.create(payload);
        inserted++;
        details.push(`Inserted car: "${fullName}"`);
      }
    }

    if (adminUserId) {
      await this.adminRepo.createAuditLog({
        adminUserId,
        action: 'IMPORT_CARS',
        entityType: 'CAR',
        details: `Imported ${records.length} records. Inserted: ${inserted}, Updated: ${updated}, Errors: ${errors}`,
      });
    }

    return {
      total: records.length,
      inserted,
      updated,
      skipped,
      errors,
      details,
    };
  }
}
