import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Properties } from './config/properties.config';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentModule } from './payment/payment.module';
import { RideModule } from './ride/ride.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filter/excepion.handler';

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
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
