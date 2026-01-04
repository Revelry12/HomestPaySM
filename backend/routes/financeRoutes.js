import express from "express";
import {
  getFinanceSummary,
  addExpense,
} from "../controllers/financeController.js";
const router = express.Router();

router.get("/summary", getFinanceSummary);
router.post("/add", addExpense);

export default router;
