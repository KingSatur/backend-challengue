import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'Token created with user credentials' })
  public token: string;

  constructor(token: string) {
    this.token = token;
  }
}
