import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateTransactionResponse } from './dto/create-transaction';
import { VentureData } from './dto/acceptance-token';
import { CreatePaymentResponseDto } from './dto/payment-dto';

@Injectable()
export class WompiService {
  private readonly baseUrl: string;
  private readonly currencyCode: string;
  private readonly ventureReference: string;
  private readonly countryCode: string;
  private readonly venturePublicKey: string;
  private readonly venturePrivateKey: string;
  private readonly cardToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('wampi_url');
    this.currencyCode = this.configService.get<string>('currency_code');
    this.ventureReference = this.configService.get<string>('venture_reference');
    this.countryCode = this.configService.get<string>('country_code');
    this.venturePublicKey =
      this.configService.get<string>('venture_public_key');
    this.venturePrivateKey = this.configService.get<string>(
      'venture_private_key',
    );
    this.cardToken = this.configService.get<string>('card_token');
  }

  async getAcceptanceToken(): Promise<string> {
    const getMerchantsResponse = await firstValueFrom(
      this.httpService.get<VentureData>(
        `${this.baseUrl}/merchants/${this.venturePublicKey}`,
      ),
    );

    return getMerchantsResponse?.data?.presigned_acceptance?.acceptance_token;
  }

  async createPaymentMethod(email: string): Promise<CreatePaymentResponseDto> {
    const acceptanceToken = await this.getAcceptanceToken();
    const createPaymentResponse = await firstValueFrom(
      this.httpService.post<CreatePaymentResponseDto>(
        `${this.baseUrl}/payment_sources`,
        {
          type: 'CARD',
          token: this.cardToken,
          acceptance_token: acceptanceToken,
          customer_email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${this.venturePrivateKey}`,
          },
        },
      ),
    );
    return createPaymentResponse?.data;
  }

  async createTransaction(data: {
    amount: number;
    email: string;
    paymentId: string;
    fullName: string;
    phoneNumber: string;
    address: string;
  }): Promise<CreateTransactionResponse> {
    const acceptanceToken = await this.getAcceptanceToken();
    const createTransactionResponse = await firstValueFrom(
      this.httpService.post<CreateTransactionResponse>(
        `${this.baseUrl}/transactions`,
        {
          acceptance_token: acceptanceToken,
          amount_in_cents: data?.amount,
          currency: this.currencyCode,
          customer_email: data?.email,
          reference: this.ventureReference,
          payment_source_id: data?.paymentId,
          customer_data: {
            full_name: data?.fullName,
          },
          shipping_address: {
            address_line_1: data?.address,
            country: this.countryCode,
            region: 'Cundinamarca',
            city: 'Bogotá',
            phone_number: data?.phoneNumber,
          },
        },
      ),
    );
    return createTransactionResponse.data;
  }
}
