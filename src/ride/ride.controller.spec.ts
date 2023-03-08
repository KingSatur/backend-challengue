import { Test, TestingModule } from '@nestjs/testing';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { ConfigModule } from '@nestjs/config';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  user: { findUnique: () => {} },
  paymentMethod: { count: () => {}, create: jest.fn() },
};

describe('RideController', () => {
  let controller: RideController;
  const rideService: DeepMockProxy<RideService> = mockDeep<RideService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [
        {
          provide: RideService,
          useValue: rideService,
        },
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
      imports: [
        ConfigModule.forRoot({
          load: [],
          isGlobal: true,
        }),
      ],
    }).compile();

    controller = module.get<RideController>(RideController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should call rideService create when create is consumed', async () => {
    rideService.create.mockReturnValue(
      Promise.resolve({
        rideId: 'e7d0e2be-e0db-4184-8c4e-5db7365f8a92',
        driverId: 'e9a0e2be-e0db-4184-8c4e-5db7365f8a92',
        driverEmail: 'sample@mail.com',
      }),
    );

    const body = {
      latitude: -123123,
      longitude: -123123123,
    };
    const resp = await controller.create({ user: { userId: '123123' } }, body);
    expect(rideService.create).toHaveBeenCalledWith('123123', body);
    expect(resp).toBeDefined();
    expect(resp.data).toBeDefined();
    expect(resp.data.driverEmail).toEqual('sample@mail.com');
    expect(resp.data.driverId).toEqual('e9a0e2be-e0db-4184-8c4e-5db7365f8a92');
    expect(resp.data.rideId).toEqual('e7d0e2be-e0db-4184-8c4e-5db7365f8a92');
    expect(resp.notification).toBeDefined();
    expect(resp.notification.code).toEqual('RIDE_WAS_CREATED');
    expect(resp.notification.message).toEqual('Ride was created for user');
    expect(resp.notification.status).toEqual(200);
    expect(resp.success).toBeTruthy();
  });

  it('Should call rideService finish to finish ride', async () => {
    rideService.finishRide.mockReturnValue(
      Promise.resolve({
        rideId: 'e7d0e2be-e0db-4184-8c4e-5db7365f8a92',
        driverId: 'e9a0e2be-e0db-4184-8c4e-5db7365f8a92',
      }),
    );

    const body = {
      elapsedMinutes: 20,
      finalLongitude: -123123123,
      finalLatitude: -123123123,
    };
    const resp = await controller.finishRide(
      { user: { userId: 'p7d0e2be-30db-1184-8l4e-5db7365f8a92' } },
      'e7d0e2be-e0db-1184-8l4e-5db7365f8a92',
      body,
    );
    expect(rideService.finishRide).toHaveBeenCalledWith(
      'p7d0e2be-30db-1184-8l4e-5db7365f8a92',
      'e7d0e2be-e0db-1184-8l4e-5db7365f8a92',
      body,
    );
    expect(resp).toBeDefined();
    expect(resp.data).toBeDefined();
    expect(resp.data.driverId).toEqual('e9a0e2be-e0db-4184-8c4e-5db7365f8a92');
    expect(resp.data.rideId).toEqual('e7d0e2be-e0db-4184-8c4e-5db7365f8a92');
    expect(resp.notification).toBeDefined();
    expect(resp.notification.code).toEqual('RIDE_WAS_FINISHED');
    expect(resp.notification.message).toEqual('Ride was finished');
    expect(resp.notification.status).toEqual(200);
    expect(resp.success).toBeTruthy();
  });
});
