import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateRideRequestDto {
  @IsNumber()
  @ApiProperty({
    description: 'Current rider latitude',
    required: true,
    example: -88.872,
  })
  latitude: number;

  @IsNumber()
  @ApiProperty({
    description: 'Current rider longitude',
    required: true,
    example: 5.2049,
  })
  longitude: number;
}
