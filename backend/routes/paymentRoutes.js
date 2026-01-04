import express from "express";
// IMPORT KEDUANYA (payBill DAN receivePaymentCallback)
import {
  payBill,
  receivePaymentCallback,
} from "../controllers/paymentController.js";

const router = express.Router();

// Jalur 1: Untuk Admin (Manual)
router.post("/", payBill);

// Jalur 2: Untuk Sistem Bank (Otomatis)
router.post("/callback", receivePaymentCallback);

export default router;
