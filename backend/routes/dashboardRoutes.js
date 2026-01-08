import express from "express";
// PASTIKAN IMPORT DARI SINI:
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

// PASTIKAN ROUTE-NYA BENAR:
router.get("/stats/:id_user", getDashboardData);

export default router;
