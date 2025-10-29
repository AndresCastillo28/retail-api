import { Router } from "express";
import {
  createAccount,
  getAccount,
  deposit,
  withdraw,
} from "../controllers/accounts.controller.js";

export const router = Router();

router.post("/", createAccount);
router.get("/:id", getAccount);
router.post("/:id/deposits", deposit);
router.post("/:id/withdrawals", withdraw);
