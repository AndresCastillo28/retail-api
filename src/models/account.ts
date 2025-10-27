export type AccountId = string;
export interface Account {
  id: AccountId;
  name: string;
  currency: "USD" | "EUR" | "COP"; // extend as needed
  balanceMinor: bigint; // store cents as bigint
  createdAt: Date;
  updatedAt: Date;
  isBlocked: boolean;
}
