import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/database/entities/Member';
import { VerificationCode } from 'src/database/entities/VerificationCode';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { JwtAuthenticationService } from 'src/libs/jwt-authentication/jwt-authentication.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Member, VerificationCode])],
  controllers: [MemberController],
  providers: [MemberService, JwtAuthenticationService, JwtService],
})
export class MemberModule {}
