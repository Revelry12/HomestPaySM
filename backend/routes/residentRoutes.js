import express from "express";
import {
  createResident,
  getResidents,
} from "../controllers/residentController.js";

const router = express.Router();

router.get("/", getResidents); // GET /api/warga
router.post("/", createResident); // POST /api/warga

export default router;
    