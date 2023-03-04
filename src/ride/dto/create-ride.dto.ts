import { IsNumber } from 'class-validator';

export class CreateRideRequestDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class CreateRideResponseDto {
  constructor(public rideId: string, public driverId: string) {}
}
