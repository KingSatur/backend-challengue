import { ApiProperty } from '@nestjs/swagger';

export class FinishRideResponseDto {
  @ApiProperty({
    description: 'Ride database id',
    example: 'a6a851cc-7176-41fc-97e6-eb7056c87192',
  })
  public readonly rideId: string;
  @ApiProperty({
    description: 'Driver database id related with the ride',
    example: 'a6a851cc-7176-41fc-97e6-e09056c87193',
  })
  public readonly driverId: string;

  constructor(rideId: string, driverId: string) {
    this.rideId = rideId;
    this.driverId = driverId;
  }
}
