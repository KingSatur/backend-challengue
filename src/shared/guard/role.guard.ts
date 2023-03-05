import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../constants/role.enum';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const {
      user: { userId },
    } = context.switchToHttp().getRequest();

    const userEntity = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    return requiredRoles?.includes(userEntity?.role as Role);
  }
}
