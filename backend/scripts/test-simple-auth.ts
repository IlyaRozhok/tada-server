import axios from "axios";

const BASE_URL = "http://localhost:3002";

async function testSimpleAuth() {
  console.log("🔐 Testing Simplified Authentication...\n");

  try {
    // Test 1: Register a new tenant user
    console.log("1️⃣ Testing user registration...");
    const registerData = {
      email: "simple-tenant@example.com",
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

    // Test 2: Test dashboard-info endpoint
    console.log("\n2️⃣ Testing dashboard-info endpoint...");
    const dashboardResponse = await axios.get(`${BASE_URL}/api/auth/dashboard-info`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`   ✅ Dashboard info: ${dashboardResponse.status}`);
    console.log(`   👤 User role: ${dashboardResponse.data.user.role}`);
    console.log(`   🎯 Dashboard path: ${dashboardResponse.data.dashboard}`);
    console.log(`   💬 Message: ${dashboardResponse.data.message}`);

    // Test 3: Test operator dashboard (should work for any authenticated user)
    console.log("\n3️⃣ Testing operator dashboard (should work for any authenticated user)...");
    const operatorResponse = await axios.get(`${BASE_URL}/api/operator/dashboard`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`   ✅ Operator dashboard: ${operatorResponse.status}`);
    console.log(`   📊 Dashboard data:`, operatorResponse.data);

    // Test 4: Test without token (should fail)
    console.log("\n4️⃣ Testing without token (should fail)...");
    try {
      await axios.get(`${BASE_URL}/api/auth/dashboard-info`);
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

    console.log("\n🎉 Simplified authentication test completed successfully!");
    console.log(`🔗 Test endpoints manually at: ${BASE_URL}/api`);
    console.log(`📚 Swagger docs: ${BASE_URL}/api/docs`);
    
    console.log("\n💡 Simplified authentication flow:");
    console.log("   1. User registers/logs in and gets token");
    console.log("   2. Frontend calls /api/auth/dashboard-info to get redirect info");
    console.log("   3. Frontend redirects user to appropriate dashboard");
    console.log("   4. No complex role checks - just basic authentication");
    
  } catch (error: any) {
    console.error("\n❌ Simplified auth test failed:", error.message);

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
  testSimpleAuth().catch(console.error);
}
