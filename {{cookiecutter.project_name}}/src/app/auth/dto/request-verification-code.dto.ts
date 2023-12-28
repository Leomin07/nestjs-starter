import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { VerificationCodeType } from 'src/helpers/enum';

export class RequestVerificationCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(0, 20)
  phone: string;

  @ApiProperty({ enum: VerificationCodeType })
  @IsNotEmpty()
  @IsEnum(VerificationCodeType)
  type: VerificationCodeType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(0, 6)
  changePhoneCode?: string;
}
