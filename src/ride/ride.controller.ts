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
import { CreateRideRequestDto } from './dto/create-ride-request.dto';
import { FinishRideRequestDto } from './dto/finish-ride-request.dto';
import { ServiceResponse, ServiceResponseNotification } from '../shared/dto';
import { HasRoles } from '../shared/decorators/has-roles.decorator';
import { Role } from '../constants/role.enum';
import { JwtAuthGuard } from '../shared/guard/jwt.guard';
import { RolesGuard } from '../shared/guard/role.guard';
import {
  ExceptionMessage,
  OperationMessage,
} from '../constants/exception.message';
import { CreateRideResponseDto } from './dto/create-ride-response.dto';
import { OpenApiSpecRideSystemResponse } from '../shared/decorators/open-api-decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FinishRideResponseDto } from './dto/finish-ride-response.dto';
import { SAMPLE } from '../shared/swagger/sample';

@Controller('ride')
@ApiTags('ride')
@ApiBearerAuth('Authorization')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  @HttpCode(200)
  @HasRoles(Role.RIDER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @OpenApiSpecRideSystemResponse({
    model: CreateRideResponseDto,
    authRequired: true,
  })
  @ApiOperation({
    summary:
      'Creates a ride for a client with the nearest driver to the client',
  })
  @ApiResponse({
    status: 400,
    description:
      ExceptionMessage.CANNOT_REQUEST_RIDE_WITHOUT_PAYMENT_METHOD_CREATED
        .message,
    schema: {
      example: SAMPLE['CANNOT_REQUEST_RIDE_WITHOUT_PAYMENT_METHOD_CREATED'],
    },
  })
  @ApiResponse({
    status: 400,
    description: ExceptionMessage.CANNOT_HAVE_MULTIPLE_RIDES_AT_ONCE.message,
    schema: {
      example: SAMPLE['CANNOT_HAVE_MULTIPLE_RIDES_AT_ONCE'],
    },
  })
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
  @OpenApiSpecRideSystemResponse({
    model: FinishRideResponseDto,
    authRequired: true,
  })
  @ApiParam({ name: 'id', required: true, description: 'Ride id to finish' })
  @ApiOperation({
    summary: 'Finish a ride by its database id.',
  })
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
