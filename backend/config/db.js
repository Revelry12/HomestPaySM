// backend/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_tagihan_perumahan", // Sesuaikan nama DB Anda
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("Database Connected.");
export default db;
