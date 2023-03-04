import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [RideController],
  providers: [RideService],
  imports: [PrismaModule, SharedModule],
})
export class RideModule {}
