import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { JwtAuthenticationService } from 'src/libs/jwt-authentication/jwt-authentication.service';
import { Member } from 'src/schemas/MemberSchema';
import { VerificationCode } from 'src/schemas/VerificationCode';
import { RegisterDto } from './dto/register.dto';
import { Exception } from 'src/core/exceptions/base-api.exception';
import {
  ErrorMessage,
  UserType,
  VerificationCodeStatus,
} from 'src/helpers/enum';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<Member>,
    @InjectModel(VerificationCode.name)
    private readonly verificationCodeModel: Model<VerificationCode>,
    private readonly jwtAuthenticationService: JwtAuthenticationService,
    private readonly configService: ConfigService,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async createChangePhoneCode(memberModel: Repository<Member>) {
    const changePhoneCode = randomString(10);
    const member = await memberModel.findOne({
      where: { changePhoneCode },
      select: ['_id'],
    });

    if (member) {
      return await this.createChangePhoneCode(memberModel);
    }

    return changePhoneCode;
  }

  async checkVerificationCode(
    verificationRepository: Repository<VerificationCode>,
    phone: string,
    code: string,
    type: VerificationCodeType,
  ) {
    const codeObject = await verificationRepository.findOne({
      where: {
        type,
        phone,
        code,
        status: VerificationCodeStatus.ACTIVE,
        expireAt: MoreThan(new Date().toISOString()),
      },
      select: ['id', 'code', 'phone'],
    });

    if (!codeObject) {
      throw new Exception(ErrorMessage.Verification_Code_Invalid);
    }

    return codeObject;
  }

  // async handleRequestVerificationCodeForChangePhone(
  //   params: RequestVerificationCodeDto,
  // ) {
  //   if (!params.changePhoneCode) {
  //     throw new Exception(
  //       ErrorMessage.Invalid_Input,
  //       'Missing changePhoneCode',
  //     );
  //   }

  //   const member = await this.memberModel.findOne({
  //     where: { changePhoneCode: params.changePhoneCode },
  //     select: ['id', 'phone', 'status'],
  //   });

  //   if (!member) {
  //     throw new Exception(ErrorMessage.Change_Phone_Number_Code_Invalid);
  //   }

  //   if (member.phone === params.phone) {
  //     throw new Exception(
  //       ErrorMessage.Your_Are_Change_To_Shame_Phone_Number,
  //       'Old phone number and new phone number are same',
  //     );
  //   }

  //   const hasPhone = await this.memberModel.findOne({
  //     where: { phone: params.phone },
  //     select: ['id'],
  //   });

  //   if (hasPhone) {
  //     throw new Exception(ErrorMessage.Phone_Already_Exists);
  //   }
  // }

  // async requestVerifyCationCode(params: RequestVerificationCodeDto) {
  //   const { phone, type } = params;
  //   const code = randomOTP();
  //   const currentMs = new Date().getTime();

  //   if (params.type === VerificationCodeType.CHANGE_PHONE_NUMBER) {
  //     await this.handleRequestVerificationCodeForChangePhone(params);
  //   }

  //   if (params.type === VerificationCodeType.LOGIN) {
  //     const member = await this.memberModel.findOne({
  //       where: { phone: params.phone },
  //       select: ['id', 'status'],
  //     });
  //     if (!member) {
  //       throw new Exception(ErrorMessage.Phone_Not_Exists);
  //     }
  //   }

  //   if (params.type === VerificationCodeType.REGISTER) {
  //     const member = await this.memberModel.findOne({
  //       where: { phone: params.phone },
  //       select: ['id', 'status'],
  //     });

  //     if (member) {
  //       throw new Exception(
  //         ErrorMessage.Phone_Already_Exists,
  //         'This phone number already exists',
  //       );
  //     }
  //   }

  //   const codeObject = await this.verificationCodeModel.findOne({
  //     where: {
  //       phone,
  //       type,
  //       status: VerificationCodeStatus.ACTIVE,
  //       expireRetry: MoreThan(new Date(currentMs).toISOString()),
  //     },
  //   });

  //   if (codeObject) {
  //     if (codeObject.retryCount >= 5) {
  //       throw new Exception(
  //         ErrorMessage.Maximum_Retry_Verification_Code,
  //         `Block until: ${codeObject.expireRetry}(15 minutes from the first call)`,
  //       );
  //     }

  //     if (codeObject.expireAt) {
  //       const retryAtMs = new Date(codeObject.retryAt).getTime();

  //       if (
  //         retryAtMs + this.configService.get('DELAY_BETWEEN_RETRY') >
  //         currentMs
  //       ) {
  //         throw new Exception(
  //           ErrorMessage.Delay_Between_Retry_Required,
  //           `Delay between retry is ${
  //             this.configService.get('DELAY_BETWEEN_RETRY') / 1000
  //           } s, next time available from ${new Date(
  //             retryAtMs + this.configService.get('DELAY_BETWEEN_RETRY'),
  //           ).toISOString()}`,
  //         );
  //       }
  //     }

  //     await this.verificationCodeModel.update(
  //       { id: codeObject.id },
  //       {
  //         retryCount: codeObject.retryCount + 1,
  //         code,
  //         retryAt: new Date(currentMs).toISOString(),
  //       },
  //     );
  //   }

  //   const expireAt = new Date(
  //     currentMs + this.configService.get('VERIFY_CODE_TTL'),
  //   ).toISOString();
  //   const expireRetry = new Date(
  //     currentMs + this.configService.get('CONFIG_RETRY_BLOCK'),
  //   ).toISOString();
  //   const useAt = new Date(currentMs).toISOString();

  //   if (!codeObject) {
  //     await this.verificationCodeModel.save({
  //       phone,
  //       code,
  //       type,
  //       expireAt,
  //       expireRetry,
  //       useAt,
  //     });
  //   }

  //   return code;
  // }

  // async fetchRegisterCode(code: string) {
  //   const codeObject = await this.verificationCodeModel.findOne({
  //     where: {
  //       code,
  //       status: VerificationCodeStatus.ACTIVE,
  //       expireAt: MoreThan(new Date().toISOString()),
  //     },
  //     select: ['id', 'code', 'phone'],
  //   });

  //   if (!codeObject) {
  //     throw new Exception(ErrorMessage.Verification_Code_Invalid);
  //   }

  //   await this.verificationCodeModel.update(
  //     { id: codeObject.id },
  //     { status: VerificationCodeStatus.USED },
  //   );

  //   const registerToken = this.jwtAuthenticationService.generateRegisterToken({
  //     code,
  //     phone: codeObject.phone,
  //   });

  //   return { registerToken };
  // }

  /**
   * Generate token & refresh token.
   */
  async generateToken(
    memberModel: Model<Member>,
    member: Member,
  ): Promise<{ token: string; refreshToken: string }> {
    const payload = { _id: member?._id, userType: UserType.CLIENT };

    const token = this.jwtAuthenticationService.generateAccessToken(payload);

    const isValid = this.jwtAuthenticationService.verifyRefreshToken(
      member.refreshToken,
    );
    if (!isValid) {
      const newRefreshToken =
        this.jwtAuthenticationService.generateRefreshToken(payload);

      await memberModel.updateOne(member._id, {
        refreshToken: newRefreshToken,
      });

      return { token, refreshToken: newRefreshToken };
    }

    return { token, refreshToken: member.refreshToken };
  }

  // async login({ phone, code }: LoginDto) {
  //   return await this.connection.transaction(async (transaction) => {
  //     const verificationCodeModel = transaction.getRepository(VerificationCode);
  //     const memberModel = transaction.getRepository(Member);

  //     const member = await memberModel.findOne({
  //       where: { phone },
  //       select: ['id', 'phone', 'status', 'refreshToken'],
  //     });
  //     if (!member) {
  //       throw new Exception(ErrorMessage.Phone_Not_Exists);
  //     }

  //     const codeObject = await this.checkVerificationCode(
  //       verificationCodeModel,
  //       phone,
  //       code,
  //       VerificationCodeType.LOGIN,
  //     );

  //     await verificationCodeModel.update(codeObject.id, {
  //       status: VerificationCodeStatus.USED,
  //       useAt: new Date().toISOString(),
  //     });

  //     return this.generateToken(memberModel, member);
  //   });
  // }

  async register({ registerToken, ...params }: RegisterDto) {
    const transaction = await mongoose.startSession();
    try {
      const payload =
        this.jwtAuthenticationService.verifyRegisterToken(registerToken);
      if (!payload) {
        throw new Exception(ErrorMessage.Register_Token_Expired);
      }

      if (payload.phone !== params.phone) {
        throw new Exception(ErrorMessage.Register_Token_Expired);
      }

      const member = await this.memberModel.findOne({
        where: [{ phone: params.phone }],
        select: ['id', 'phone'],
      });

      if (member?.phone === params.phone) {
        throw new Exception(ErrorMessage.Phone_Already_Exists);
      }

      const newMember = await this.memberModel.create(params);

      const result = this.generateToken(this.memberModel, newMember);

      await transaction.commitTransaction();

      return result;
    } catch (error) {
      await transaction.abortTransaction();
      throw error;
    } finally {
      await transaction.endSession();
    }
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const payload =
      this.jwtAuthenticationService.verifyRefreshToken(refreshToken);
    if (!payload)
      throw new UnauthorizedException(
        'You have provided invalid refresh token',
      );

    const user = await this.memberModel.findOne({
      where: { id: payload.id },
      select: ['id', 'refreshToken'],
    });

    if (refreshToken !== user.refreshToken)
      throw new UnauthorizedException(
        'Your refresh token changed, please login again',
      );

    const result = await this.generateToken(this.memberModel, user);
    return result?.token;
  }
}
