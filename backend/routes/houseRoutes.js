import express from "express";
import {
  getHouses,
  createHouse,
  generateHouseRange,
} from "../controllers/houseController.js";

const router = express.Router();

router.get("/", getHouses);
router.post("/", createHouse);
router.post("/generate", generateHouseRange); // Fitur Canggih: Generate Massal

export default router;
