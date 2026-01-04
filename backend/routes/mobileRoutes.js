import express from "express";
import { loginWarga } from "../controllers/mobileController.js";

const router = express.Router();

router.post("/login", loginWarga);

export default router;
