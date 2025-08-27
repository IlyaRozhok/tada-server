import { DataSource } from "typeorm";
import { User } from "../src/entities/user.entity";
import { TenantProfile } from "../src/entities/tenant-profile.entity";
import { OperatorProfile } from "../src/entities/operator-profile.entity";
import { Preferences } from "../src/entities/preferences.entity";
import { Property } from "../src/entities/property.entity";
import { PropertyMedia } from "../src/entities/property-media.entity";
import { Shortlist } from "../src/entities/shortlist.entity";
import { Favourite } from "../src/entities/favourite.entity";

async function testProdMigration() {
  console.log("🚀 Testing production migration approach on local database...");

  // Create data source with local test database
  const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "rental_platform_test",
    entities: [
      User,
      TenantProfile,
      OperatorProfile,
      Preferences,
      Property,
      PropertyMedia,
      Shortlist,
      Favourite,
    ],
    migrations: [__dirname + "/../dist/src/database/migrations/*.js"],
    synchronize: false,
    logging: true,
  });

  try {
    // Initialize connection
    await dataSource.initialize();
    console.log("✅ Database connection established");

    // Check if migrations table exists
    const hasMigrationsTable = await dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'migrations'
      );
    `);

    if (!hasMigrationsTable[0].exists) {
      console.log("📋 Creating migrations table...");
      await dataSource.query(`
        CREATE TABLE "migrations" (
          "id" SERIAL PRIMARY KEY,
          "timestamp" bigint NOT NULL,
          "name" character varying NOT NULL
        )
      `);
      console.log("✅ Migrations table created");
    }

    // Get pending migrations
    const pendingMigrations = await dataSource.showMigrations();

    if (pendingMigrations === false) {
      console.log("✅ No pending migrations found");
    } else {
      console.log(`📋 Found pending migrations, running them...`);

      // Run migrations
      console.log("🔄 Running migrations...");
      await dataSource.runMigrations();
      console.log("✅ All migrations completed successfully");
    }

    // Verify database schema
    console.log("🔍 Verifying database schema...");
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log("📊 Database tables:");
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });

    // Check if migrations table has our migration
    const migrations = await dataSource.query(`
      SELECT * FROM migrations ORDER BY timestamp;
    `);

    console.log("📋 Applied migrations:");
    migrations.forEach((migration: any) => {
      console.log(`  - ${migration.timestamp}: ${migration.name}`);
    });
  } catch (error) {
    console.error("❌ Migration deployment failed:", error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log("🔌 Database connection closed");
    }
  }

  console.log("🎉 Production migration test completed successfully!");
}

// Run if called directly
if (require.main === module) {
  testProdMigration().catch(console.error);
}

export default testProdMigration;
