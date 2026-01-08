import db from "../config/db.js";

export const loginWarga = async (req, res) => {
  const { nohp } = req.body;

  try {
    // 1. Cek apakah No HP terdaftar sebagai Pengguna & Penghuni Aktif
    // Kita langsung JOIN ke tabel Rumah dan Tagihan yang statusnya 'Belum Bayar'
    const query = `
      SELECT 
        p.id AS id_user,
        p.nama,
        p.nohp,
        r.blok_rumah,
        r.no_rumah,
        t.nomor_va,
        t.jumlah,
        t.status,
        per.nama AS periode
      FROM pengguna p
      JOIN penghuni_rumah pr ON p.id = pr.id_pengguna
      JOIN rumah r ON pr.id_rumah = r.id
      -- Ambil Tagihan Terakhir yang Belum Bayar
      LEFT JOIN tagihan t ON r.id = t.id_rumah AND t.status = 'Belum Bayar'
      LEFT JOIN periode_penagihan per ON t.id_periode = per.id
      WHERE p.nohp = ? AND pr.aktif = 1
      ORDER BY t.id DESC 
      LIMIT 1
    `;

    const [rows] = await db.query(query, [nohp]);

    // Jika No HP tidak ditemukan
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Nomor HP tidak terdaftar atau bukan warga aktif." });
    }

    const userData = rows[0];

    // Kirim data lengkap ke Frontend
    res.json({
      success: true,
      data: {
        id: userData.id_user,
        nama: userData.nama,
        nohp: userData.nohp,
        blok: userData.blok_rumah || "-",
        nomor: userData.no_rumah || "-",
        // Info Tagihan (Bisa null jika tidak ada tagihan)
        tagihan: userData.nomor_va
          ? {
              nomor_va: userData.nomor_va,
              jumlah: userData.jumlah,
              periode: userData.periode,
              status: userData.status,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error Login Warga:", error);
    res.status(500).json({ error: error.message });
  }
};
