import { DataSource } from "typeorm";
import { CreateCompleteSchema1755000000000 } from "../src/database/migrations/1755000000000-CreateCompleteSchema";

async function testCompleteMigration() {
  console.log("🧪 Testing complete migration on local database...");

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
    await dataSource.initialize();
    console.log("✅ Database connection established");

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    console.log("🚀 Running migration...");
    const migration = new CreateCompleteSchema1755000000000();
    await migration.up(queryRunner);

    console.log("✅ Migration completed successfully!");

    // Verify tables were created
    const tables = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log("📊 Created tables:");
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });

    await queryRunner.release();
    await dataSource.destroy();
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

testCompleteMigration();
