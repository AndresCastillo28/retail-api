import { Account } from "./account";

export type TxnId = string;
export type TxnType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";

export interface Transaction {
  id: TxnId;
  type: TxnType;
  accountId: string;
  // for transfers:
  counterpartyAccountId?: string;
  amountMinor: bigint;
  currency: Account["currency"];
  idempotencyKey?: string;
  createdAt: Date;
}
