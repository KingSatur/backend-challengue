import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { ServiceResponse, ServiceResponseNotification } from '../shared/dto';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { Role } from '../constants/role.enum';
import { HasRoles } from '../shared/decorators/has-roles.decorator';
import { RolesGuard } from '../shared/guard/role.guard';
import { JwtAuthGuard } from '../shared/guard/jwt.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/method')
  @HasRoles(Role.RIDER)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
