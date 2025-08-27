import { DataSource } from "typeorm";
import { User } from "../src/entities/user.entity";
import { Preferences } from "../src/entities/preferences.entity";
import { TenantProfile } from "../src/entities/tenant-profile.entity";
import { OperatorProfile } from "../src/entities/operator-profile.entity";
import { Property } from "../src/entities/property.entity";
import { PropertyMedia } from "../src/entities/property-media.entity";
import { Favourite } from "../src/entities/favourite.entity";
import { Shortlist } from "../src/entities/shortlist.entity";

async function testUserFlow() {
  console.log("🚀 Starting user flow test...");

  const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "rental_platform_test",
    entities: [
      User,
      Preferences,
      TenantProfile,
      OperatorProfile,
      Property,
      PropertyMedia,
      Favourite,
      Shortlist,
    ],
    synchronize: false,
    logging: false,
  });

  try {
    console.log("📡 Connecting to database...");
    await dataSource.initialize();
    console.log("✅ Database connected successfully!");

    const userRepository = dataSource.getRepository(User);
    const preferencesRepository = dataSource.getRepository(Preferences);
    const tenantProfileRepository = dataSource.getRepository(TenantProfile);
    const propertyRepository = dataSource.getRepository(Property);

    // Test 1: Create a new tenant user
    console.log("\n🧪 Test 1: Creating a new tenant user...");
    const newTenant = userRepository.create({
      email: "tenant@test.com",
      full_name: "John Doe",
      roles: "tenant",
      password: "$2b$10$example.hash.here",
    });

    const savedTenant = await userRepository.save(newTenant);
    console.log("✅ Tenant user created:", savedTenant.email);

    // Test 2: Create preferences for tenant
    console.log("\n🧪 Test 2: Creating preferences for tenant...");
    const preferences = preferencesRepository.create({
      user: savedTenant,
      min_price: 1500,
      max_price: 3000,
      min_bedrooms: 1,
      max_bedrooms: 2,
      property_type: ["apartment", "studio"],
      primary_postcode: "W1D 2HX",
    });

    const savedPreferences = await preferencesRepository.save(preferences);
    console.log("✅ Preferences created with ID:", savedPreferences.id);

    // Test 3: Create tenant profile
    console.log("\n🧪 Test 3: Creating tenant profile...");
    const tenantProfile = tenantProfileRepository.create({
      user: savedTenant,
    });

    const savedTenantProfile =
      await tenantProfileRepository.save(tenantProfile);
    console.log("✅ Tenant profile created with ID:", savedTenantProfile.id);

    // Test 4: Test user helper methods
    console.log("\n🧪 Test 4: Testing user helper methods...");
    const userWithRelations = await userRepository.findOne({
      where: { id: savedTenant.id },
      relations: ["preferences", "tenantProfile"],
    });

    if (userWithRelations) {
      console.log(
        "✅ User has role 'tenant':",
        userWithRelations.hasRole("tenant")
      );
      console.log(
        "✅ User has role 'operator':",
        userWithRelations.hasRole("operator")
      );
      console.log("✅ User roles array:", userWithRelations.getRolesArray());
      console.log(
        "✅ User preferences:",
        userWithRelations.preferences ? "Found" : "Not found"
      );
      console.log(
        "✅ User tenant profile:",
        userWithRelations.tenantProfile ? "Found" : "Not found"
      );
    }

    // Test 5: Test property queries
    console.log("\n🧪 Test 5: Testing property queries...");
    const properties = await propertyRepository.find({
      relations: ["operator"],
    });

    console.log(`✅ Found ${properties.length} properties:`);
    properties.forEach((prop, index) => {
      console.log(
        `  ${index + 1}. ${prop.title} - £${prop.price} - ${prop.bedrooms} bed`
      );
    });

    // Test 6: Test user search by role
    console.log("\n🧪 Test 6: Testing user search by role...");
    const tenantUsers = await userRepository
      .createQueryBuilder("user")
      .where("user.roles LIKE :role", { role: "%tenant%" })
      .getMany();

    console.log(`✅ Found ${tenantUsers.length} tenant users:`);
    tenantUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (${user.roles})`);
    });

    // Test 7: Test complex query with joins
    console.log("\n🧪 Test 7: Testing complex query with joins...");
    const usersWithProfiles = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.preferences", "preferences")
      .leftJoinAndSelect("user.tenantProfile", "tenantProfile")
      .leftJoinAndSelect("user.operatorProfile", "operatorProfile")
      .where("user.roles LIKE :role", { role: "%tenant%" })
      .getMany();

    console.log(`✅ Found ${usersWithProfiles.length} users with profiles:`);
    usersWithProfiles.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email}`);
      console.log(`     - Preferences: ${user.preferences ? "Yes" : "No"}`);
      console.log(
        `     - Tenant Profile: ${user.tenantProfile ? "Yes" : "No"}`
      );
      console.log(
        `     - Operator Profile: ${user.operatorProfile ? "Yes" : "No"}`
      );
    });

    await dataSource.destroy();
    console.log("\n🎉 User flow test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

testUserFlow();
