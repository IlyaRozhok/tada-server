import axios from "axios";

const BASE_URL = "http://localhost:3002";

async function debug403() {
  console.log("🔍 Debugging 403 Forbidden Error...\n");

  try {
    // Test 1: Register a new user
    console.log("1️⃣ Testing user registration...");
    const registerData = {
      email: "debug-tenant@example.com",
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

    // Test 2: Test /me endpoint
    console.log("\n2️⃣ Testing /me endpoint...");
    const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`   ✅ /me endpoint: ${meResponse.status}`);
    console.log(`   👤 User role: ${meResponse.data.user.roles}`);
    console.log(`   🎯 Dashboard: ${meResponse.data.user.dashboard}`);

    // Test 3: Test operator dashboard with detailed error
    console.log("\n3️⃣ Testing operator dashboard with detailed error...");
    try {
      const operatorResponse = await axios.get(
        `${BASE_URL}/api/operator/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(`   ✅ Operator dashboard: ${operatorResponse.status}`);
      console.log(`   📊 Dashboard data:`, operatorResponse.data);
    } catch (error: any) {
      console.log(`   ❌ Operator dashboard failed: ${error.response?.status}`);
      console.log(`   📝 Error message: ${error.response?.data?.message}`);
      console.log(`   🔍 Full error data:`, error.response?.data);

      // Check if it's a CORS issue
      if (error.response?.status === 403) {
        console.log("\n🔍 403 Forbidden - Possible causes:");
        console.log("   1. RolesGuard still active somewhere");
        console.log("   2. Middleware blocking the request");
        console.log("   3. Service-level role checks");
        console.log("   4. Global interceptor");
      }
    }

    // Test 4: Test other endpoints to see which ones work
    console.log("\n4️⃣ Testing other endpoints...");

    // Test properties endpoint
    try {
      const propertiesResponse = await axios.get(`${BASE_URL}/api/properties`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(`   ✅ Properties: ${propertiesResponse.status}`);
    } catch (error: any) {
      console.log(
        `   ❌ Properties: ${error.response?.status} - ${error.response?.data?.message}`
      );
    }

    // Test users endpoint
    try {
      const usersResponse = await axios.get(`${BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(`   ✅ Users: ${usersResponse.status}`);
    } catch (error: any) {
      console.log(
        `   ❌ Users: ${error.response?.status} - ${error.response?.data?.message}`
      );
    }

    console.log("\n🎯 Debug summary:");
    console.log("   - Registration: ✅");
    console.log("   - /me endpoint: ✅");
    console.log("   - Operator dashboard: ❌ (403)");
    console.log("   - Need to investigate what's causing 403");
  } catch (error: any) {
    console.error("\n❌ Debug failed:", error.message);

    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    }
  }
}

// Run if called directly
if (require.main === module) {
  debug403().catch(console.error);
}
