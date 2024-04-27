import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './jwt-authentication.decorator';
import { JwtAuthenticationService } from './jwt-authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtAuthenticationService: JwtAuthenticationService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.jwtAuthenticationService.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      await this.jwtAuthenticationService.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
