type UUID = string;

export interface PaymentMethodsTable {
  id: UUID;
  ownerId: UUID;
  phone: string;
  bank: number;
}
