import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

export function Auth(...roles: string[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard), // Упрощено - только базовая аутентификация
    ApiBearerAuth()
  );
}
