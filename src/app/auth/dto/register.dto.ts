import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from 'src/helpers/enum';

export class RegisterDto {
  @IsOptional()
  @IsString()
  @Length(0, 6)
  code?: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 20)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 255)
  registerToken: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 255)
  name: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  birthday: string;
}
