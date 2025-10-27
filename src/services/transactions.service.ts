import { AccountsRepo } from "../repositories/accounts.repo.js";
import { TransactionsRepo } from "../repositories/transactions.repo";
import { toMinor } from "../utils/money";

export class TransactionsService {
  constructor(private accounts: AccountsRepo, private txns: TransactionsRepo) {}

  async deposit(
    accountId: string,
    amountMajor: number,
    idempotencyKey?: string
  ) {
    const acc = await this.accounts.get(accountId);
    if (!acc) throw new Error("ACCOUNT_NOT_FOUND");
    if (acc.isBlocked) throw new Error("ACCOUNT_BLOCKED");

    const delta = toMinor(amountMajor);
    acc.balanceMinor += delta;
    await this.accounts.update(acc);

    return this.txns.create({
      type: "DEPOSIT",
      accountId,
      amountMinor: delta,
      currency: acc.currency,
      idempotencyKey,
    });
  }

  async withdraw(
    accountId: string,
    amountMajor: number,
    idempotencyKey?: string
  ) {
    const acc = await this.accounts.get(accountId);
    if (!acc) throw new Error("ACCOUNT_NOT_FOUND");
    if (acc.isBlocked) throw new Error("ACCOUNT_BLOCKED");

    const delta = toMinor(amountMajor);
    if (acc.balanceMinor < delta) throw new Error("INSUFFICIENT_FUNDS");

    acc.balanceMinor -= delta;
    await this.accounts.update(acc);

    return this.txns.create({
      type: "WITHDRAWAL",
      accountId,
      amountMinor: delta,
      currency: acc.currency,
      idempotencyKey,
    });
  }

  async transfer(
    fromId: string,
    toId: string,
    amountMajor: number,
    idempotencyKey?: string
  ) {
    if (fromId === toId) throw new Error("SAME_ACCOUNT");
    const from = await this.accounts.get(fromId);
    const to = await this.accounts.get(toId);
    if (!from || !to) throw new Error("ACCOUNT_NOT_FOUND");
    if (from.currency !== to.currency) throw new Error("CURRENCY_MISMATCH");

    const delta = toMinor(amountMajor);
    if (from.balanceMinor < delta) throw new Error("INSUFFICIENT_FUNDS");

    from.balanceMinor -= delta;
    to.balanceMinor += delta;
    await this.accounts.update(from);
    await this.accounts.update(to);

    return this.txns.create({
      type: "TRANSFER",
      accountId: fromId,
      counterpartyAccountId: toId,
      amountMinor: delta,
      currency: from.currency,
      idempotencyKey,
    });
  }
}
