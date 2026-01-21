import express from "express";
// IMPORT DULU
import {
  getBills,
  generateBills,
  getCategories,
  getUserBillSummary,
  getBillDetail
} from "../controllers/billController.js";

const router = express.Router();

router.get("/", getBills); // GET /api/tagihan
router.post("/generate", generateBills); // POST /api/tagihan/generate
router.get("/categories", getCategories); // GET /api/tagihan/categories
router.get("/dashboard/summary", getUserBillSummary); // GET /api/tagihan/dashboard/summary
// ROUTE BARU
router.get("/detail/:id", getBillDetail);

export default router;
