import db from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Hitung Total Pemasukan (Status Lunas)
    const [incomeData] = await db.query(
      "SELECT COALESCE(SUM(jumlah), 0) AS total FROM tagihan WHERE LOWER(status) = 'lunas'"
    );

    // 2. Hitung Total Tunggakan (Status Belum Bayar)
    // Menggunakan LIKE '%belum%' agar fleksibel menangani spasi atau variasi kata
    const [pendingData] = await db.query(
      "SELECT COALESCE(SUM(jumlah), 0) AS total FROM tagihan WHERE LOWER(status) LIKE '%belum%'"
    );

    // 3. Hitung Rumah Terisi
    // Menggunakan LIKE '%huni%' untuk menangkap 'Dihuni', 'Terhuni', dll.
    const [occupiedData] = await db.query(
      "SELECT COUNT(*) AS total FROM rumah WHERE LOWER(status_rumah) LIKE '%huni%'"
    );

    // Kirim respon bersih ke Frontend
    res.json({
      income: incomeData[0].total,
      pending: pendingData[0].total,
      occupied: occupiedData[0].total,
    });
  } catch (error) {
    // Console.error TETAP PERLU disimpan untuk memantau jika sewaktu-waktu server crash
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: error.message });
  }
};
