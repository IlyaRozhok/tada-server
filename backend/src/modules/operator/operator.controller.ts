import { Controller, Get, Post, Body, UseGuards, Req } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { OperatorService } from "./operator.service";

@Controller("operator")
@UseGuards(JwtAuthGuard) // Только базовая аутентификация, без проверки ролей
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {}

  @Get("dashboard")
  async getDashboard(@Req() req) {
    // Доступно любому аутентифицированному пользователю
    return this.operatorService.getDashboardCounts(req.user.id);
  }

  @Get("tenants")
  async getTenants(@Req() req) {
    return this.operatorService.getTenants(req.user.id);
  }

  @Get("properties")
  async getOperatorProperties(@Req() req) {
    return this.operatorService.getOperatorProperties(req.user.id);
  }

  @Post("suggest-property")
  async suggestProperty(
    @Req() req,
    @Body() body: { tenantId: string; propertyId: string }
  ) {
    return this.operatorService.suggestProperty(
      req.user.id,
      body.tenantId,
      body.propertyId
    );
  }
}
