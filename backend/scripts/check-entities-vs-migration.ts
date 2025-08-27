import { DataSource } from "typeorm";
import { User } from "../src/entities/user.entity";
import { TenantProfile } from "../src/entities/tenant-profile.entity";
import { OperatorProfile } from "../src/entities/operator-profile.entity";
import { Preferences } from "../src/entities/preferences.entity";
import { Property } from "../src/entities/property.entity";
import { PropertyMedia } from "../src/entities/property-media.entity";
import { Favourite } from "../src/entities/favourite.entity";
import { Shortlist } from "../src/entities/shortlist.entity";

async function checkEntitiesVsMigration() {
  console.log("🔍 Checking entities vs migration alignment...");

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
      Favourite,
      Shortlist,
    ],
    synchronize: false,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log("✅ Database connected");

    // Check each table structure
    const tables = [
      { name: "users", entity: User },
      { name: "preferences", entity: Preferences },
      { name: "tenant_profiles", entity: TenantProfile },
      { name: "operator_profiles", entity: OperatorProfile },
      { name: "properties", entity: Property },
      { name: "property_media", entity: PropertyMedia },
      { name: "favourites", entity: Favourite },
      { name: "shortlist", entity: Shortlist },
    ];

    for (const table of tables) {
      console.log(`\n📋 Checking table: ${table.name}`);

      // Get actual database columns
      const dbColumns = await dataSource.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = '${table.name}' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);

      console.log(`  Database columns (${dbColumns.length}):`);
      dbColumns.forEach((col: any) => {
        console.log(
          `    - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default || "none"})`
        );
      });

      // Get entity columns (this is a simplified check)
      console.log(`  Entity columns: Check manually in ${table.entity.name}`);
    }

    // Check foreign keys
    console.log("\n🔗 Checking foreign keys...");
    const foreignKeys = await dataSource.query(`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name;
    `);

    console.log(`  Foreign keys (${foreignKeys.length}):`);
    foreignKeys.forEach((fk: any) => {
      console.log(
        `    - ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`
      );
    });

    // Check indexes
    console.log("\n🔍 Checking indexes...");
    const indexes = await dataSource.query(`
      SELECT 
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `);

    console.log(`  Indexes (${indexes.length}):`);
    indexes.forEach((idx: any) => {
      console.log(`    - ${idx.tablename}: ${idx.indexname}`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

// Run if called directly
if (require.main === module) {
  checkEntitiesVsMigration().catch(console.error);
}

export default checkEntitiesVsMigration;
