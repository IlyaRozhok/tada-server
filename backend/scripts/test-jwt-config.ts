import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { JwtService } from "@nestjs/jwt";

async function testJwtConfig() {
  console.log("🔐 Testing JWT Configuration...\n");

  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const jwtService = app.get(JwtService);

    console.log("✅ JWT Service initialized successfully");

    // Test token generation
    const testPayload = {
      sub: "test-user-id",
      email: "test@example.com",
      role: "tenant",
    };

    const token = jwtService.sign(testPayload);
    console.log(`✅ Token generated: ${token.substring(0, 50)}...`);

    // Test token verification
    const decoded = jwtService.verify(token);
    console.log("✅ Token verified successfully");
    console.log(`   Subject: ${decoded.sub}`);
    console.log(`   Email: ${decoded.email}`);
    console.log(`   Role: ${decoded.role}`);
    console.log(`   Expires: ${new Date(decoded.exp * 1000).toISOString()}`);

    // Test with different expiration
    const longToken = jwtService.sign(testPayload, { expiresIn: "7d" });
    const decodedLong = jwtService.verify(longToken);
    console.log(
      `\n✅ Long token (7d) expires: ${new Date(decodedLong.exp * 1000).toISOString()}`
    );

    await app.close();
    console.log("\n🎉 JWT configuration test completed successfully!");
  } catch (error: any) {
    console.error("\n❌ JWT configuration test failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testJwtConfig().catch(console.error);
}
