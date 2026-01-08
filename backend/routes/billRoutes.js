import express from "express";
import {
  getBills,
  generateBills,
  getCategories,
  getUserBillSummary
} from "../controllers/billController.js";

const router = express.Router();

router.get("/", getBills); // GET /api/tagihan
router.post("/generate", generateBills); // POST /api/tagihan/generate
router.get("/categories", getCategories); // GET /api/tagihan/categories
router.get("/dashboard/summary", getUserBillSummary); // GET /api/tagihan/dashboard/summary

export default router;
