import { IsNumber, IsPositive, Min } from 'class-validator';

export class FinishRideRequestDto {
  @IsNumber()
  @IsPositive()
  @Min(0)
  elapsedMinutes: number;

  @IsNumber()
  finalLongitude: number;

  @IsNumber()
  finalLatitude: number;
}

export class FinishRideResponseDto {
  constructor(public rideId: string, public driverId: string) {}
}
