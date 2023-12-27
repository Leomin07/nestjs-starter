import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 6)
  code: string;
}
