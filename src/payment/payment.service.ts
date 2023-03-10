import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { RideManagementException } from '../shared/exception/ride-management-exception';
import { ServiceResponseNotification } from '../shared/dto';
import { ExceptionMessage } from '../constants/exception.message';
import { ConfigService } from '@nestjs/config';
import { WompiService } from '../shared/wompi/wompi.service';
import { CreatePaymentOnWompiResponseDto } from '../shared/wompi/dto/payment-dto';

@Injectable()
export class PaymentService {
  private readonly cardToken: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly wompiService: WompiService,
    private readonly configService: ConfigService,
  ) {
    this.cardToken = this.configService.get<string>('card_token');
  }

  async createCardPaymentMethod(
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createPaymentRequestDto: CreatePaymentRequestDto,
  ): Promise<CreatePaymentResponseDto> {
    const userEntity = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
      },
    });

    if (!userEntity) {
      throw new RideManagementException(
        new ServiceResponseNotification(
          HttpStatus.BAD_REQUEST,
          ExceptionMessage.USER_DOES_NOT_EXIST.message,
          ExceptionMessage.USER_DOES_NOT_EXIST.code,
        ),
      );
    }

    const paymentMethod: CreatePaymentOnWompiResponseDto =
      await this.wompiService.createPaymentMethod(userEntity?.email);

    await this.prisma.paymentMethod.create({
      data: {
        preferred: true,
        wompiId: paymentMethod?.data?.id,
        userId,
        token: paymentMethod?.data?.token,
      },
    });

    return new CreatePaymentResponseDto(
      paymentMethod?.data?.id,
      paymentMethod?.data?.status,
    );
  }
}
