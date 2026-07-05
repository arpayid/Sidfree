import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "super-secret",
    });
  }

  async validate(payload: any) {
    // payload should contain { sub: userId, tenantId: tenantId, role: roleName }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    let parsedPermissions = [];
    try {
      parsedPermissions = JSON.parse(user.role.permissions);
    } catch (e) {}

    return {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role.name,
      permissions: parsedPermissions,
    };
  }
}
