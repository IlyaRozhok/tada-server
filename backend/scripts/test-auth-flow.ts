import axios from "axios";

const BASE_URL = "http://localhost:3002";

async function testAuthFlow() {
  console.log("🔐 Testing Authentication and Authorization Flow...\n");

  try {
    // Test 1: Register a new tenant user
    console.log("1️⃣ Testing user registration...");
    const registerData = {
      email: "test-tenant@example.com",
      password: "testpassword123",
      role: "tenant",
    };

    const registerResponse = await axios.post(
      `${BASE_URL}/api/auth/register`,
      registerData
    );
    console.log(`   ✅ Registration: ${registerResponse.status}`);
    console.log(`   📧 User email: ${registerResponse.data.user.email}`);
    console.log(`   🔑 User roles: ${registerResponse.data.user.roles}`);
    console.log(
      `   🎫 Access token: ${registerResponse.data.access_token.substring(0, 20)}...`
    );

    const accessToken = registerResponse.data.access_token;

    // Test 2: Test /me endpoint with token
    console.log("\n2️⃣ Testing /me endpoint with token...");
    const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`   ✅ /me endpoint: ${meResponse.status}`);
    console.log(`   👤 User ID: ${meResponse.data.user.id}`);
    console.log(`   🔑 User roles: ${meResponse.data.user.roles}`);

    // Test 3: Test protected endpoint (properties with auth)
    console.log("\n3️⃣ Testing protected properties endpoint...");
    const propertiesResponse = await axios.get(
      `${BASE_URL}/api/properties/public`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(`   ✅ Protected properties: ${propertiesResponse.status}`);
    console.log(
      `   🏠 Found ${propertiesResponse.data.data?.length || 0} properties`
    );

    // Test 4: Test without token (should fail)
    console.log("\n4️⃣ Testing protected endpoint without token...");
    try {
      await axios.get(`${BASE_URL}/api/auth/me`);
      console.log("   ❌ Should have failed without token");
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log(
          "   ✅ Correctly rejected without token (401 Unauthorized)"
        );
      } else {
        console.log(`   ⚠️ Unexpected error: ${error.response?.status}`);
      }
    }

    // Test 5: Test with invalid token
    console.log("\n5️⃣ Testing with invalid token...");
    try {
      await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: "Bearer invalid-token-here",
        },
      });
      console.log("   ❌ Should have failed with invalid token");
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log(
          "   ✅ Correctly rejected invalid token (401 Unauthorized)"
        );
      } else {
        console.log(`   ⚠️ Unexpected error: ${error.response?.status}`);
      }
    }

    console.log("\n🎉 Authentication flow test completed successfully!");
    console.log(`🔗 Test endpoints manually at: ${BASE_URL}/api`);
    console.log(`📚 Swagger docs: ${BASE_URL}/api/docs`);
  } catch (error: any) {
    console.error("\n❌ Auth flow test failed:", error.message);

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
  testAuthFlow().catch(console.error);
}

export default testAuthFlow;

