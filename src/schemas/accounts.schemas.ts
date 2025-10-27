import { z } from "zod";

export const createAccountBody = z.object({
  name: z.string().min(1),
  currency: z.enum(["USD", "EUR", "COP"]),
});

export const moneyBody = z.object({
  amount: z.number().positive(), // major units e.g. 12.34
});

export const transferBody = z.object({
  fromAccountId: z.string().min(1),
  toAccountId: z.string().min(1),
  amount: z.number().positive(),
});
