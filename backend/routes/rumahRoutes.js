import express from "express";
import {
  getHouses,
  getEmptyHouses,
  generateHouses,
  createHouse as generateHouse,
} from "../controllers/rumahController.js";

const router = express.Router();

// ==================================================================
// DAFTAR ROUTE LENGKAP
// ==================================================================

// 1. Ambil Semua Data (Tabel)
// GET http://localhost:3000/api/rumah
router.get("/", getHouses);

// 2. Tambah SATUAN (Form Kecil) -> INI YANG TADI ERROR
// POST http://localhost:3000/api/rumah
router.post("/", generateHouse);

// 3. Generate MASSAL (Form Besar)
// POST http://localhost:3000/api/rumah/generate
router.post("/generate", generateHouses);

// 4. Dropdown Rumah Kosong (Form Warga)
// GET http://localhost:3000/api/rumah/available
router.get("/available", getEmptyHouses);

export default router;
