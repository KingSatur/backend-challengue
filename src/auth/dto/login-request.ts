import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  @ApiProperty({ description: 'User email', required: true })
  email: string;

  @IsString()
  @ApiProperty({ description: 'User password', required: true })
  password: string;
}
