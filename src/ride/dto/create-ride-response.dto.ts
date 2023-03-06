import { ApiProperty } from '@nestjs/swagger';

export class CreateRideResponseDto {
  @ApiProperty({ description: 'Created ride id' })
  public readonly rideId: string;
  @ApiProperty({ description: 'driver id asociated with the ride' })
  public readonly driverId: string;
  @ApiProperty({ description: 'driver email asociated with the ride' })
  public readonly driverEmail: string;

  constructor(rideId: string, driverId: string, driverEmail: string) {
    this.rideId = rideId;
    this.driverId = driverId;
    this.driverEmail = driverEmail;
  }
}
