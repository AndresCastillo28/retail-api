import { Account } from "../models/account";

export interface AccountsRepo {
  get(id: string): Promise<Account | null>;
  create(input: Pick<Account, "name" | "currency">): Promise<Account>;
  update(a: Account): Promise<void>;
}
