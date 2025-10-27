import { Request, Response } from "express";
import {
  createAccountBody,
  moneyBody,
  transferBody,
} from "../schemas/accounts.schemas";
import { wrap } from "../utils/http";
import { accountsMemoryRepo } from "../repositories/memory/accounts.memory";
import { transactionsMemoryRepo } from "../repositories/memory/transactions.memory";
import { TransactionsService } from "../services/transactions.service";

const svc = new TransactionsService(accountsMemoryRepo, transactionsMemoryRepo);

export const createAccount = wrap(async (req: Request, res: Response) => {
  const data = createAccountBody.parse(req.body);
  const acc = await accountsMemoryRepo.create(data);
  res.status(201).json({
    id: acc.id,
    currency: acc.currency,
    balance: Number(acc.balanceMinor) / 100,
  });
});

export const getAccount = wrap(async (req: Request, res: Response) => {
  const acc = await accountsMemoryRepo.get(req.params.id);
  if (!acc) return res.status(404).json({ error: "NOT_FOUND" });
  res.json({
    id: acc.id,
    name: acc.name,
    currency: acc.currency,
    balance: Number(acc.balanceMinor) / 100,
    createdAt: acc.createdAt,
    updatedAt: acc.updatedAt,
  });
});

export const deposit = wrap(async (req: Request, res: Response) => {
  const { amount } = moneyBody.parse(req.body);
  const idemp = req.header("Idempotency-Key") ?? undefined;
  const txn = await svc.deposit(req.params.id, amount, idemp);
  res.status(201).json({ transactionId: txn.id });
});

export const withdraw = wrap(async (req: Request, res: Response) => {
  const { amount } = moneyBody.parse(req.body);
  const idemp = req.header("Idempotency-Key") ?? undefined;
  const txn = await svc.withdraw(req.params.id, amount, idemp);
  res.status(201).json({ transactionId: txn.id });
});

export const transfer = wrap(async (req: Request, res: Response) => {
  const { fromAccountId, toAccountId, amount } = transferBody.parse(req.body);
  const idemp = req.header("Idempotency-Key") ?? undefined;
  const txn = await svc.transfer(fromAccountId, toAccountId, amount, idemp);
  res.status(201).json({ transactionId: txn.id });
});
