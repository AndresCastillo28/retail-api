import { Transaction } from "../models/transaction";

export interface TransactionsRepo {
  create(txn: Omit<Transaction, "id" | "createdAt">): Promise<Transaction>;
  findByIdempotency(key: string): Promise<Transaction | null>;
  listByAccount(
    id: string,
    limit?: number,
    cursor?: string
  ): Promise<{ items: Transaction[]; nextCursor?: string }>;
}
