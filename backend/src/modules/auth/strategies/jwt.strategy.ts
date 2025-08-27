import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET", "your-secret-key"),
    });
  }

  async validate(payload: any) {
    const { sub: userId } = payload;

    if (!userId) {
      throw new UnauthorizedException("Invalid token: no user ID");
    }

    // Простая проверка пользователя
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["tenantProfile", "operatorProfile"],
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Возвращаем пользователя с базовой информацией
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      tenantProfile: user.tenantProfile,
      operatorProfile: user.operatorProfile,
    };
  }
}
