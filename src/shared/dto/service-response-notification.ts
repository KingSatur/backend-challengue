import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponseNotification {
  @ApiProperty()
  public readonly status: number;
  @ApiProperty()
  public readonly message: string;
  @ApiProperty()
  public readonly code: string;

  constructor(status: number, message: string, code: string) {
    this.status = status;
    this.message = message;
    this.code = code;
  }
}
