type UUID = string;

export interface PaymentMethodsTable {
  id: UUID;
  ownerPid: UUID;
  phone: string;
  bank: number;
}
