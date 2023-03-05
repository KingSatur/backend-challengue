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
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class RideService {
  public readonly baseFee: number;
  public readonly baseKmFee: number;
  public readonly baseMinuteFee: number;
  public readonly copToUsedFee: number;
  public readonly centsEquivalence: number = 100;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly wompiService: WompiService,
  ) {
    this.baseKmFee = this.configService.get<number>('base_ride_km_fee');
    this.baseMinuteFee = this.configService.get<number>('base_ride_minute_fee');
    this.baseFee = this.configService.get<number>('base_ride_fee');
    this.copToUsedFee = this.configService.get<number>(
      'cop_to_usd_equivalence',
    );
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
    const paymentsForCurrentUserCount = await this.prisma.paymentMethod.count({
      where: {
        userId,
      },
    });
    if (paymentsForCurrentUserCount < 1) {
      throw new RideManagementException(
        new ServiceResponseNotification(
          HttpStatus.BAD_REQUEST,
          ExceptionMessage.CANNOT_REQUEST_RIDE_WITHOUT_PAYMENT_METHOD_CREATED.message,
          ExceptionMessage.CANNOT_REQUEST_RIDE_WITHOUT_PAYMENT_METHOD_CREATED.code,
        ),
      );
    }

    const nearestFreeDriverId = await this.getNearestToUserDriver(userId);

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
      select: {
        id: true,
        driverId: true,
        clientId: true,
        state: true,
        initialLatitude: true,
        initialLongitude: true,
        client: {
          select: {
            lastName: true,
            name: true,
            address: true,
            phoneNumber: true,
            phonePrefix: true,
            email: true,
          },
        },
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

    const currentUserPaymentMethod = await this.getCurrentPaymentMethod(
      currentRideEntity?.clientId,
    );

    const responseDto: FinishRideResponseDto = await this.prisma.$transaction(
      async (tx) => {
        const createdTransactionOnWompi =
          await this.wompiService.createTransaction({
            address: currentRideEntity?.client?.address,
            amount: this.convertCurrency(totalAmount),
            email: currentRideEntity?.client?.email,
            fullName: `${currentRideEntity?.client?.name} ${currentRideEntity?.client?.lastName}`,
            paymentId: currentUserPaymentMethod?.wompiId,
            phoneNumber: `${currentRideEntity?.client?.phonePrefix}${currentRideEntity?.client?.phoneNumber}`,
          });
        const updatedRideEntity = await tx.ride.update({
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
        await tx.rideChange.create({
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

  private async getCurrentPaymentMethod(
    userId: string,
  ): Promise<PaymentMethod> {
    const currentUserPaymentMethod = await this.prisma.paymentMethod.findFirst({
      where: {
        preferred: true,
        userId,
      },
    });
    if (!currentUserPaymentMethod) {
      const firstPayment = await this.prisma.paymentMethod.findFirst({
        where: {
          userId,
        },
      });
      return firstPayment;
    }
    return currentUserPaymentMethod;
  }

  private convertCurrency(amount: number) {
    const dolarCurency = amount / this.copToUsedFee;
    return dolarCurency * this.centsEquivalence;
  }

  private async getNearestToUserDriver(userId: string): Promise<string> {
    const currentUserCity = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const driversInCity = await this.prisma.user.findMany({
      where: {
        city: currentUserCity.city,
      },
    });
    const driversDistance = driversInCity?.map((driver) => ({
      id: driver?.id,
      distance: this.calculateKilometersQuantity(
        Number(currentUserCity?.currentLatitude),
        Number(currentUserCity?.currentLongitude),
        Number(driver?.currentLatitude),
        Number(driver?.currentLongitude),
      ),
    }));
    const driverWithMinDistance = driversDistance.reduce(
      (previous, current) => {
        return current.distance <= previous.distance ? current : previous;
      },
    );

    return driverWithMinDistance?.id;
  }

  private calculateKilometersQuantity(
    initialLat: number,
    initialLon: number,
    finalLat: number,
    finalLon: number,
  ) {
    const R = 6371;
    const dLat = this.toRad(finalLat - initialLat);
    const dLon = this.toRad(finalLon - initialLon);
    const lat1 = this.toRad(initialLat);
    const lat2 = this.toRad(finalLat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = (R * c) / 1000.0;
    return d;
  }

  private toRad(value: number) {
    return (value * Math.PI) / 180;
  }
}
