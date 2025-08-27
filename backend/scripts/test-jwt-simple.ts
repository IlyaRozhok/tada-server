import * as jwt from "jsonwebtoken";

async function testJwtSimple() {
  console.log("🔐 Testing JWT Configuration (Simple)...\n");

  try {
    const secret = "your-secret-key";

    // Test token generation
    const testPayload = {
      sub: "test-user-id",
      email: "test@example.com",
      role: "tenant",
    };

    const token = jwt.sign(testPayload, secret, { expiresIn: "7d" });
    console.log(`✅ Token generated: ${token.substring(0, 50)}...`);

    // Test token verification
    const decoded = jwt.verify(token, secret) as any;
    console.log("✅ Token verified successfully");
    console.log(`   Subject: ${decoded.sub}`);
    console.log(`   Email: ${decoded.email}`);
    console.log(`   Role: ${decoded.role}`);
    console.log(`   Expires: ${new Date(decoded.exp * 1000).toISOString()}`);

    // Test with different expiration
    const shortToken = jwt.sign(testPayload, secret, { expiresIn: "8m" });
    const decodedShort = jwt.verify(shortToken, secret) as any;
    console.log(
      `\n✅ Short token (8m) expires: ${new Date(decodedShort.exp * 1000).toISOString()}`
    );

    console.log("\n🎉 JWT simple test completed successfully!");
  } catch (error: any) {
    console.error("\n❌ JWT simple test failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testJwtSimple().catch(console.error);
}
