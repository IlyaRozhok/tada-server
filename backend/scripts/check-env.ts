import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ConfigService } from "@nestjs/config";

async function checkEnv() {
  console.log("🔍 Checking Environment Variables...\n");

  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const configService = app.get(ConfigService);

    console.log("📋 Environment Variables:");
    console.log(`   JWT_SECRET: ${configService.get("JWT_SECRET")}`);
    console.log(
      `   JWT_ACCESS_EXPIRES_IN: ${configService.get("JWT_ACCESS_EXPIRES_IN")}`
    );
    console.log(`   NODE_ENV: ${configService.get("NODE_ENV")}`);
    console.log(`   PORT: ${configService.get("PORT")}`);

    // Check if there are any other JWT-related env vars
    const allEnvVars = Object.keys(process.env).filter(
      (key) =>
        key.includes("JWT") || key.includes("AUTH") || key.includes("TOKEN")
    );

    if (allEnvVars.length > 0) {
      console.log("\n🔐 Other JWT/Auth related environment variables:");
      allEnvVars.forEach((key) => {
        console.log(`   ${key}: ${process.env[key]}`);
      });
    }

    await app.close();
    console.log("\n✅ Environment check completed!");
  } catch (error: any) {
    console.error("\n❌ Environment check failed:", error.message);

    // Fallback to direct process.env check
    console.log("\n📋 Direct process.env check:");
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET}`);
    console.log(
      `   JWT_ACCESS_EXPIRES_IN: ${process.env.JWT_ACCESS_EXPIRES_IN}`
    );
    console.log(`   JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   PORT: ${process.env.PORT}`);
  }
}

// Run if called directly
if (require.main === module) {
  checkEnv().catch(console.error);
}
