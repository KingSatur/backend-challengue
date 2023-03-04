import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { RideService } from './ride.service';
import {
  CreateRideRequestDto,
  CreateRideResponseDto,
} from './dto/create-ride.dto';
import {
  FinishRideRequestDto,
  FinishRideResponseDto,
} from './dto/finish-ride.dto';
import { ServiceResponse, ServiceResponseNotification } from 'src/shared/dto';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  async create(
    @Body() createRideDto: CreateRideRequestDto,
  ): Promise<ServiceResponse<CreateRideResponseDto>> {
    return new ServiceResponse(
      true,
      new ServiceResponseNotification(null, null, null),
      await this.rideService.create(createRideDto),
    );
  }

  @Put(':id')
  async finishRide(
    @Param('id') rideId: string,
    @Body() finishRideDto: FinishRideRequestDto,
  ): Promise<ServiceResponse<FinishRideResponseDto>> {
    return new ServiceResponse(
      true,
      new ServiceResponseNotification(null, null, null),
      await this.rideService.finishRide(rideId, finishRideDto),
    );
  }
}
