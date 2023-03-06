import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WompiService } from '../shared/wampi/wompi.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { RideManagementException } from '../shared/exception/ride-management-exception';
import { ExceptionMessage } from '../constants/exception.message';

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
  cop_to_usd_equivalence: '',
};

const mockPrisma = {
  user: { findUnique: () => {} },
  paymentMethod: { count: () => {}, create: jest.fn() },
};

describe('PaymentService', () => {
  let service: PaymentService;
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

    service = module.get<PaymentService>(PaymentService);
    wompiService = module.get<WompiService>(WompiService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create card payment method', async () => {
    prisma.user.findUnique = jest.fn().mockReturnValue({
      email: 'sample@mail.com',
    });
    prisma.paymentMethod.count = jest.fn().mockReturnValue(0);

    wompiService.createPaymentMethod = jest.fn().mockReturnValue({
      data: {
        id: 543,
        token: 'tok_prod_280_32326B334c47Ec49a516bf1785247ba2',
        status: 'AVAILABLE',
      },
    });

    const response: CreatePaymentResponseDto =
      await service.createCardPaymentMethod('', new CreatePaymentRequestDto());

    expect(response.id).toBeDefined();
    expect(response.id).toEqual(543);
    expect(response.status).toBeDefined();
    expect(response.status).toEqual('AVAILABLE');
    expect(prisma.paymentMethod.create).toHaveBeenCalledWith({
      data: {
        preferred: true,
        wompiId: 543,
        userId: '',
        token: 'tok_prod_280_32326B334c47Ec49a516bf1785247ba2',
      },
    });
  });

  it('Should not create card payment method when exists other payment with same token', async () => {
    prisma.user.findUnique = jest.fn().mockReturnValue({
      email: 'sample@mail.com',
    });
    prisma.paymentMethod.count = jest.fn().mockReturnValue(1);
    try {
      await service.createCardPaymentMethod('', null);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RideManagementException);
      expect(error?.notification?.status).toBe(400);
      expect(error?.notification?.message).toBe(
        ExceptionMessage.CANNOT_CREATE_CREATE_PAYMENT_METHOD_WITH_USED_TOKEN
          .message,
      );
      expect(error?.notification?.code).toBe(
        ExceptionMessage.CANNOT_CREATE_CREATE_PAYMENT_METHOD_WITH_USED_TOKEN
          .code,
      );
    }
  });

  it('Should not create card payment method when user is not found', async () => {
    prisma.user.findUnique = jest.fn().mockReturnValue(null);
    prisma.paymentMethod.count = jest.fn().mockReturnValue(1);
    try {
      await service.createCardPaymentMethod('', null);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(RideManagementException);
      expect(error?.notification?.status).toBe(400);
      expect(error?.notification?.message).toBe(
        ExceptionMessage.USER_DOES_NOT_EXIST.message,
      );
      expect(error?.notification?.code).toBe(
        ExceptionMessage.USER_DOES_NOT_EXIST.code,
      );
    }
  });
});
