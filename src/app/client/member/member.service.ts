import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from 'src/core/exceptions/base-api.exception';
import { Member } from 'src/database/entities/Member';
import { VerificationCode } from 'src/database/entities/VerificationCode';
import {
  VerificationCodeType,
  VerificationCodeStatus,
  ErrorMessage,
  UserType,
  ErrorCode,
} from 'src/helpers/enum';
import { randomString, randomOTP } from 'src/helpers/utils';
import { JwtAuthenticationService } from 'src/libs/jwt-authentication/jwt-authentication.service';
import { Repository, DataSource, MoreThan } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestVerificationCodeDto } from './dto/request-verification-code.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
    private readonly dataSource: DataSource,
    private readonly jwtAuthenticationService: JwtAuthenticationService,
    private readonly configService: ConfigService,
  ) {}

  async createChangePhoneCode(memberRepository: Repository<Member>) {
    const changePhoneCode = randomString(10);
    const member = await memberRepository.findOne({
      where: { changePhoneCode },
      select: ['id'],
    });

    if (member) {
      return await this.createChangePhoneCode(memberRepository);
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
      throw new Exception(
        ErrorCode.Verification_Code_Invalid,
        ErrorMessage.Verification_Code_Invalid,
      );
    }

    return codeObject;
  }

  async handleRequestVerificationCodeForChangePhone(
    params: RequestVerificationCodeDto,
  ) {
    if (!params.changePhoneCode) {
      throw new Exception(
        ErrorCode.Invalid_Input,
        ErrorMessage.Invalid_Input,
        'Missing changePhoneCode',
      );
    }

    const member = await this.memberRepository.findOne({
      where: { changePhoneCode: params.changePhoneCode },
      select: ['id', 'phone', 'status'],
    });

    if (!member) {
      throw new Exception(
        ErrorCode.Change_Phone_Number_Code_Invalid,
        ErrorMessage.Change_Phone_Number_Code_Invalid,
      );
    }

    if (member.phone === params.phone) {
      throw new Exception(
        ErrorCode.Your_Are_Change_To_Shame_Phone_Number,
        ErrorMessage.Your_Are_Change_To_Shame_Phone_Number,
        'Old phone number and new phone number are same',
      );
    }

    const hasPhone = await this.memberRepository.findOne({
      where: { phone: params.phone },
      select: ['id'],
    });

    if (hasPhone) {
      throw new Exception(
        ErrorCode.Phone_Already_Exists,
        ErrorMessage.Phone_Already_Exists,
      );
    }
  }

  async requestVerifyCationCode(params: RequestVerificationCodeDto) {
    const { phone, type } = params;
    const code = randomOTP();
    const currentMs = new Date().getTime();

    if (params.type === VerificationCodeType.CHANGE_PHONE_NUMBER) {
      await this.handleRequestVerificationCodeForChangePhone(params);
    }

    if (params.type === VerificationCodeType.LOGIN) {
      const member = await this.memberRepository.findOne({
        where: { phone: params.phone },
        select: ['id', 'status'],
      });
      if (!member) {
        throw new Exception(
          ErrorCode.Phone_Already_Exists,
          ErrorMessage.Phone_Not_Exists,
        );
      }
    }

    if (params.type === VerificationCodeType.REGISTER) {
      const member = await this.memberRepository.findOne({
        where: { phone: params.phone },
        select: ['id', 'status'],
      });

      if (member) {
        throw new Exception(
          ErrorCode.Phone_Already_Exists,
          ErrorMessage.Phone_Already_Exists,
          'This phone number already exists',
        );
      }
    }

    const codeObject = await this.verificationCodeRepository.findOne({
      where: {
        phone,
        type,
        status: VerificationCodeStatus.ACTIVE,
        expireRetry: MoreThan(new Date(currentMs).toISOString()),
      },
    });

    if (codeObject) {
      if (codeObject.retryCount >= 5) {
        throw new Exception(
          ErrorCode.Maximum_Retry_Verification_Code,
          ErrorMessage.Maximum_Retry_Verification_Code,
          `Block until: ${codeObject.expireRetry}(15 minutes from the first call)`,
        );
      }

      if (codeObject.expireAt) {
        const retryAtMs = new Date(codeObject.retryAt).getTime();

        if (
          retryAtMs + this.configService.get('DELAY_BETWEEN_RETRY') >
          currentMs
        ) {
          throw new Exception(
            ErrorCode.Delay_Between_Retry_Required,
            ErrorMessage.Delay_Between_Retry_Required,
            `Delay between retry is ${
              this.configService.get('DELAY_BETWEEN_RETRY') / 1000
            } s, next time available from ${new Date(
              retryAtMs + this.configService.get('DELAY_BETWEEN_RETRY'),
            ).toISOString()}`,
          );
        }
      }

      await this.verificationCodeRepository.update(
        { id: codeObject.id },
        {
          retryCount: codeObject.retryCount + 1,
          code,
          retryAt: new Date(currentMs).toISOString(),
        },
      );
    }

    const expireAt = new Date(
      currentMs + this.configService.get('VERIFY_CODE_TTL'),
    ).toISOString();
    const expireRetry = new Date(
      currentMs + this.configService.get('CONFIG_RETRY_BLOCK'),
    ).toISOString();
    const useAt = new Date(currentMs).toISOString();

    if (!codeObject) {
      await this.verificationCodeRepository.save({
        phone,
        code,
        type,
        expireAt,
        expireRetry,
        useAt,
      });
    }

    return code;
  }

  async fetchRegisterCode(code: string) {
    const codeObject = await this.verificationCodeRepository.findOne({
      where: {
        code,
        status: VerificationCodeStatus.ACTIVE,
        expireAt: MoreThan(new Date().toISOString()),
      },
      select: ['id', 'code', 'phone'],
    });

    if (!codeObject) {
      throw new Exception(
        ErrorCode.Verification_Code_Invalid,
        ErrorMessage.Verification_Code_Invalid,
      );
    }

    await this.verificationCodeRepository.update(
      { id: codeObject.id },
      { status: VerificationCodeStatus.USED },
    );

    const registerToken = this.jwtAuthenticationService.generateRegisterToken({
      code,
      phone: codeObject.phone,
    });

    return { registerToken };
  }

  /**
   * Generate token & refresh token.
   */
  async generateToken(
    memberRepository: Repository<Member>,
    member: Member,
  ): Promise<{ token: string; refreshToken: string }> {
    const payload = { id: member.id, userType: UserType.CLIENT };

    const token = this.jwtAuthenticationService.generateAccessToken(payload);

    const isValid = this.jwtAuthenticationService.verifyRefreshToken(
      member.refreshToken,
    );
    if (!isValid) {
      const newRefreshToken =
        this.jwtAuthenticationService.generateRefreshToken(payload);

      await memberRepository.update(member.id, {
        refreshToken: newRefreshToken,
      });

      return { token, refreshToken: newRefreshToken };
    }

    return { token, refreshToken: member.refreshToken };
  }

  async login({ phone, code }: LoginDto) {
    return await this.dataSource.transaction(async (transaction) => {
      const verificationCodeRepository =
        transaction.getRepository(VerificationCode);
      const memberRepository = transaction.getRepository(Member);

      const member = await memberRepository.findOne({
        where: { phone },
        select: ['id', 'phone', 'status', 'refreshToken'],
      });
      if (!member) {
        throw new Exception(
          ErrorCode.Phone_Not_Exists,
          ErrorMessage.Phone_Not_Exists,
        );
      }

      const codeObject = await this.checkVerificationCode(
        verificationCodeRepository,
        phone,
        code,
        VerificationCodeType.LOGIN,
      );

      await verificationCodeRepository.update(codeObject.id, {
        status: VerificationCodeStatus.USED,
        useAt: new Date().toISOString(),
      });

      return this.generateToken(memberRepository, member);
    });
  }

  async register({ registerToken, ...params }: RegisterDto) {
    return await this.dataSource.transaction(async (transaction) => {
      const memberRepository = transaction.getRepository(Member);

      const payload =
        this.jwtAuthenticationService.verifyRegisterToken(registerToken);
      if (!payload) {
        throw new Exception(
          ErrorCode.Register_Token_Expired,
          ErrorMessage.Register_Token_Expired,
        );
      }

      if (payload.phone !== params.phone) {
        throw new Exception(
          ErrorCode.Register_Token_Expired,
          ErrorMessage.Register_Token_Expired,
        );
      }

      const member = await memberRepository.findOne({
        where: [{ phone: params.phone }],
        select: ['id', 'phone'],
      });

      if (member?.phone === params.phone) {
        throw new Exception(
          ErrorCode.Phone_Already_Exists,
          ErrorMessage.Phone_Already_Exists,
        );
      }

      const newMember = await memberRepository.save(params);

      return this.generateToken(memberRepository, newMember);
    });
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const payload =
      this.jwtAuthenticationService.verifyRefreshToken(refreshToken);
    if (!payload)
      throw new UnauthorizedException(
        'You have provided invalid refresh token',
      );

    const user = await this.memberRepository.findOne({
      where: { id: payload.id },
      select: ['id', 'refreshToken'],
    });

    if (refreshToken !== user.refreshToken)
      throw new UnauthorizedException(
        'Your refresh token changed, please login again',
      );

    const result = await this.generateToken(this.memberRepository, user);
    return result?.token;
  }
}
