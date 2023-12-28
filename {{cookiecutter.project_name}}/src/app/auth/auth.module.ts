import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/database/entities/Member';
import { VerificationCode } from 'src/database/entities/VerificationCode';
import { JwtAuthenticationModule } from 'src/libs/jwt-authentication/jwt-authentication.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, VerificationCode]),
    JwtAuthenticationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
