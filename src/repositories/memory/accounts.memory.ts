import { AccountsRepo } from "../accounts.repo.js";
import { Account } from "../../models/account.js";
import { randomUUID } from "crypto";
import { getConnection } from "../../config/db.js";

const store = new Map<string, Account>();

export const accountsMemoryRepo: AccountsRepo = {
  async get(id: string) {
    return store.get(id) ?? null;
  },

  async create(input: any) {
    const id = randomUUID();
    const now = new Date();

    const conn = await getConnection();

    try {
      const sql = `INSERT INTO ACCOUNTS (ID, USER_ID, CURRENCY, BALANCE_MINOR, CREATED_AT, UPDATED_AT, IS_BLOCKED) VALUES (:id, :userId, :currency, 0, :createdAt, :updatedAt, 0)`;

      await conn.execute(
        sql,
        {
          id,
          userId: input.userId,
          currency: input.currency,
          createdAt: now,
          updatedAt: now,
        },
        { autoCommit: true }
      );

      return {
        id,
        userId: input.userId,
        currency: input.currency as Account["currency"],
        balanceMinor: 0n,
        createdAt: now,
        updatedAt: now,
        isBlocked: false,
      } satisfies Account;
    } finally {
      await conn.close();
    }
  },

  async update(a: any) {
    a.updatedAt = new Date();
    store.set(a.id, a);
  },
};
