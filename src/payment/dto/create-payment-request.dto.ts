export class CreatePaymentRequestDto {
  card?: any;
  nequi?: {
    phoneNumber: string;
    phonePrefix: string;
  };
}
