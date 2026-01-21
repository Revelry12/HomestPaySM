import express from "express";
// PASTIKAN IMPORT DARI SINI:
// PASTIKAN IMPORT DARI SINI:
import { getDashboardData, getAdminStats } from "../controllers/dashboardController.js";

const router = express.Router();

// PASTIKAN ROUTE-NYA BENAR:
router.get("/stats", getAdminStats);
router.get("/stats/:id_user", getDashboardData);

export default router;
