import db from "../config/db.js";

// 1. Tambah Warga Baru (Create)
export const createResident = async (req, res) => {
  const { block, number, owner, phone, status, type } = req.body;

  try {
    // A. Cari ID Rumah
    const [houses] = await db.query(
      "SELECT id FROM rumah WHERE blok_rumah = ? AND no_rumah = ? LIMIT 1",
      [block, number]
    );

    if (houses.length === 0) {
      return res
        .status(404)
        .json({
          error: `Rumah Blok ${block} No ${number} belum ada di Master Rumah!`,
        });
    }
    const idRumah = houses[0].id;

    // B. Buat Identitas Pengguna (Posisi Hardcode 'Penghuni')
    const [userResult] = await db.query(
      "INSERT INTO pengguna (nama, nohp, posisi) VALUES (?, ?, ?)",
      [owner, phone, "Penghuni"]
    );
    const idPengguna = userResult.insertId;

    // C. Sambungkan Warga ke Rumah
    const queryRelation = `
      INSERT INTO penghuni_rumah 
      (id_rumah, id_pengguna, kuasa, aktif, mulai_tinggal) 
      VALUES (?, ?, ?, 1, CURDATE())
    `;
    await db.query(queryRelation, [idRumah, idPengguna, type]);

    // D. Update Status Rumah
    await db.query("UPDATE rumah SET status_rumah = ? WHERE id = ?", [
      status,
      idRumah,
    ]);

    res.json({ message: "Sukses! Warga terdaftar." });
  } catch (error) {
    console.error("Error Create Resident:", error);
    res.status(500).json({ error: "Gagal menyimpan: " + error.message });
  }
};

// 2. Ambil List Warga (Read)
export const getResidents = async (req, res) => {
  try {
    const query = `
        SELECT 
          r.id,
          r.blok_rumah, 
          r.no_rumah, 
          r.status_rumah,
          p.nama AS nama_penghuni, 
          p.nohp, 
          pr.kuasa AS tipe_warga
        FROM rumah r
        LEFT JOIN penghuni_rumah pr ON r.id = pr.id_rumah AND pr.aktif = 1
        LEFT JOIN pengguna p ON pr.id_pengguna = p.id
        ORDER BY r.blok_rumah ASC, r.no_rumah ASC
      `;

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
