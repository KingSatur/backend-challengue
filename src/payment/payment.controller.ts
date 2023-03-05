import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { ServiceResponse, ServiceResponseNotification } from '../shared/dto';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/method')
  async create(
    @Body() createPaymentDto: CreatePaymentRequestDto,
  ): Promise<ServiceResponse<CreatePaymentResponseDto>> {
    return new ServiceResponse(
      true,
      new ServiceResponseNotification(null, null, null),
      await this.paymentService.createCardPaymentMethod(createPaymentDto),
    );
  }
}
