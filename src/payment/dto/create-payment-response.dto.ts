import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentResponseDto {
  @ApiProperty({ description: 'Created payment id' })
  public readonly id: string;

  @ApiProperty({ description: 'Created payment status' })
  public readonly status: string;

  constructor(id: string, status: string) {
    this.id = id;
    this.status = status;
  }
}
