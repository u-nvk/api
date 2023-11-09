type UUID = string;

export interface PaymentMethodsTable {
  id: UUID;
  phone: string;
  bank: string;
}
