import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateCompleteSchema1755000000000 implements MigrationInterface {
  name = "CreateCompleteSchema1755000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log("🚀 Starting complete schema creation...");

    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users table
    console.log("📝 Creating users table...");

    // Check if table already exists
    const usersTableExists = await queryRunner.hasTable("users");
    if (usersTableExists) {
      console.log("⚠️ Users table already exists, skipping...");
    } else {
      await queryRunner.createTable(
        new Table({
          name: "users",
          columns: [
            {
              name: "id",
              type: "uuid",
              isPrimary: true,
              generationStrategy: "uuid",
              default: "uuid_generate_v4()",
            },
            {
              name: "email",
              type: "varchar",
              isUnique: true,
              isNullable: false,
            },
            {
              name: "full_name",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "roles",
              type: "text",
              isNullable: true,
              default: "'tenant'",
            },
            {
              name: "status",
              type: "enum",
              enum: ["active", "inactive", "suspended"],
              default: "'active'",
              isNullable: false,
            },
            {
              name: "password",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "google_id",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "provider",
              type: "varchar",
              default: "'local'",
              isNullable: false,
            },
            {
              name: "avatar_url",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "email_verified",
              type: "boolean",
              default: "false",
              isNullable: false,
            },
            {
              name: "phone",
              type: "varchar",
              isNullable: true,
            },
            {
              name: "created_at",
              type: "timestamp",
              default: "CURRENT_TIMESTAMP",
            },
            {
              name: "updated_at",
              type: "timestamp",
              default: "CURRENT_TIMESTAMP",
              onUpdate: "CURRENT_TIMESTAMP",
            },
          ],
        }),
        true
      );
    }

    // Create preferences table
    console.log("📝 Creating preferences table...");
    await queryRunner.createTable(
      new Table({
        name: "preferences",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "primary_postcode",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "secondary_location",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "commute_location",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "commute_time_walk",
            type: "integer",
            isNullable: true,
          },
          {
            name: "commute_time_cycle",
            type: "integer",
            isNullable: true,
          },
          {
            name: "commute_time_tube",
            type: "integer",
            isNullable: true,
          },
          {
            name: "move_in_date",
            type: "date",
            isNullable: true,
          },
          {
            name: "move_out_date",
            type: "date",
            isNullable: true,
          },
          {
            name: "min_price",
            type: "integer",
            isNullable: true,
          },
          {
            name: "max_price",
            type: "integer",
            isNullable: true,
          },
          {
            name: "min_bedrooms",
            type: "integer",
            isNullable: true,
          },
          {
            name: "max_bedrooms",
            type: "integer",
            isNullable: true,
          },
          {
            name: "min_bathrooms",
            type: "integer",
            isNullable: true,
          },
          {
            name: "max_bathrooms",
            type: "integer",
            isNullable: true,
          },
          {
            name: "furnishing",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "location",
            type: "text",
            isNullable: true,
          },
          {
            name: "building_style",
            type: "text",
            isNullable: true,
          },
          {
            name: "designer_furniture",
            type: "boolean",
            isNullable: true,
          },
          {
            name: "house_shares",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "date_property_added",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "lifestyle_features",
            type: "text",
            isNullable: true,
          },
          {
            name: "social_features",
            type: "text",
            isNullable: true,
          },
          {
            name: "work_features",
            type: "text",
            isNullable: true,
          },
          {
            name: "convenience_features",
            type: "text",
            isNullable: true,
          },
          {
            name: "pet_friendly_features",
            type: "text",
            isNullable: true,
          },
          {
            name: "luxury_features",
            type: "text",
            isNullable: true,
          },
          {
            name: "let_duration",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "property_type",
            type: "text",
            isNullable: true,
          },
          {
            name: "hobbies",
            type: "text",
            isNullable: true,
          },
          {
            name: "ideal_living_environment",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "pets",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "smoker",
            type: "boolean",
            isNullable: true,
          },
          {
            name: "additional_info",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create tenant_profiles table
    console.log("📝 Creating tenant_profiles table...");
    await queryRunner.createTable(
      new Table({
        name: "tenant_profiles",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "userId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "full_name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "age_range",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "phone",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "date_of_birth",
            type: "date",
            isNullable: true,
          },
          {
            name: "nationality",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "occupation",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "industry",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "work_style",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "lifestyle",
            type: "text",
            isNullable: true,
          },
          {
            name: "pets",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "smoker",
            type: "boolean",
            isNullable: true,
          },
          {
            name: "hobbies",
            type: "text",
            isNullable: true,
          },
          {
            name: "ideal_living_environment",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "additional_info",
            type: "text",
            isNullable: true,
          },
          {
            name: "shortlisted_properties",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create operator_profiles table
    console.log("📝 Creating operator_profiles table...");
    await queryRunner.createTable(
      new Table({
        name: "operator_profiles",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "userId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "full_name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "company_name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "phone",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "date_of_birth",
            type: "date",
            isNullable: true,
          },
          {
            name: "nationality",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "business_address",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "company_registration",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "vat_number",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "license_number",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "years_experience",
            type: "integer",
            isNullable: true,
          },
          {
            name: "operating_areas",
            type: "text",
            isNullable: true,
          },
          {
            name: "property_types",
            type: "text",
            isNullable: true,
          },
          {
            name: "services",
            type: "text",
            isNullable: true,
          },
          {
            name: "business_description",
            type: "text",
            isNullable: true,
          },
          {
            name: "website",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "linkedin",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create properties table
    console.log("📝 Creating properties table...");
    await queryRunner.createTable(
      new Table({
        name: "properties",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "title",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: false,
          },
          {
            name: "address",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "price",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "bedrooms",
            type: "integer",
            isNullable: false,
          },
          {
            name: "bathrooms",
            type: "integer",
            isNullable: false,
          },
          {
            name: "property_type",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "furnishing",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "lifestyle_features",
            type: "text",
            isNullable: true,
          },
          {
            name: "available_from",
            type: "date",
            isNullable: false,
          },
          {
            name: "images",
            type: "text",
            isNullable: true,
          },
          {
            name: "is_btr",
            type: "boolean",
            default: false,
          },
          {
            name: "lat",
            type: "decimal",
            precision: 10,
            scale: 7,
            isNullable: true,
          },
          {
            name: "lng",
            type: "decimal",
            precision: 10,
            scale: 7,
            isNullable: true,
          },
          {
            name: "operator_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create property_media table
    console.log("📝 Creating property_media table...");
    await queryRunner.createTable(
      new Table({
        name: "property_media",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "property_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "s3_key",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "url",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "type",
            type: "varchar",
            default: "'image'",
            isNullable: false,
          },
          {
            name: "mime_type",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "original_filename",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "file_size",
            type: "bigint",
            isNullable: false,
          },
          {
            name: "order_index",
            type: "int",
            default: "0",
            isNullable: false,
          },
          {
            name: "is_featured",
            type: "boolean",
            default: "false",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create favourites table
    console.log("📝 Creating favourites table...");
    await queryRunner.createTable(
      new Table({
        name: "favourites",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "userId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "propertyId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create shortlist table
    console.log("📝 Creating shortlist table...");
    await queryRunner.createTable(
      new Table({
        name: "shortlist",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "userId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "propertyId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create foreign key constraints
    console.log("🔗 Creating foreign key constraints...");

    // Users -> Preferences
    await queryRunner.createForeignKey(
      "preferences",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    // Users -> Tenant Profiles
    await queryRunner.createForeignKey(
      "tenant_profiles",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    // Users -> Operator Profiles
    await queryRunner.createForeignKey(
      "operator_profiles",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    // Users -> Properties
    await queryRunner.createForeignKey(
      "properties",
      new TableForeignKey({
        columnNames: ["operator_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    // Properties -> Property Media
    await queryRunner.createForeignKey(
      "property_media",
      new TableForeignKey({
        columnNames: ["property_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "properties",
        onDelete: "CASCADE",
      })
    );

    // Users -> Favourites
    await queryRunner.createForeignKey(
      "favourites",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    // Properties -> Favourites
    await queryRunner.createForeignKey(
      "favourites",
      new TableForeignKey({
        columnNames: ["propertyId"],
        referencedColumnNames: ["id"],
        referencedTableName: "properties",
        onDelete: "CASCADE",
      })
    );

    // Users -> Shortlist
    await queryRunner.createForeignKey(
      "shortlist",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    // Properties -> Shortlist
    await queryRunner.createForeignKey(
      "shortlist",
      new TableForeignKey({
        columnNames: ["propertyId"],
        referencedColumnNames: ["id"],
        referencedTableName: "properties",
        onDelete: "CASCADE",
      })
    );

    // Create indexes
    console.log("🔍 Creating indexes...");

    // Users indexes
    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_users_email",
        columnNames: ["email"],
      })
    );
    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_users_google_id",
        columnNames: ["google_id"],
      })
    );
    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_users_roles",
        columnNames: ["roles"],
      })
    );

    // Preferences indexes
    await queryRunner.createIndex(
      "preferences",
      new TableIndex({
        name: "IDX_preferences_user_id",
        columnNames: ["user_id"],
      })
    );

    // Properties indexes
    await queryRunner.createIndex(
      "properties",
      new TableIndex({
        name: "IDX_properties_operator_id",
        columnNames: ["operator_id"],
      })
    );
    await queryRunner.createIndex(
      "properties",
      new TableIndex({
        name: "IDX_properties_price",
        columnNames: ["price"],
      })
    );
    await queryRunner.createIndex(
      "properties",
      new TableIndex({
        name: "IDX_properties_bedrooms",
        columnNames: ["bedrooms"],
      })
    );
    await queryRunner.createIndex(
      "properties",
      new TableIndex({
        name: "IDX_properties_property_type",
        columnNames: ["property_type"],
      })
    );

    // Property media indexes
    await queryRunner.createIndex(
      "property_media",
      new TableIndex({
        name: "IDX_property_media_property_id",
        columnNames: ["property_id"],
      })
    );

    // Seed test data
    console.log("🌱 Seeding test data...");

    // Create test operator user
    const operatorUser = await queryRunner.query(`
      INSERT INTO users (id, email, full_name, roles, password, created_at, updated_at)
      VALUES (
        uuid_generate_v4(),
        'operator@test.com',
        'Test Operator',
        'operator',
        '$2b$10$example.hash.here',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      ) RETURNING id
    `);

    const operatorId = operatorUser[0].id;

    // Create test properties
    await queryRunner.query(`
      INSERT INTO properties (id, title, description, address, price, bedrooms, bathrooms, property_type, furnishing, available_from, operator_id, created_at, updated_at)
      VALUES 
        (uuid_generate_v4(), 'Luxury 2-Bed Flat in Central London', 'Beautiful modern apartment with stunning city views', '123 Oxford Street, London W1D 2HX', 2500.00, 2, 2, 'apartment', 'furnished', '2024-03-01', '${operatorId}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        (uuid_generate_v4(), 'Modern 3-Bed House in Canary Wharf', 'Spacious family home with garden and parking', '456 Canary Wharf, London E14 5AB', 3500.00, 3, 2, 'house', 'part-furnished', '2024-04-01', '${operatorId}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        (uuid_generate_v4(), 'Studio Flat in Kings Cross', 'Perfect for professionals, close to transport', '789 Kings Cross, London N1C 4AG', 1800.00, 1, 1, 'studio', 'furnished', '2024-03-15', '${operatorId}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    console.log("✅ Complete schema created successfully!");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log("🔄 Rolling back complete schema...");

    // Drop tables in reverse order
    await queryRunner.dropTable("shortlist");
    await queryRunner.dropTable("favourites");
    await queryRunner.dropTable("property_media");
    await queryRunner.dropTable("properties");
    await queryRunner.dropTable("operator_profiles");
    await queryRunner.dropTable("tenant_profiles");
    await queryRunner.dropTable("preferences");
    await queryRunner.dropTable("users");

    console.log("✅ Complete schema rolled back successfully!");
  }
}
