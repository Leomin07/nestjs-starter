import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthenticationModule } from 'src/libs/jwt-authentication/jwt-authentication.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MemberSchema } from 'src/libs/message/schemas/member.schema';
import { Member } from 'src/schemas/MemberSchema';
import {
  VerificationCode,
  VerificationCodeSchema,
} from 'src/schemas/VerificationCode';

@Module({
  imports: [
    JwtAuthenticationModule,
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: VerificationCode.name, schema: VerificationCodeSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
