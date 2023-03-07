import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('PaymentController', () => {
  let controller: PaymentController;
  const paymentService: DeepMockProxy<PaymentService> =
    mockDeep<PaymentService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: paymentService,
        },
      ],
      imports: [
        ConfigModule.forRoot({
          load: [],
          isGlobal: true,
        }),
        PrismaModule,
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should consume createCardPaymentMethod from payment service', async () => {
    paymentService.createCardPaymentMethod.mockReturnValue(
      Promise.resolve({
        id: 'e7d0e2be-e0db-4184-8c4e-5db7365f8a92',
        status: 'AVAILABLE',
      }),
    );

    const resp = await controller.create(
      { user: { userId: 'e7d0e2be-e0db-4184-8c4e-5db7365f8a90' } },
      null,
    );
    expect(paymentService.createCardPaymentMethod).toHaveBeenCalledWith(
      'e7d0e2be-e0db-4184-8c4e-5db7365f8a90',
      null,
    );
    expect(resp).toBeDefined();
    expect(resp.data).toBeDefined();
    expect(resp.data.id).toEqual('e7d0e2be-e0db-4184-8c4e-5db7365f8a92');
    expect(resp.data.status).toEqual('AVAILABLE');
    expect(resp.notification).toBeDefined();
    expect(resp.notification.code).toEqual('PAYMENT_WAS_CREATED');
    expect(resp.notification.message).toEqual('Payment was created for user');
    expect(resp.notification.status).toEqual(201);
    expect(resp.success).toBeTruthy();
  });
});
