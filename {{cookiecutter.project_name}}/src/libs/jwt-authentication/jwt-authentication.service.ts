import { LiteralObject } from '@nestjs/cache-manager';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { TokenType } from 'src/helpers/enum';
import { ITokenPayload } from './jwt-authentication.interface';

@Injectable()
export class JwtAuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async validateRequest(request: Request) {
    const token = this.extractTokenFromHeader(request);

    try {
      const decoded = this.jwtService.verify<LiteralObject>(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
        algorithms: this.configService.get('JWT_ALGORITHMS'),
      });

      Object.assign(request, { payload: decoded });
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  public generateAccessToken(payload: ITokenPayload): string {
    return this.jwtService.sign(
      { ...payload, tokenType: TokenType.ACCESS_TOKEN },
      {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
      },
    );
  }

  public generateRefreshToken(payload: ITokenPayload): string {
    return this.jwtService.sign(
      { ...payload, tokenType: TokenType.REFRESH_TOKEN },
      {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      },
    );
  }

  public generateRegisterToken(payload: {
    phone: string;
    code: string;
  }): string {
    return this.jwtService.sign(
      { ...payload, tokenType: TokenType.REGISTER_TOKEN },
      {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_REGISTER_TOKEN_EXPIRES_IN'),
      },
    );
  }

  public verifyRegisterToken(registerTOken: string) {
    try {
      const payload = this.jwtService.verify(registerTOken, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
      return payload?.tokenType === TokenType.REGISTER_TOKEN ? payload : false;
    } catch (error) {
      return false;
    }
  }

  public verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
      return payload?.tokenType === TokenType.ACCESS_TOKEN ? payload : false;
    } catch (error) {
      return false;
    }
  }

  public verifyRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
      return payload?.tokenType === TokenType.REFRESH_TOKEN ? payload : false;
    } catch (error) {
      return false;
    }
  }

  public async hashPassword(password: string) {
    const hash = await bcrypt.hash(
      password,
      this.configService.get('SALT_OR_ROUNDS'),
    );

    return hash;
  }

  public async comparePassword(password: string, hash: string) {
    const result = await bcrypt.compare(password, hash);

    return result;
  }
}
