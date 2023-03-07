import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { WompiService } from './wompi.service';
import { mockDeep } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

const configValues = {
  environment: 'local',
  base_ride_fee: 3500,
  base_ride_km_fee: 1000,
  base_ride_minute_fee: 200,
  wampi_url: 'https://sandbox.wompi.co/v1',
  currency_code: 'COP',
  venture_reference: '0-1i2okmJNH192u9-0lmk',
  country_code: 'CO',
  card_token: '0-1i2okmJlp12H192u9-0lmk',
  venture_public_key: '',
  venture_private_key: 'tok_priv_280_32326B334c47Ec49a516bf1785247ba2',
  cop_to_usd_equivalence: '',
};

describe('PaymentService', () => {
  const httpService = mockDeep<HttpService>();

  let service: WompiService;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [],
          isGlobal: true,
        }),
      ],
      providers: [
        WompiService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, defaultValue: string) => {
              return configValues[key] || defaultValue;
            },
          },
        },
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();

    service = module.get<WompiService>(WompiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Acceptance token', () => {
    it('Should consume acceptance token of wompi api', async () => {
      const response: AxiosResponse<unknown, any> = {
        data: {
          data: {
            presigned_acceptance: {
              acceptance_token:
                'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2MDAzNzQ2MDEtMzA5MzIiLCJleHAiOjE2M32324DAzNzgyMDF9.J20dPsgcbIfgby-CXpjYEdvys-DZ6LYLkMfGOTpTaj4',
              permalink: '',
              type: '',
            },
          },
        },
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl', headers: null },
        status: 200,
        statusText: 'OK',
      };
      httpService.get.mockReturnValue(of(response));
      const resp = await service.getAcceptanceToken();
      expect(resp).toBeDefined();
      expect(resp).toEqual(
        'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2MDAzNzQ2MDEtMzA5MzIiLCJleHAiOjE2M32324DAzNzgyMDF9.J20dPsgcbIfgby-CXpjYEdvys-DZ6LYLkMfGOTpTaj4',
      );
    });
  });
  describe('Create payment', () => {
    it('Create payment should work ', async () => {
      const response1: AxiosResponse<unknown, any> = {
        data: {
          data: {
            presigned_acceptance: {
              acceptance_token:
                'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2MDAzNzQ2MDEtMzA5MzIiLCJleHAiOjE2M32324DAzNzgyMDF9.J20dPsgcbIfgby-CXpjYEdvys-DZ6LYLkMfGOTpTaj4',
              permalink: '',
              type: '',
            },
          },
        },
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl', headers: null },
        status: 200,
        statusText: 'OK',
      };
      const response: AxiosResponse<unknown, any> = {
        data: {
          data: {
            id: 543,
            token: 'tok_prod_280_32326B334c47Ec49a516bf1785247ba2',
            status: 'AVAILABLE',
          },
        },
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl', headers: null },
        status: 200,
        statusText: 'OK',
      };
      httpService.post.mockReturnValue(of(response));
      httpService.get.mockReturnValue(of(response1));
      const email = faker.internet.email();
      const resp = await service.createPaymentMethod(email);

      expect(resp).toBeDefined();
      expect(resp?.data?.status).toBeDefined();
      expect(resp?.data?.status).toEqual('AVAILABLE');
      expect(resp?.data?.token).toBeDefined();
      expect(resp?.data?.token).toEqual(
        'tok_prod_280_32326B334c47Ec49a516bf1785247ba2',
      );
      expect(resp.data?.id).toBeDefined();
      expect(resp.data?.id).toEqual(543);
      expect(httpService.post).toHaveBeenCalledWith(
        'https://sandbox.wompi.co/v1/payment_sources',
        {
          type: 'CARD',
          token: '0-1i2okmJlp12H192u9-0lmk',
          acceptance_token:
            'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2MDAzNzQ2MDEtMzA5MzIiLCJleHAiOjE2M32324DAzNzgyMDF9.J20dPsgcbIfgby-CXpjYEdvys-DZ6LYLkMfGOTpTaj4',
          customer_email: email,
        },
        {
          headers: {
            Authorization: `Bearer tok_priv_280_32326B334c47Ec49a516bf1785247ba2`,
          },
        },
      );
    });
  });
  describe('Create transaction', () => {
    it('Should create transaction', async () => {
      const acceptanceTokenResponse: AxiosResponse<unknown, any> = {
        data: {
          data: {
            presigned_acceptance: {
              acceptance_token:
                'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2MDAzNzQ2MDEtMzA5MzIiLCJleHAiOjE2M32324DAzNzgyMDF9.J20dPsgcbIfgby-CXpjYEdvys-DZ6LYLkMfGOTpTaj4',
              permalink: '',
              type: '',
            },
          },
        },
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl', headers: null },
        status: 200,
        statusText: 'OK',
      };
      httpService.get.mockReturnValue(of(acceptanceTokenResponse));
      const responseCreateTransaction: AxiosResponse<unknown, any> = {
        data: {
          data: {
            id: 'tok_prod_280_32326B334c47Ec49a516bf1785247b092',
            reference: 'TUPtdnVugyU40XlkhixhhGE6uYV2gh89',
          },
        },
        headers: {},
        config: { url: 'http://localhost:3000/mockUrl', headers: null },
        status: 200,
        statusText: 'OK',
      };
      httpService.post.mockReturnValue(of(responseCreateTransaction));
      const email = faker.internet.email();
      const name = faker.name.firstName();
      const lastName = faker.name.lastName();
      const resp = await service.createTransaction({
        address: 'Cl 70-60',
        amount: 15000,
        email,
        fullName: `${name} ${lastName}`,
        paymentId: 'd6348943-e85a-4d76-a3e4-3cb2447d9a65',
        phoneNumber: '5723189238913',
        city: 'Bogotá',
        state: 'Bogotá',
      });
      expect(resp).toBeDefined();
      expect(resp.data.id).toBeDefined();
      expect(resp.data.id).toEqual(
        'tok_prod_280_32326B334c47Ec49a516bf1785247b092',
      );
      expect(resp.data.reference).toBeDefined();
      expect(resp.data.reference).toEqual('TUPtdnVugyU40XlkhixhhGE6uYV2gh89');
      expect(httpService.post).toHaveBeenCalledWith(
        'https://sandbox.wompi.co/v1/transactions',
        {
          acceptance_token:
            'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2MDAzNzQ2MDEtMzA5MzIiLCJleHAiOjE2M32324DAzNzgyMDF9.J20dPsgcbIfgby-CXpjYEdvys-DZ6LYLkMfGOTpTaj4',
          amount_in_cents: 15000,
          currency: 'COP',
          customer_email: email,
          reference: '0-1i2okmJNH192u9-0lmk',
          payment_source_id: 'd6348943-e85a-4d76-a3e4-3cb2447d9a65',
          customer_data: {
            full_name: `${name} ${lastName}`,
          },
          shipping_address: {
            address_line_1: 'Cl 70-60',
            country: 'CO',
            region: 'Bogotá',
            city: 'Bogotá',
            phone_number: '5723189238913',
          },
        },
        {
          headers: {
            Authorization: `Bearer tok_priv_280_32326B334c47Ec49a516bf1785247ba2`,
          },
        },
      );
    });
  });
});
