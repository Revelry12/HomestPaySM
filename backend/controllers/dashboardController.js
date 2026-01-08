import db from "../config/db.js";

export const getDashboardData = async (req, res) => {
  const { id_user } = req.params;

  // Debugging: Cek ID yang masuk di Terminal Backend
  console.log("🔍 [DASHBOARD] Cek User ID:", id_user);

  try {
    // -------------------------------------------------------------
    // LANGKAH 1: CARI RUMAHNYA DULU (Tanpa Peduli Tagihan)
    // -------------------------------------------------------------
    const queryRumah = `
        SELECT r.id, r.blok_rumah, r.no_rumah 
        FROM penghuni_rumah pr
        JOIN rumah r ON pr.id_rumah = r.id
        WHERE pr.id_pengguna = ? AND pr.aktif = 1
    `;

    const [rumahRows] = await db.query(queryRumah, [id_user]);

    // Jika user ini tidak punya rumah (Gelandangan/Admin)
    if (rumahRows.length === 0) {
      console.log("⚠️ User tidak punya rumah.");
      return res.json({
        id_rumah: rumah.id,
        rumah_info: "-",
        total_tagihan: 0,
        rincian: [],
      });
    }

    const rumah = rumahRows[0]; // Kita dapat ID Rumah (misal: 30)
    console.log(
      "🏠 [DASHBOARD] Rumah Ditemukan:",
      rumah.blok_rumah,
      rumah.no_rumah
    );

    // -------------------------------------------------------------
    // LANGKAH 2: BARU CARI TAGIHAN UNTUK RUMAH ITU
    // -------------------------------------------------------------
    const queryTagihan = `
        SELECT SUM(jumlah) as total 
        FROM tagihan 
        WHERE id_rumah = ? AND status != 'Lunas'
    `;
    const [tagihanRows] = await db.query(queryTagihan, [rumah.id]);

    // -------------------------------------------------------------
    // LANGKAH 3: AMBIL RINCIAN BULAN
    // -------------------------------------------------------------
    const queryRincian = `
        SELECT t.id, p.nama as bulan, t.jumlah, t.status 
        FROM tagihan t
        JOIN periode_penagihan p ON t.id_periode = p.id
        WHERE t.id_rumah = ? AND t.status != 'Lunas'
        ORDER BY p.id DESC
    `;
    const [rincianRows] = await db.query(queryRincian, [rumah.id]);

    // -------------------------------------------------------------
    // KIRIM HASIL
    // -------------------------------------------------------------
    res.json({
      id_rumah: rumah.id,
      rumah_info: `Blok ${rumah.blok_rumah} No. ${rumah.no_rumah}`,
      total_tagihan: parseInt(tagihanRows[0].total) || 0,
      rincian: rincianRows,
    });
  } catch (error) {
    console.error("❌ Error Dashboard:", error);
    res.status(500).json({ error: "Gagal memuat dashboard." });
  }
};
