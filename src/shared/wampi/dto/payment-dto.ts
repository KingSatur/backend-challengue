export interface CreatePaymentOnWompiResponseDto {
  data: {
    id?: string;
    type?: string;
    token?: string;
    status?: string;
    customer_email?: string;
    public_data?: {
      type?: string;
    };
  };
}
