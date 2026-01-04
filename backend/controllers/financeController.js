import db from "../config/db.js";

// 1. Ambil Data Ringkasan Keuangan
export const getFinanceSummary = async (req, res) => {
  try {
    // A. Hitung Total Pemasukan (Tagihan Lunas)
    const [incomeRes] = await db.query(
      "SELECT COALESCE(SUM(jumlah), 0) AS total FROM tagihan WHERE status = 'Lunas'"
    );

    // B. Hitung Total Pengeluaran
    const [expenseRes] = await db.query(
      "SELECT COALESCE(SUM(jumlah), 0) AS total FROM pengeluaran"
    );

    // C. Ambil History Pengeluaran Terakhir
    const [expenses] = await db.query(
      "SELECT * FROM pengeluaran ORDER BY tanggal DESC LIMIT 10"
    );

    res.json({
      total_masuk: incomeRes[0].total,
      total_keluar: expenseRes[0].total,
      saldo_akhir: incomeRes[0].total - expenseRes[0].total,
      history_pengeluaran: expenses,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Tambah Pengeluaran Baru
export const addExpense = async (req, res) => {
  const { judul, kategori, jumlah, tanggal } = req.body;
  try {
    await db.query(
      "INSERT INTO pengeluaran (judul, kategori, jumlah, tanggal) VALUES (?, ?, ?, ?)",
      [judul, kategori, jumlah, tanggal]
    );
    res.json({ message: "Pengeluaran berhasil dicatat" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
