import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from 'src/helpers/enum';

export class RegisterDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(0, 6)
  code?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(0, 20)
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(0, 255)
  registerToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(0, 255)
  name: string;

  @ApiProperty({ enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  birthday: string;
}
