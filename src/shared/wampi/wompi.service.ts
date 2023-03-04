import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateTransactionResponse } from './dto/create-transaction';

@Injectable()
export class WompiService {
  private readonly baseUrl: string;
  private readonly currencyCode: string;
  private readonly ventureReference: string;
  private readonly countryCode: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('wampi_url');
    this.currencyCode = this.configService.get<string>('currency_code');
    this.ventureReference = this.configService.get<string>('venture_reference');
    this.countryCode = this.configService.get<string>('country_code');
  }

  async createTransaction(): Promise<CreateTransactionResponse> {
    const createTransactionResponse = await firstValueFrom(
      this.httpService.post<CreateTransactionResponse>(
        `${this.baseUrl}/transactions`,
        {
          acceptance_token: '',
          amount_in_cents: '',
          currency: this.currencyCode,
          customer_email: '',
          reference: this.ventureReference,
          customer_data: {
            full_name: '',
          },
          shipping_address: {
            address_line_1: '',
            country: this.countryCode,
            region: 'Cundinamarca',
            city: 'Bogotá',
            phone_number: '',
          },
        },
      ),
    );
    return createTransactionResponse.data;
  }
}
