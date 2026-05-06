import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../common/decorator/public.decorator.js';
import type { JwtPayload } from '../../common/type/jwt-payload.js';
import { Role } from '../../common/enum/role.enum.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('未提供認證憑證');

    // 開發環境後門
    // if (process.env.NODE_ENV !== 'production' && token === process.env.PASS_TOKEN) {
    //   request.user = { id: 'dev-admin', role: Role.SuperAdmin };
    //   return true;
    // }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      request.user = {
        jti: payload.jti,
        email: payload.email,
        id: payload.sub
      };

      return true;
    } catch (error: any) {
      throw new UnauthorizedException(error.message || '認證失敗');
    }
  }

  private extractToken(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
