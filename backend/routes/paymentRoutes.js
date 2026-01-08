import express from "express";
import { paymentCallback } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/callback", paymentCallback);

export default router;
