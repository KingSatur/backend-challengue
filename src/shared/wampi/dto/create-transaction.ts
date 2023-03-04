export interface CreateTransactionRequest {
  acceptance_token: string;
  amount_in_cents: string;
  currency: string;
  customer_email: string;
  payment_source_id: string;
  reference: string;
  customer_data: {
    full_name: string;
  };
  shipping_address: {
    address_line_1: string;
    country: string;
    region: string;
    city: string;
    phone_number: string;
  };
}

export interface CreateTransactionResponse {
  id: string;
  reference: string;
}
