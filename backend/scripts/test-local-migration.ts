import { DataSource } from "typeorm";
import { CreateCompleteSchema1755000000000 } from "../src/database/migrations/1755000000000-CreateCompleteSchema";

async function testLocalMigration() {
  console.log("🚀 Starting local migration test...");

  const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "rental_platform_test",
    entities: [],
    migrations: [__dirname + "/../dist/src/database/migrations/*.js"],
    synchronize: false,
    logging: true,
  });

  try {
    console.log("📡 Connecting to database...");
    await dataSource.initialize();
    console.log("✅ Database connected successfully!");

    const queryRunner = dataSource.createQueryRunner();

    console.log("🔄 Running migration...");
    const migration = new CreateCompleteSchema1755000000000();
    await migration.up(queryRunner);

    console.log("✅ Migration completed successfully!");

    // Test some basic queries
    console.log("🧪 Testing basic queries...");

    // Check if tables exist
    const tables = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name NOT LIKE 'pg_%'
      ORDER BY table_name;
    `);

    console.log(
      "📋 Created tables:",
      tables.map((t: any) => t.table_name)
    );

    // Check users table structure
    const userColumns = await queryRunner.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);

    console.log("👥 Users table structure:");
    userColumns.forEach((col: any) => {
      console.log(
        `  - ${col.column_name}: ${col.data_type} ${col.is_nullable === "YES" ? "(nullable)" : "(not null)"} ${col.column_default ? `default: ${col.column_default}` : ""}`
      );
    });

    // Check if test data was seeded
    const userCount = await queryRunner.query(
      `SELECT COUNT(*) as count FROM users;`
    );
    const propertyCount = await queryRunner.query(
      `SELECT COUNT(*) as count FROM properties;`
    );

    console.log(`👤 Users count: ${userCount[0].count}`);
    console.log(`🏠 Properties count: ${propertyCount[0].count}`);

    await queryRunner.release();
    await dataSource.destroy();

    console.log("🎉 Local migration test completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

testLocalMigration();
