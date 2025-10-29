import { Account } from "../models/account.js";

export interface AccountsRepo {
  get(id: string): Promise<Account | null>;
  create(input: Pick<Account, "currency">): Promise<Account>;
  update(a: Account): Promise<void>;
}
