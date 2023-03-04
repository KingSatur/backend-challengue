import { IsNumber } from 'class-validator';

export class CreateRideDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
