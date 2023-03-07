import { Test, TestingModule } from '@nestjs/testing';
import { RideService } from './ride.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WompiService } from '../shared/wompi/wompi.service';
import { PrismaService } from '../prisma/prisma.service';
import { RideManagementException } from '../shared/exception/ride-management-exception';
import { ExceptionMessage } from '../constants/exception.message';
import { faker } from '@faker-js/faker';

const configValues = {
  environment: 'local',
  base_ride_fee: 3500,
  base_ride_km_fee: 1000,
  base_ride_minute_fee: 200,
  wampi_url: 'https://sandbox.wompi.co/v1',
  currency_code: 'COP',
  venture_reference: '0-1i2okmJNH192u9-0lmk',
  country_code: 'CO',
  card_token: '',
  venture_public_key: '',
  venture_private_key: '',
  cop_to_usd_equivalence: 0.00021,
};

const mockPrisma = {
  user: { findUnique: () => {}, findMany: () => {} },
  ride: { count: () => {}, create: jest.fn(), update: jest.fn() },
  paymentMethod: { count: () => {}, create: jest.fn() },
  rideChange: { count: () => {}, create: jest.fn() },
};

describe('RideService', () => {
  let service: RideService;
  let wompiService: WompiService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [],
          isGlobal: true,
        }),
      ],
      providers: [
        RideService,
        {
          provide: WompiService,
          useValue: {
            getAcceptanceToken: jest.fn(() => {}),
            createPaymentMethod: jest.fn(() => {}),
            createTransaction: jest.fn(() => {}),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(
              (key: string, defaultValue: string) =>
                configValues[key] || defaultValue,
            ),
          },
        },
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<RideService>(RideService);
    wompiService = module.get<WompiService>(WompiService);
    prisma = module.get(PrismaService);
    prisma.$transaction = jest
      .fn()
      .mockImplementation((callback) => callback(prisma));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create ride', () => {
    it('should not create ride when exist another ride on STARTED state', async () => {
      prisma.ride.count = jest.fn().mockReturnValue(1);
      try {
        await service.create('userId', {
          latitude: -0.1231234132,
          longitude: 1.29319043,
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(RideManagementException);
        expect(error?.notification?.status).toBe(400);
        expect(error?.notification?.message).toBe(
          ExceptionMessage.CANNOT_HAVE_MULTIPLE_RIDES_AT_ONCE.message,
        );
        expect(error?.notification?.code).toBe(
          ExceptionMessage.CANNOT_HAVE_MULTIPLE_RIDES_AT_ONCE.code,
        );
      }
    });
    it('should not create ride when user does not have payment method', async () => {
      prisma.ride.count = jest.fn().mockReturnValue(0);
      prisma.user.findUnique = jest.fn().mockReturnValue({
        currentLatitude: -0.1231234132,
        currentLongitude: 1.29319043,
        city: 'Nebraska',
      });
      prisma.user.findMany = jest.fn().mockReturnValue([
        {
          currentLatitude: 1.29319043,
          currentLongitude: -0.1231234132,
          city: 'Nebraska',
        },
        {
          currentLatitude: '',
          currentLongitude: '',
          city: 'Vancouver',
        },
      ]);
      prisma.paymentMethod.count = jest.fn().mockReturnValue(0);
      try {
        await service.create('userId', {
          latitude: -0.1231234132,
          longitude: 1.29319043,
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(RideManagementException);
        expect(error?.notification?.status).toBe(400);
        expect(error?.notification?.message).toBe(
          ExceptionMessage.CANNOT_REQUEST_RIDE_WITHOUT_PAYMENT_METHOD_CREATED
            .message,
        );
        expect(error?.notification?.code).toBe(
          ExceptionMessage.CANNOT_REQUEST_RIDE_WITHOUT_PAYMENT_METHOD_CREATED
            .code,
        );
      }
    });
    it('should create ride', async () => {
      prisma.ride.count = jest.fn().mockReturnValue(0);
      prisma.user.findUnique = jest.fn().mockReturnValue({
        currentLatitude: -0.1231234132,
        currentLongitude: 1.29319043,
        city: 'Nebraska',
      });
      prisma.user.findMany = jest.fn().mockReturnValue([
        {
          id: 'd6348943-e41a-4d76-a3e4-3cb2447d9a65',
          currentLatitude: 1.29319043,
          currentLongitude: -0.1231234132,
          city: 'Nebraska',
        },
        {
          id: 'd6348943-e85a-4d76-a3e4-3cb2447d9a65',
          currentLatitude: 1.29319043,
          currentLongitude: -0.1231234132,
          city: 'Vancouver',
        },
      ]);
      prisma.paymentMethod.count = jest.fn().mockReturnValue(1);
      prisma.ride.create = jest.fn().mockReturnValue({
        id: 'd6348943-e45a-4d76-a3e4-3cb2447d9a65',
        driverId: 'd6148942-e45a-4d76-a3e4-3cb2447d9a64',
      });
      const serviceResponse = await service.create('userId', {
        latitude: -0.1231234132,
        longitude: 1.29319043,
      });

      expect(serviceResponse).toBeDefined();
      expect(serviceResponse?.rideId).toBeDefined();
      expect(serviceResponse?.rideId).toEqual(
        'd6348943-e45a-4d76-a3e4-3cb2447d9a65',
      );
      expect(serviceResponse?.driverId).toBeDefined();
      expect(serviceResponse?.driverId).toEqual(
        'd6148942-e45a-4d76-a3e4-3cb2447d9a64',
      );
      expect(prisma.ride.create).toHaveBeenCalledWith({
        data: {
          clientId: 'userId',
          driverId: 'd6348943-e41a-4d76-a3e4-3cb2447d9a65',
          initialLatitude: -0.1231234132,
          initialLongitude: 1.29319043,
        },
        include: {
          driver: {
            select: {
              email: true,
            },
          },
        },
      });
    });
  });

  describe('Finish ride', () => {
    it('Should not finish ride if does not exist', async () => {
      try {
        prisma.ride.findFirst = jest.fn().mockReturnValue(null);
        await service.finishRide(
          'd6348943-e41a-4d76-a3e4-3cb2447d9a65',
          'd6348943-e41a-4d76-a3e4-3cb2447d9a25',
          {
            elapsedMinutes: 20,
            finalLatitude: -0.1231234132,
            finalLongitude: 1.29319043,
          },
        );
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(RideManagementException);
        expect(error?.notification?.status).toBe(404);
        expect(error?.notification?.message).toBe(
          ExceptionMessage.RIDE_DOES_NOT_EXIST.message,
        );
        expect(error?.notification?.code).toBe(
          ExceptionMessage.RIDE_DOES_NOT_EXIST.code,
        );
      }
    });
    it('Should not finish ride driverId does not match with the provided with guards', async () => {
      try {
        prisma.ride.findFirst = jest.fn().mockReturnValue({
          driverId: 'd6348943-e41a-4d76-a3e4-3cb2447d9a69',
        });
        await service.finishRide(
          'd6348943-e41a-4d76-a3e4-3cb2447d9a65',
          'd6348943-e41a-4d76-a3e4-3cb2447d9a25',
          {
            elapsedMinutes: 20,
            finalLatitude: -0.1231234132,
            finalLongitude: 1.29319043,
          },
        );
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(RideManagementException);
        expect(error?.notification?.status).toBe(400);
        expect(error?.notification?.message).toBe(
          ExceptionMessage.CANNOT_FINISH_NOT_OWNED_RIDE.message,
        );
        expect(error?.notification?.code).toBe(
          ExceptionMessage.CANNOT_FINISH_NOT_OWNED_RIDE.code,
        );
      }
    });
    it('Should not finish already finished ride', async () => {
      try {
        prisma.ride.findFirst = jest.fn().mockReturnValue({
          driverId: 'd6348943-e41a-4d76-a3e4-3cb2447d9a65',
          state: 'FINISHED',
        });
        await service.finishRide(
          'd6348943-e41a-4d76-a3e4-3cb2447d9a65',
          'd6348943-e41a-4d76-a3e4-3cb2447d9a25',
          {
            elapsedMinutes: 20,
            finalLatitude: -0.1231234132,
            finalLongitude: 1.29319043,
          },
        );
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(RideManagementException);
        expect(error?.notification?.status).toBe(400);
        expect(error?.notification?.message).toBe(
          ExceptionMessage.CANNOT_FINISH_ALREADY_FINISH_RIDE.message,
        );
        expect(error?.notification?.code).toBe(
          ExceptionMessage.CANNOT_FINISH_ALREADY_FINISH_RIDE.code,
        );
      }
    });
    it('Should finish a current ride', async () => {
      const name = faker.name.firstName();
      const lastName = faker.name.lastName();
      const phone = faker.phone.number('##########');
      const email = faker.internet.email();
      prisma.ride.findFirst = jest.fn().mockReturnValue({
        id: 'd6348913-e21a-4d71-a3e4-3cb2447d9a65',
        driverId: 'd6348943-e41a-4d76-a3e4-3cb2447d9a65',
        state: 'STARTED',
        initialLatitude: -0.1231234132,
        initialLongitude: 1.29319043,
        client: {
          address: 'Cl 30 # 9',
          email,
          name,
          lastName,
          phonePrefix: '57',
          phoneNumber: phone,
          city: 'Bogotá',
          state: 'Bogotá',
        },
      });
      wompiService.createTransaction = jest.fn().mockReturnValue({
        data: {
          id: 'd6348919-e41a-4d76-a3e4-3cb2447d9a65',
          reference: 'to123k_a2310_32326B334c47Ec49a516bf1785247ba2',
        },
      });

      prisma.ride.update = jest.fn().mockReturnValue({
        id: 'd6348913-e21a-4d71-a3e4-3cb2447d9a65',
        driverId: 'd6348943-e41a-4d76-a3e4-3cb2447d9a65',
      });
      prisma.paymentMethod.findFirst = jest.fn().mockReturnValue({
        wompiId: 'd6178943-e41a-4d76-a3e4-3cb2447d9a65',
      });
      const serviceResponse = await service.finishRide(
        'd6348943-e41a-4d76-a3e4-3cb2447d9a65',
        'd6348943-e41a-4d76-a3e4-3cb2447d9a25',
        {
          elapsedMinutes: 20,
          finalLatitude: -0.1231234132,
          finalLongitude: 1.29319043,
        },
      );

      expect(wompiService.createTransaction).toHaveBeenCalledWith({
        address: 'Cl 30 # 9',
        amount: 158,
        email,
        fullName: `${name} ${lastName}`,
        paymentId: 'd6178943-e41a-4d76-a3e4-3cb2447d9a65',
        phoneNumber: `57${phone}`,
        city: 'Bogotá',
        state: 'Bogotá',
      });
      expect(prisma.rideChange.create).toHaveBeenCalledWith({
        data: {
          rideId: 'd6348913-e21a-4d71-a3e4-3cb2447d9a65',
          lastStatus: 'STARTED',
          newStatus: 'FINISHED',
        },
      });
      expect(prisma.ride.update).toHaveBeenCalledWith({
        where: {
          id: 'd6348913-e21a-4d71-a3e4-3cb2447d9a65',
        },
        data: {
          state: 'FINISHED',
          totalAmount: 158,
          finalLatitude: -0.1231234132,
          finalLongitude: 1.29319043,
          transactionId: 'd6348919-e41a-4d76-a3e4-3cb2447d9a65',
          transactionReference: 'to123k_a2310_32326B334c47Ec49a516bf1785247ba2',
          elapsedMinutes: 20,
        },
        select: {
          id: true,
          driverId: true,
        },
      });
      expect(serviceResponse).toBeDefined();
      expect(serviceResponse.driverId).toBeDefined();
      expect(serviceResponse.driverId).toEqual(
        'd6348943-e41a-4d76-a3e4-3cb2447d9a65',
      );
      expect(serviceResponse.rideId).toBeDefined();
      expect(serviceResponse.rideId).toEqual(
        'd6348913-e21a-4d71-a3e4-3cb2447d9a65',
      );
    });
  });
});
