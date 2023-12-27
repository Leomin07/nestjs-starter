import { Body, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import {
  CustomController,
  CustomPost,
} from 'src/core/decorator/swagger.decorator';
import { ClientGuard } from 'src/core/guards/client.guard';
import { Public } from 'src/libs/jwt-authentication/jwt-authentication.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestVerificationCodeDto } from './dto/request-verification-code.dto';

const configService = new ConfigService();
@CustomController('auth')
@UseGuards(ClientGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @CustomPost('/login', LoginDto)
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Public()
  @CustomPost('/register', RegisterDto)
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Public()
  @Throttle({
    default: {
      limit: configService.get('REQUEST_VERIFICATION_CODE_LIMIT'),
      ttl: configService.get('REQUEST_VERIFICATION_CODE_TTL'),
    },
  })
  @CustomPost('/request-verification-code', RequestVerificationCodeDto)
  async requestVerificationCode(@Body() body: RequestVerificationCodeDto) {
    return await this.authService.requestVerifyCationCode(body);
  }

  @Public()
  @Get('/register-token/:code')
  async fetchRegisterToken(@Param('code') code: string) {
    return this.authService.fetchRegisterCode(code);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken')
    refreshToken: string,
  ): Promise<{ token: string }> {
    const token = await this.authService.refreshToken(refreshToken);
    return { token };
  }
}
