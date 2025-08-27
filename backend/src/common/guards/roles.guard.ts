import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // Если роли не требуются, пропускаем
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Если пользователя нет, блокируем
    if (!user) {
      return false;
    }

    // Простая проверка роли
    const userRole = user.roles;
    if (!userRole) {
      return false;
    }

    // Проверяем, есть ли у пользователя требуемая роль
    return requiredRoles.includes(userRole);
  }
}
