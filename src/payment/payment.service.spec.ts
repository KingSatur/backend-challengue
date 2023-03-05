import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { WompiService } from '../shared/wampi/wompi.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PaymentService', () => {
  let service: PaymentService;
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
        PaymentService,
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

    service = module.get<PaymentService>(PaymentService);
    wompiService = module.get<WompiService>(WompiService);
    configService = module.get<ConfigService>(ConfigService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
