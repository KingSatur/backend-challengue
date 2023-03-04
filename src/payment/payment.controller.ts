import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ServiceResponse, ServiceResponseNotification } from '../shared/dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/method')
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<ServiceResponse<string>> {
    return new ServiceResponse(
      true,
      new ServiceResponseNotification(null, null, null),
      await this.paymentService.create(createPaymentDto),
    );
  }
}
