import { AccountsRepo } from "../accounts.repo.js";
import { Account } from "../../models/account.js";
import { randomUUID } from "crypto";

const store = new Map<string, Account>();

export const accountsMemoryRepo: AccountsRepo = {
  async get(id: string) {
    return store.get(id) ?? null;
  },
  async create(input: any) {
    const now = new Date();
    const acc: Account = {
      id: randomUUID(),
      userId: input.userId,
      currency: input.currency,
      balanceMinor: 0n,
      createdAt: now,
      updatedAt: now,
      isBlocked: false,
    };
    store.set(acc.id, acc);
    return acc;
  },
  async update(a: any) {
    a.updatedAt = new Date();
    store.set(a.id, a);
  },
};
