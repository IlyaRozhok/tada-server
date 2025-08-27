import axios from "axios";

const BASE_URL = "http://localhost:3002";

async function testEndpoints() {
  console.log("🧪 Testing API endpoints...\n");

  try {
    // Test 1: Health check
    console.log("1️⃣ Testing health check...");
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log(
      `   ✅ Health check: ${healthResponse.status} - ${healthResponse.data.message || "OK"}`
    );

    // Test 2: Public properties endpoint
    console.log("\n2️⃣ Testing public properties endpoint...");
    const propertiesResponse = await axios.get(
      `${BASE_URL}/api/properties/public`
    );
    console.log(
      `   ✅ Properties: ${healthResponse.status} - Found ${propertiesResponse.data.data?.length || 0} properties`
    );

    if (propertiesResponse.data.data?.length > 0) {
      const firstProperty = propertiesResponse.data.data[0];
      console.log(
        `   📍 First property: ${firstProperty.title} - £${firstProperty.price}`
      );
    }

    // Test 3: Swagger docs
    console.log("\n3️⃣ Testing Swagger docs...");
    const swaggerResponse = await axios.get(`${BASE_URL}/api/docs`);
    console.log(
      `   ✅ Swagger docs: ${swaggerResponse.status} - Available at ${BASE_URL}/api/docs`
    );

    // Test 4: Test database connection through properties endpoint
    console.log("\n4️⃣ Testing database connection...");
    const dbTestResponse = await axios.get(
      `${BASE_URL}/api/properties/public?limit=1`
    );
    console.log(
      `   ✅ Database connection: ${dbTestResponse.status} - Success`
    );

    console.log("\n🎉 All API tests passed successfully!");
    console.log(`📚 Open Swagger docs: ${BASE_URL}/api/docs`);
    console.log(`🔗 Test endpoints manually at: ${BASE_URL}`);
  } catch (error: any) {
    console.error("\n❌ API test failed:", error.message);

    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    }

    console.log(
      "\n💡 Make sure the backend is running with: npm run start:local"
    );
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testEndpoints().catch(console.error);
}

export default testEndpoints;
