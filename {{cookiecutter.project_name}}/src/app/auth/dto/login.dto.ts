import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(0, 20)
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(0, 6)
  code: string;
}
