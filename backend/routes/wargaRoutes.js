import express from "express";
import { addWarga, updateWarga } from "../controllers/wargaController.js";

const router = express.Router();

// Route untuk Admin Menambah Warga Baru
// URL: POST http://localhost:3000/api/warga/add
router.post("/add", addWarga);

// Route untuk Admin Edit Warga (Pindah Rumah / Update Profil)
// URL: PUT http://localhost:3000/api/warga/update/:id
router.put("/update/:id", updateWarga);

export default router;
