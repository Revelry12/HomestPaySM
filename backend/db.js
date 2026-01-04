// backend/index.js
import express from "express";
import cors from "cors";

// Import Routes yang sudah dipisah
import residentRoutes from "./routes/residentRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- GUNAKAN ROUTES ---
// Prefix '/api/warga' otomatis nempel ke semua route di residentRoutes
app.use("/api/warga", residentRoutes);
app.use("/api/tagihan", billRoutes);
app.use("/api/kategori", categoryRoutes);

// Cek server jalan
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
