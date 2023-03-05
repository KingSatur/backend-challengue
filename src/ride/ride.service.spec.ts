import { Test, TestingModule } from '@nestjs/testing';
import { RideService } from './ride.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { WompiService } from '../shared/wampi/wompi.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RideService', () => {
  let service: RideService;
  let wompiService: WompiService;
  let configService: ConfigService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [],
          isGlobal: true,
        }),
        PrismaModule,
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
            get: jest.fn((Key: string, DefaultValue: string) => {
              switch (Key) {
                case 'FILES':
                  return './fakedata/';
                  break;
                case 'PORT':
                  return '9999';
                  break;
                default:
                  return DefaultValue;
              }
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            ride: { count: () => Promise.resolve([]) },
          },
        },
      ],
    }).compile();

    service = module.get<RideService>(RideService);
    wompiService = module.get<WompiService>(WompiService);
    configService = module.get<ConfigService>(ConfigService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
