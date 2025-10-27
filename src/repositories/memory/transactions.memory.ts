import { TransactionsRepo } from "../transactions.repo.js";
import { Transaction } from "../../models/transaction.js";
import { randomUUID } from "crypto";

const txns: Transaction[] = [];
const byKey = new Map<string, Transaction>();

export const transactionsMemoryRepo: TransactionsRepo = {
  async create(input) {
    if (input.idempotencyKey && byKey.has(input.idempotencyKey)) {
      return byKey.get(input.idempotencyKey)!;
    }
    const t: Transaction = {
      id: randomUUID(),
      createdAt: new Date(),
      ...input,
    };
    txns.push(t);
    if (t.idempotencyKey) byKey.set(t.idempotencyKey, t);
    return t;
  },
  async findByIdempotency(key) {
    return byKey.get(key) ?? null;
  },
  async listByAccount(id, limit = 50, cursor) {
    const start = cursor ? txns.findIndex((t) => t.id === cursor) + 1 : 0;
    const items = txns
      .filter((t) => t.accountId === id)
      .slice(start, start + limit);
    const nextCursor =
      items.length === limit ? items[items.length - 1].id : undefined;
    return { items, nextCursor };
  },
};
