import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Properties } from './config/properties.config';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentModule } from './payment/payment.module';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      load: [Properties],
      isGlobal: true,
    }),
    PaymentModule,
    RideModule,
  ],
})
export class AppModule {}
