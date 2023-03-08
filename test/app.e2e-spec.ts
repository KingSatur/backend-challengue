import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as pactum from 'pactum';
import { faker } from '@faker-js/faker';
import { AppModule } from './../src/app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/shared/guard/jwt.guard';
import { WompiService } from '../src/shared/wompi/wompi.service';

const configValues = {
  environment: 'local',
  database_url: 'database_url',
  context_path: 'rides-api',
  port: 4501,
  base_ride_fee: 3500,
  base_ride_km_fee: 1000,
  base_ride_minute_fee: 200,
  wompi_url: 'https://sandbox.wompi.co/v1',
  currency_code: 'COP',
  venture_reference: '0-1i2okmJNH192u9-0lmk',
  country_code: 'CO',
  card_token: 'pub_prod_Kw4aC0rZVgLZQn209NbEKPuXLzBD28Zx',
  venture_public_key: 'pub_prod_Kw4aC0rZVgLZQn209NbEKPuXLzBD28Zx',
  venture_private_key: 'prv_prod_434092Xa65F54dd6a181D1f87DFa03CzS',
  cop_to_usd_equivalence: 0.00021,
  jwt_secret: '01ALHIU80D:<>"~!j_)()"',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let prisma: PrismaService;
  let wompiService: WompiService;

  const mockPrisma = {
    user: { findUnique: () => {}, findMany: () => {} },
    ride: { count: () => {}, create: jest.fn(), update: jest.fn() },
    paymentMethod: { count: () => {}, create: jest.fn() },
    rideChange: { count: () => {}, create: jest.fn() },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { userId: 'd6178943-e41a-4d76-a3e4-3cb2447d9a65' };
          return true;
        },
      })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn(
          (key: string, defaultValue: string) =>
            configValues[key] || defaultValue,
        ),
      })
      .overrideProvider(WompiService)
      .useValue({
        getAcceptanceToken: jest.fn(() => {}),
        createPaymentMethod: jest.fn(() => {}),
        createTransaction: jest.fn(() => {}),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    configService = moduleFixture.get<ConfigService>(ConfigService);
    app.setGlobalPrefix(configService.get('context_path'));
    await app.init();
    await app.listen(configService.get('port'));
    pactum.request.setBaseUrl(
      `http://localhost:${configService.get('port')}/${configService.get(
        'context_path',
      )}`,
    );
    wompiService = moduleFixture.get<WompiService>(WompiService);
    prisma = moduleFixture.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Payment', () => {
    it('POST /payment, should create payment method', async () => {
      prisma.user.findUnique = jest.fn().mockReturnValue({
        email: 'sample@mail.com',
        role: 'RIDER',
      });

      wompiService.createPaymentMethod = jest.fn().mockReturnValue({
        data: {
          id: 543,
          token: 'tok_prod_280_32326B334c47Ec49a516bf1785247ba2',
          status: 'AVAILABLE',
        },
      });

      return pactum
        .spec()
        .post('/payment/method')
        .withHeaders({
          Authorization: 'Bearer 123123123123',
        })
        .withBody({})
        .expectStatus(201);
    });
  });

  describe('Rides', () => {
    it('POST /payment, should request for ride', () => {
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
      prisma.user.findUnique = jest.fn().mockReturnValue({
        email: 'sample@mail.com',
        role: 'RIDER',
      });

      wompiService.createTransaction = jest.fn().mockReturnValue({
        data: {
          id: 'd6348919-e41a-4d76-a3e4-3cb2447d9a65',
          reference: 'to123k_a2310_32326B334c47Ec49a516bf1785247ba2',
        },
      });
      return pactum
        .spec()
        .post('/ride/')
        .withHeaders({
          Authorization: 'Bearer 123123123123',
        })
        .withBody({
          latitude: '35.6502',
          longitude: '-42.7640',
        })
        .expectStatus(200)
        .expectBodyContains('data')
        .expectBodyContains('rideId')
        .expectBodyContains('driverId')
        .expectBodyContains('notification')
        .expectBodyContains('status')
        .expectBodyContains('message')
        .expectBodyContains('code')
        .expectBodyContains('success');
    });
    it('POST /ride, should finish a ride', () => {
      prisma.user.findUnique = jest.fn().mockReturnValue({
        email: 'sample@mail.com',
        role: 'DRIVER',
      });
      prisma.$transaction = jest
        .fn()
        .mockImplementation((callback) => callback(prisma));
      const name = faker.name.firstName();
      const lastName = faker.name.lastName();
      const phone = faker.phone.number('##########');
      const email = faker.internet.email();
      prisma.ride.findFirst = jest.fn().mockReturnValue({
        id: 'd6348913-e21a-4d71-a3e4-3cb2447d9a65',
        driverId: 'd6178943-e41a-4d76-a3e4-3cb2447d9a65',
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
      return pactum
        .spec()
        .put('/ride/528676e0-8933-4847-8961-67fa6dcf25e7')
        .withHeaders({
          Authorization: 'Bearer 123123123123',
        })
        .withBody({
          elapsedMinutes: 20,
          finalLongitude: '35.6502',
          finalLatitude: '-42.7640',
        })
        .expectStatus(200)
        .expectBodyContains('data')
        .expectBodyContains('rideId')
        .expectBodyContains('driverId')
        .expectBodyContains('notification')
        .expectBodyContains('status')
        .expectBodyContains('message')
        .expectBodyContains('code')
        .expectBodyContains('success');
    });
  });

  describe('Login', () => {
    it('POST /auth/login, should return token for credentials', () => {
      prisma.user.findUnique = jest.fn().mockReturnValue({
        email: 'sample@mail.com',
        role: 'DRIVER',
        password:
          '$2b$10$DceOg1buScfejEJqBiI.SefcrEQC9XYHbLJGChZRH/auTHvZlk11C',
      });
      wompiService.createTransaction = jest.fn().mockReturnValue({
        data: {
          id: 'd6348919-e41a-4d76-a3e4-3cb2447d9a65',
          reference: 'to123k_a2310_32326B334c47Ec49a516bf1785247ba2',
        },
      });

      return pactum
        .spec()
        .post('/auth/login')
        .withBody({
          email: 'Hildegard96@hotmail.com',
          password: 'driverPassword',
        })
        .expectStatus(200)
        .expectBodyContains('token');
    });
    it('POST /auth/login, should return 401 for invalid credentials', () => {
      prisma.user.findUnique = jest.fn().mockReturnValue({
        email: 'sample@mail.com',
        role: 'DRIVER',
        password:
          '$2b$10$DceOg1buScfejEJqBiI.SefcrEQC9XYHbLJGChZRH/auTHvZlk11C',
      });
      wompiService.createTransaction = jest.fn().mockReturnValue({
        data: {
          id: 'd6348919-e41a-4d76-a3e4-3cb2447d9a65',
          reference: 'to123k_a2310_32326B334c47Ec49a516bf1785247ba2',
        },
      });

      return pactum
        .spec()
        .post('/auth/login')
        .withBody({
          email: 'Hildegard96@hotmail.com',
          password: 'drive232rPassword',
        })
        .expectStatus(401)
        .expectBodyContains('notification');
    });
  });
});
