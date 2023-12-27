import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { ClientGuard } from 'src/core/guards/client.guard';
import { Public } from 'src/libs/jwt-authentication/jwt-authentication.decorator';
import { AuthService } from './auth.service';
import { ChangePhoneNumberDto } from './dto/change-phone-number.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestVerificationCodeDto } from './dto/request-verification-code.dto';

const configService = new ConfigService();
@Controller('auth')
@UseGuards(ClientGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Public()
  @Post('/register')
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
  @Post('/request-verification-code')
  async requestVerificationCode(@Body() body: RequestVerificationCodeDto) {
    return await this.authService.requestVerifyCationCode(body);
  }

  @Public()
  @Post('/change-phone-number')
  async changePhoneNumber(@Body() body: ChangePhoneNumberDto) {
    return await this.authService.changePhoneNumber(body);
  }

  @Public()
  @Get('/register-token/:code')
  async fetchRegisterToken(@Param('code') code: string) {
    return this.authService.fetchRegisterCode(code);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ token: string }> {
    const token = await this.authService.refreshToken(refreshToken);
    return { token };
  }
}
