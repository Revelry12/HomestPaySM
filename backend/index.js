import express from "express";
import cors from "cors";
import db from "./config/db.js"; 
import dotenv from "dotenv";
dotenv.config();

import residentRoutes from "./routes/residentRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import houseRoutes from "./routes/houseRoutes.js"; 
import paymentRoutes from "./routes/paymentRoutes.js";
import mobileRoutes from "./routes/mobileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import financeroutes from "./routes/financeRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.use("/api/warga", residentRoutes);
app.use("/api/tagihan", billRoutes);
app.use("/api/rumah", houseRoutes);
app.use("/api/pembayaran", paymentRoutes);
app.use("/api/mobile", mobileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/finance", financeroutes);
// Khusus untuk Kategori, kita "titip" jalurnya di billRoutes saja agar hemat file,
// atau panggil lewat /api/tagihan/categories

app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});
