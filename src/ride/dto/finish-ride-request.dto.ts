import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class FinishRideRequestDto {
  @IsNumber()
  @IsPositive()
  @Min(0)
  @ApiProperty({
    description: 'Time taken by the ride',
    required: true,
    example: 20,
  })
  elapsedMinutes: number;

  @IsNumber()
  @ApiProperty({
    description: 'Final ride longitude',
    required: true,
    example: -88.872,
  })
  finalLongitude: number;

  @IsNumber()
  @ApiProperty({
    description: 'Final ride latitude',
    required: true,
    example: 5.2049,
  })
  finalLatitude: number;
}
