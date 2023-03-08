import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

const configValues = {
  environment: 'local',
  base_ride_fee: 3500,
  base_ride_km_fee: 1000,
  base_ride_minute_fee: 200,
  wompi_url: 'https://sandbox.wompi.co/v1',
  currency_code: 'COP',
  venture_reference: '0-1i2okmJNH192u9-0lmk',
  country_code: 'CO',
  card_token: '',
  venture_public_key: '',
  venture_private_key: '',
  cop_to_usd_equivalence: '',
};

const mockPrisma = {
  user: { findUnique: () => {} },
  paymentMethod: { count: () => {}, create: jest.fn() },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {},
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
