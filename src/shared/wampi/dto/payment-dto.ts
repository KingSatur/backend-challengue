export interface CreatePaymentResponseDto {
  id: string;
  type: string;
  token: string;
  status: string;
  customer_email: string;
  public_data: {
    type: string;
  };
}
