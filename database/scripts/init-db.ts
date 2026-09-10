import { execSync } from 'child_process';
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load .env configuration
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function initDatabase() {
  const dbUrl = process.argv[2] || process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL parameter or environment variable is missing.');
    process.exit(1);
  }

  console.log('🔍 Analyzing database connection URL...');

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(dbUrl);
  } catch (e: any) {
    console.error(`❌ Invalid DATABASE_URL format: ${e.message}`);
    process.exit(1);
  }

  const targetDbName = parsedUrl.pathname.replace(/^\//, '') || 'fh6_cars';
  const isPostgres = parsedUrl.protocol.startsWith('postgres');

  if (isPostgres) {
    console.log(`🔌 Connecting to PostgreSQL server to verify database "${targetDbName}"...`);

    // Create URL connecting to default 'postgres' database to check/create target DB
    const defaultUrl = new URL(dbUrl);
    defaultUrl.pathname = '/postgres';

    const client = new Client({
      connectionString: defaultUrl.toString(),
    });

    try {
      await client.connect();

      // Check if target database exists
      const checkRes = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [targetDbName]
      );

      if (checkRes.rowCount === 0) {
        console.log(`🔨 Database "${targetDbName}" does not exist. Creating database now...`);
        await client.query(`CREATE DATABASE "${targetDbName}";`);
        console.log(`✅ Database "${targetDbName}" created successfully!`);
      } else {
        console.log(`✅ Database "${targetDbName}" already exists.`);
      }

      await client.end();
    } catch (err: any) {
      console.warn(`⚠️  Note on PostgreSQL server check: ${err.message}`);
      try {
        await client.end();
      } catch {}
    }
  }

  // Synchronize Schema Tables & Enums using Prisma CLI
  console.log(`🚀 Synchronizing database tables & relations for "${targetDbName}"...`);

  const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');

  try {
    execSync(`npx prisma db push --schema="${schemaPath}"`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: dbUrl,
      },
    });
    console.log(`🎉 Success! Database "${targetDbName}" and all tables are created and up-to-date.`);
  } catch (err: any) {
    console.error('❌ Failed to create tables:', err.message);
    process.exit(1);
  }
}

initDatabase();
