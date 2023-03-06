import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  HttpStatus,
  Request,
  HttpCode,
} from '@nestjs/common';
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
import { HasRoles } from '../shared/decorators/has-roles.decorator';
import { Role } from '../constants/role.enum';
import { JwtAuthGuard } from '../shared/guard/jwt.guard';
import { RolesGuard } from '../shared/guard/role.guard';
import { OperationMessage } from '../constants/exception.message';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  @HttpCode(200)
  @HasRoles(Role.RIDER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Request() request,
    @Body() createRideDto: CreateRideRequestDto,
  ): Promise<ServiceResponse<CreateRideResponseDto>> {
    return new ServiceResponse(
      true,
      new ServiceResponseNotification(
        HttpStatus.OK,
        OperationMessage.RIDE_WAS_CREATED.message,
        OperationMessage.RIDE_WAS_CREATED.code,
      ),
      await this.rideService.create(request?.user?.userId, createRideDto),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.DRIVER)
  async finishRide(
    @Request() request,
    @Param('id') rideId: string,
    @Body() finishRideDto: FinishRideRequestDto,
  ): Promise<ServiceResponse<FinishRideResponseDto>> {
    return new ServiceResponse(
      true,
      new ServiceResponseNotification(
        HttpStatus.OK,
        OperationMessage.RIDE_WAS_FINISHED.message,
        OperationMessage.RIDE_WAS_FINISHED.code,
      ),
      await this.rideService.finishRide(
        request?.user?.userId,
        rideId,
        finishRideDto,
      ),
    );
  }
}
