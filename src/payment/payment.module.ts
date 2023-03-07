import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [PrismaModule, SharedModule],
})
export class PaymentModule {}
