import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserType } from 'src/helpers/enum';
import { IS_PUBLIC_KEY } from 'src/libs/jwt-authentication/jwt-authentication.decorator';
import { JwtAuthenticationService } from 'src/libs/jwt-authentication/jwt-authentication.service';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(
    private jwtAuthenticationService: JwtAuthenticationService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest() as Request;

    const token = this.jwtAuthenticationService.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      await this.jwtAuthenticationService.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException();
    }

    return [UserType.SUPER_ADMIN, UserType.ADMIN].includes(
      request.user.userType as any,
    );
  }
}
