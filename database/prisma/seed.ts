import dotenv from 'dotenv';
import path from 'path';

// Load .env configuration
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FH6 Cars database seeding...');

  // 1. Seed Initial Admin User
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('password', 10);
    const admin = await prisma.adminUser.create({
      data: {
        username: 'admin',
        email: adminEmail,
        passwordHash: passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log(`👤 Created default admin user: ${admin.email}`);

    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        action: 'SEED_INITIALIZATION',
        entityType: 'SYSTEM',
        details: 'Initial system database seed completed.',
      },
    });
  } else {
    console.log(`👤 Admin user ${adminEmail} already exists.`);
  }

  // 2. Read cars.json dataset
  const jsonPath = path.join(__dirname, '../data/cars.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Data file not found at ${jsonPath}`);
    return;
  }

  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const carsData = JSON.parse(rawData);

  console.log(`🚗 Seeding ${carsData.length} cars into database...`);

  for (const item of carsData) {
    // 3. Upsert Brand
    const brandName = item.brand;
    const brandSlug = item.brandSlug || brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const brandCountry = item.brandCountry || item.country || 'Unknown';
    const brandLogoUrl = item.brandLogoUrl || null;

    const brand = await prisma.brand.upsert({
      where: { name: brandName },
      update: {
        slug: brandSlug,
        country: brandCountry,
        logoUrl: brandLogoUrl,
      },
      create: {
        name: brandName,
        slug: brandSlug,
        country: brandCountry,
        logoUrl: brandLogoUrl,
      },
    });

    // 4. Create or Update Car by carOrdinal or fullName
    const carOrdinal = item.carOrdinal ? parseInt(item.carOrdinal, 10) : null;
    const fullName = item.fullName || `${item.year} ${item.brand} ${item.model}`;

    const existingCar = carOrdinal
      ? await prisma.car.findUnique({ where: { carOrdinal } })
      : await prisma.car.findFirst({ where: { fullName } });

    if (existingCar) {
      console.log(`⏭️  Car "${fullName}" already exists. Updating...`);
      await prisma.car.update({
        where: { id: existingCar.id },
        data: {
          year: item.year,
          brandId: brand.id,
          model: item.model,
          fullName: fullName,
          class: item.class,
          basePi: item.basePi,
          drivetrain: item.drivetrain,
          carType: item.carType,
          country: item.country,
          collection: item.collection || null,
          isDlc: Boolean(item.isDlc),
          isAvailable: Boolean(item.isAvailable),
        },
      });
      continue;
    }

    const createdCar = await prisma.car.create({
      data: {
        carOrdinal: carOrdinal,
        year: item.year,
        brandId: brand.id,
        model: item.model,
        fullName: fullName,
        class: item.class,
        basePi: item.basePi,
        drivetrain: item.drivetrain,
        carType: item.carType,
        country: item.country,
        collection: item.collection || null,
        isDlc: Boolean(item.isDlc),
        isAvailable: Boolean(item.isAvailable),
        stats: {
          create: {
            speed: item.speed !== undefined ? item.speed : null,
            handling: item.handling !== undefined ? item.handling : null,
            acceleration: item.acceleration !== undefined ? item.acceleration : null,
            launch: item.launch !== undefined ? item.launch : null,
            braking: item.braking !== undefined ? item.braking : null,
            offroad: item.offroad !== undefined ? item.offroad : null,
            powerHp: item.powerHp !== undefined ? item.powerHp : null,
            torqueNm: item.torqueNm !== undefined ? item.torqueNm : null,
            weightKg: item.weightKg !== undefined ? item.weightKg : null,
            topSpeedKmh: item.topSpeedKmh !== undefined ? item.topSpeedKmh : null,
          },
        },
        engine: {
          create: {
            engineType: item.engineType || null,
            engineLayout: item.engineLayout || null,
            cylinders: item.cylinders !== undefined ? item.cylinders : null,
            displacementCc: item.displacementCc !== undefined ? item.displacementCc : null,
            aspiration: item.aspiration || null,
          },
        },
        images: {
          create: [
            {
              imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: item.imageUrl || null,
              altText: fullName,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        sources: {
          create: [
            {
              sourceName: item.sourceName || 'FH6 Community Database',
              sourceUrl: item.sourceUrl || 'https://forza.net',
              sourceType: (item.sourceType as any) || 'OFFICIAL',
              verified: item.verified ?? true,
              lastVerifiedAt: new Date(),
            },
          ],
        },
      },
    });

    console.log(`✅ Inserted car: ${createdCar.fullName} (Class ${createdCar.class} PI ${createdCar.basePi})`);
  }

  console.log('🎉 Database seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
