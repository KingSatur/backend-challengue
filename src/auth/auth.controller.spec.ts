import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('AuthController', () => {
  let controller: AuthController;
  const authService: DeepMockProxy<AuthService> = mockDeep<AuthService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should login and return token', async () => {
    authService.login.mockReturnValue(
      Promise.resolve({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imy05N2U2LWUwOTA1NmM4NzE5MiIsImlhdCI6MTY3ODEyMzM2MCwiZXhwIjoxNjgwNzE1MzYwfQ.pTrq9cvJx1CUR5OJikZ2IWao8',
      }),
    );
    const resp = await controller.create({
      email: 'sample@mail.com',
      password: '1234567',
    });
    expect(resp).toBeDefined();
    expect(resp.data).toBeDefined();
    expect(resp.data.token).toEqual(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imy05N2U2LWUwOTA1NmM4NzE5MiIsImlhdCI6MTY3ODEyMzM2MCwiZXhwIjoxNjgwNzE1MzYwfQ.pTrq9cvJx1CUR5OJikZ2IWao8',
    );
    expect(resp.notification).toBeDefined();
    expect(resp.notification.code).toEqual('AUTH_SUCCESS');
    expect(resp.notification.message).toEqual('Success authentication');
    expect(resp.notification.status).toEqual(200);
    expect(resp.success).toBeTruthy();
  });
});
