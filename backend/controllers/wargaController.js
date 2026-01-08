import db from "../config/db.js";

// ============================================================================
// 1. TAMBAH WARGA BARU (STRICT: Cek Rumah Kosong)
// ============================================================================
export const addWarga = async (req, res) => {
  const { nama, email, nohp, password, id_rumah, status_penghuni } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // VALIDASI: KEAMANAN RUMAH
    if (id_rumah) {
      // Cek 1: Apakah rumahnya ada?
      const [rumahExist] = await connection.query(
        "SELECT id FROM rumah WHERE id = ?",
        [id_rumah]
      );
      if (rumahExist.length === 0) {
        throw new Error("Data Rumah tidak ditemukan!");
      }

      // Cek 2: Apakah rumah sudah berpenghuni?
      const [cekPenghuni] = await connection.query(
        "SELECT * FROM penghuni_rumah WHERE id_rumah = ? AND aktif = 1",
        [id_rumah]
      );

      if (cekPenghuni.length > 0) {
        throw new Error(
          "GAGAL: Rumah ini SUDAH BERPENGHUNI. Harap pilih rumah yang kosong."
        );
      }
    } else {
      throw new Error("Wajib memilih Rumah saat mendaftarkan Warga!");
    }

    // A. Buat User
    const [userResult] = await connection.query(
      "INSERT INTO pengguna (nama, email, nohp, password, posisi) VALUES (?, ?, ?, ?, 'Penghuni')",
      [nama, email, nohp, password]
    );
    const newUserId = userResult.insertId;

    // B. Masukkan ke Rumah
    await connection.query(
      "INSERT INTO penghuni_rumah (id_rumah, id_pengguna, status_penghuni, aktif) VALUES (?, ?, ?, 1)",
      [id_rumah, newUserId, status_penghuni || "Tetap"]
    );

    // C. Update Status Rumah
    await connection.query(
      "UPDATE rumah SET status_rumah = 'Dihuni' WHERE id = ?",
      [id_rumah]
    );

    await connection.commit();
    res.status(201).json({ message: "Sukses! Warga berhasil didaftarkan." });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ============================================================================
// 2. UPDATE WARGA (Fitur Edit & Pindah Rumah)
// ============================================================================
export const updateWarga = async (req, res) => {
  const { id } = req.params; // ID User
  const { nama, email, nohp, id_rumah, status_penghuni } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // A. Update Profil Dasar
    await connection.query(
      "UPDATE pengguna SET nama = ?, email = ?, nohp = ? WHERE id = ?",
      [nama, email, nohp, id]
    );

    // B. Update Hubungan Rumah (Jika ada perubahan)
    if (id_rumah) {
      // Cek apakah user sudah punya data huni?
      const [existing] = await connection.query(
        "SELECT * FROM penghuni_rumah WHERE id_pengguna = ?",
        [id]
      );

      if (existing.length > 0) {
        // UPDATE (Pindah Rumah)
        await connection.query(
          "UPDATE penghuni_rumah SET id_rumah = ?, status_penghuni = ? WHERE id_pengguna = ?",
          [id_rumah, status_penghuni, id]
        );
      } else {
        // INSERT BARU (Jika data lama rusak/kosong)
        await connection.query(
          "INSERT INTO penghuni_rumah (id_rumah, id_pengguna, status_penghuni, aktif) VALUES (?, ?, ?, 1)",
          [id_rumah, id, status_penghuni]
        );
      }

      // Update status rumah baru jadi Dihuni
      await connection.query(
        "UPDATE rumah SET status_rumah = 'Dihuni' WHERE id = ?",
        [id_rumah]
      );
    }

    await connection.commit();
    res.json({ message: "Data warga berhasil diperbarui!" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
