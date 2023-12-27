import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { VerificationCodeType } from 'src/helpers/enum';

export class RequestVerificationCodeDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 20)
  phone: string;

  @IsNotEmpty()
  @IsEnum(VerificationCodeType)
  type: VerificationCodeType;

  @IsOptional()
  @IsString()
  @Length(0, 6)
  changePhoneCode?: string;
}
