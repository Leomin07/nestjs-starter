import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserType } from 'src/helpers/enum';
import { IS_PUBLIC_KEY } from 'src/libs/jwt-authentication/jwt-authentication.decorator';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest() as Request;
    console.log('ClientGuard -> canActivate -> request:', request?.user);

    return request?.user?.userType === UserType.CLIENT;
  }
}
