import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { ServiceResponse, ServiceResponseNotification } from '../shared/dto';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { Role } from '../constants/role.enum';
import { HasRoles } from '../shared/decorators/has-roles.decorator';
import { RolesGuard } from '../shared/guard/role.guard';
import { JwtAuthGuard } from '../shared/guard/jwt.guard';
import { OperationMessage } from '../constants/exception.message';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/method')
  @HasRoles(Role.RIDER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Request() request,
    @Body() createPaymentDto: CreatePaymentRequestDto,
  ): Promise<ServiceResponse<CreatePaymentResponseDto>> {
    return new ServiceResponse(
      true,
      new ServiceResponseNotification(
        HttpStatus.CREATED,
        OperationMessage.PAYMENT_WAS_CREATED.message,
        OperationMessage.PAYMENT_WAS_CREATED.code,
      ),
      await this.paymentService.createCardPaymentMethod(
        request?.user?.userId,
        createPaymentDto,
      ),
    );
  }
}
