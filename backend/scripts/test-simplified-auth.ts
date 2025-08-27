import axios from "axios";

const BASE_URL = "http://localhost:3002";

async function testSimplifiedAuth() {
  console.log("🔐 Testing Simplified Authentication (Refactored)...\n");

  try {
    // Test 1: Register a new tenant user
    console.log("1️⃣ Testing user registration...");
    const registerData = {
      email: "simplified-tenant-3@example.com",
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

    // Test 2: Test /me endpoint (simplified)
    console.log("\n2️⃣ Testing /me endpoint (simplified)...");
    const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`   ✅ /me endpoint: ${meResponse.status}`);
    console.log(`   👤 User role: ${meResponse.data.user.roles}`);
    console.log(`   🎯 Dashboard: ${meResponse.data.user.dashboard}`);

    // Test 3: Test operator dashboard (should work for any authenticated user)
    console.log(
      "\n3️⃣ Testing operator dashboard (should work for any authenticated user)..."
    );
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

    // Test 4: Test properties endpoints (should work for any authenticated user)
    console.log(
      "\n4️⃣ Testing properties endpoints (should work for any authenticated user)..."
    );
    const propertiesResponse = await axios.get(`${BASE_URL}/api/properties`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`   ✅ Properties: ${propertiesResponse.status}`);
    console.log(
      `   🏠 Found ${propertiesResponse.data.data?.length || 0} properties`
    );

    // Test 5: Test without token (should fail)
    console.log("\n5️⃣ Testing without token (should fail)...");
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

    console.log("\n🎉 Simplified authentication test completed successfully!");
    console.log(`🔗 Test endpoints manually at: ${BASE_URL}/api`);
    console.log(`📚 Swagger docs: ${BASE_URL}/api/docs`);

    console.log("\n💡 What was simplified:");
    console.log("   1. ✅ Removed RolesGuard - no more complex role checks");
    console.log(
      "   2. ✅ Simplified JWT Strategy - basic token validation only"
    );
    console.log(
      "   3. ✅ All endpoints now accessible to any authenticated user"
    );
    console.log("   4. ✅ Simple dashboard redirect logic in /me endpoint");
    console.log("   5. ✅ No more 'Access Denied' errors for role mismatches");
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
  testSimplifiedAuth().catch(console.error);
}
