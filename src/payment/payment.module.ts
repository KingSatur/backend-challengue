import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [PrismaModule, SharedModule],
})
export class PaymentModule {}
