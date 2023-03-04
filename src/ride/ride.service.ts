import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateRideRequestDto,
  CreateRideResponseDto,
} from './dto/create-ride.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { RideState } from '../constants/ride-state.enum';
import { RideManagementException } from '../shared/exception/ride-management-exception';
import { ExceptionMessage } from '../constants/exception.message';
import { ServiceResponseNotification } from '../shared/dto';
import {
  FinishRideRequestDto,
  FinishRideResponseDto,
} from './dto/finish-ride.dto';
import { WompiService } from '../shared/wampi/wompi.service';

@Injectable()
export class RideService {
  public readonly baseFee: number;
  public readonly baseKmFee: number;
  public readonly baseMinuteFee: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly wompiService: WompiService,
  ) {
    this.baseKmFee = this.configService.get<number>('base_ride_km_fee');
    this.baseMinuteFee = this.configService.get<number>('base_ride_minute_fee');
    this.baseFee = this.configService.get<number>('base_ride_fee');
  }

  async create(
    createRideDto: CreateRideRequestDto,
  ): Promise<CreateRideResponseDto> {
    const userId = '1213';
    const currentRideCount = await this.prisma.ride.count({
      where: {
        id: userId,
        state: RideState.STARTED,
      },
    });
    if (currentRideCount > 0) {
      throw new RideManagementException(
        new ServiceResponseNotification(
          HttpStatus.BAD_REQUEST,
          ExceptionMessage.CANNOT_HAVE_MULTIPLE_RIDES_AT_ONCE.message,
          ExceptionMessage.CANNOT_HAVE_MULTIPLE_RIDES_AT_ONCE.code,
        ),
      );
    }

    const nearestFreeDriverId = '123123';

    const createdRideEntity = await this.prisma.ride.create({
      data: {
        clientId: userId,
        driverId: nearestFreeDriverId,
        initialLatitude: createRideDto?.latitude,
        initialLongitude: createRideDto?.longitude,
      },
    });

    return new CreateRideResponseDto(
      createdRideEntity?.id,
      createdRideEntity?.driverId,
    );
  }

  async finishRide(
    rideId: string,
    finishRideDto: FinishRideRequestDto,
  ): Promise<FinishRideResponseDto> {
    const driverId = '';

    const currentRideEntity = await this.prisma.ride.findFirst({
      where: {
        id: rideId,
      },
    });

    if (!currentRideEntity) {
      throw new RideManagementException(
        new ServiceResponseNotification(
          HttpStatus.NOT_FOUND,
          ExceptionMessage.RIDE_DOES_NOT_EXIST.message,
          ExceptionMessage.RIDE_DOES_NOT_EXIST.code,
        ),
      );
    }

    if (currentRideEntity?.driverId !== driverId) {
      throw new RideManagementException(
        new ServiceResponseNotification(
          HttpStatus.BAD_REQUEST,
          ExceptionMessage.CANNOT_FINISH_NOT_OWNED_RIDE.message,
          ExceptionMessage.CANNOT_FINISH_NOT_OWNED_RIDE.code,
        ),
      );
    }

    if (currentRideEntity?.state === RideState.FINISHED) {
      throw new RideManagementException(
        new ServiceResponseNotification(
          HttpStatus.BAD_REQUEST,
          ExceptionMessage.CANNOT_FINISH_NOT_OWNED_RIDE.message,
          ExceptionMessage.CANNOT_FINISH_NOT_OWNED_RIDE.code,
        ),
      );
    }
    const costByKilometers =
      this.baseKmFee *
      this.calculateKilometersQuantity(
        Number(currentRideEntity?.initialLatitude),
        Number(currentRideEntity?.initialLongitude),
        finishRideDto?.finalLatitude,
        finishRideDto?.finalLongitude,
      );
    const costByMinutes = this.baseMinuteFee * finishRideDto?.elapsedMinutes;

    const totalAmount = [costByKilometers, costByMinutes, this.baseFee].reduce(
      (previous, current) => {
        return previous + current;
      },
      0,
    );

    const responseDto: FinishRideResponseDto = await this.prisma.$transaction(
      async (tx) => {
        const createdTransactionOnWompi =
          await this.wompiService.createTransaction();
        const updatedRideEntity = await this.prisma.ride.update({
          where: {
            id: currentRideEntity?.id,
          },
          data: {
            state: RideState.FINISHED,
            totalAmount,
            finalLatitude: finishRideDto?.finalLatitude,
            finalLongitude: finishRideDto?.finalLongitude,
            transactionId: createdTransactionOnWompi?.id,
            transactionReference: createdTransactionOnWompi?.reference,
          },
          select: {
            id: true,
            driverId: true,
          },
        });
        const rideChangeEntity = await this.prisma.rideChange.create({
          data: {
            rideId: currentRideEntity?.id,
            lastStatus: currentRideEntity?.state,
            newStatus: RideState.FINISHED,
          },
        });
        return new FinishRideResponseDto(
          updatedRideEntity?.id,
          updatedRideEntity?.driverId,
        );
      },
    );
    return responseDto;
  }

  private calculateKilometersQuantity(
    initialLat: number,
    initialLon: number,
    finalLat: number,
    finalLon: number,
  ) {
    return 0;
  }
}
