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

export const getAdminStats = async (req, res) => {
  try {
    // 1. Total Uang Masuk (Tagihan Lunas)
    // Asumsi: jumlah_terbayar diisi saat lunas. Jika null, gunakan 0.
    const queryIncome = `
      SELECT SUM(jumlah_terbayar) as total 
      FROM tagihan 
      WHERE status = 'Lunas'
    `;
    const [incomeRows] = await db.query(queryIncome);

    // 2. Tunggakan (Tagihan Belum Lunas)
    const queryPending = `
      SELECT SUM(jumlah) as total 
      FROM tagihan 
      WHERE status != 'Lunas'
    `;
    const [pendingRows] = await db.query(queryPending);

    // 3. Rumah Terisi (Penghuni Aktif)
    // Hitung unique id_rumah yang punya penghuni aktif
    const queryOccupied = `
      SELECT COUNT(DISTINCT id_rumah) as total 
      FROM penghuni_rumah 
      WHERE aktif = 1
    `;
    const [occupiedRows] = await db.query(queryOccupied);

    res.json({
      income: parseInt(incomeRows[0].total) || 0,
      pending: parseInt(pendingRows[0].total) || 0,
      occupied: parseInt(occupiedRows[0].total) || 0
    });

  } catch (error) {
    console.error("❌ Error Admin Dashboard:", error);
    res.status(500).json({ error: "Gagal memuat data admin." });
  }
};
