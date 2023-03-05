import { Controller, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { RideService } from './ride.service';
import {
  CreateRideRequestDto,
  CreateRideResponseDto,
} from './dto/create-ride.dto';
import {
  FinishRideRequestDto,
  FinishRideResponseDto,
} from './dto/finish-ride.dto';
import { ServiceResponse, ServiceResponseNotification } from '../shared/dto';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from '../shared/decorators/has-roles.decorator';
import { Role } from '../constants/role.enum';
import { JwtAuthGuard } from '../shared/guard/jwt.guard';
import { RolesGuard } from '../shared/guard/role.guard';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  @HasRoles(Role.RIDER)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseGuards(AuthGuard('jwt'))
  @HasRoles(Role.DRIVER)
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
