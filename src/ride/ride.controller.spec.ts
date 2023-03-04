import { Test, TestingModule } from '@nestjs/testing';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

describe('RideController', () => {
  let controller: RideController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [RideService],
      imports: [
        ConfigModule.forRoot({
          load: [],
          isGlobal: true,
        }),
        PrismaModule,
      ],
    }).compile();

    controller = module.get<RideController>(RideController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
