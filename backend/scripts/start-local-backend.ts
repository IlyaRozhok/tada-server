import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  console.log("🚀 Starting local backend with test database...");

  // Override environment variables for local testing
  process.env.DB_HOST = "localhost";
  process.env.DB_PORT = "5432";
  process.env.DB_USERNAME = "postgres";
  process.env.DB_PASSWORD = "password";
  process.env.DB_DATABASE = "rental_platform_test";
  process.env.JWT_SECRET = "your-super-secret-jwt-key-for-local-testing";
  process.env.JWT_ACCESS_EXPIRES_IN = "7d";
  process.env.PORT = "3002";
  process.env.NODE_ENV = "development";

  console.log("📊 Database configuration:");
  console.log(`  Host: ${process.env.DB_HOST}`);
  console.log(`  Port: ${process.env.DB_PORT}`);
  console.log(`  Database: ${process.env.DB_DATABASE}`);
  console.log(`  Username: ${process.env.DB_USERNAME}`);

  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"],
  });

  // Enable CORS for local testing
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  });
  app.setGlobalPrefix("api");
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Tada Server API - Local Test")
    .setDescription("API for rental platform - Local testing environment")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);

  console.log(`✅ Backend is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  console.log(`🔗 Test database: ${process.env.DB_DATABASE}`);
  console.log("📝 Logs will appear below...\n");
}

bootstrap().catch((error) => {
  console.error("❌ Failed to start backend:", error);
  process.exit(1);
});
