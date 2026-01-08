import db from "../config/db.js";

// ==================================================================
// 1. GET SEMUA RUMAH (Untuk Tabel Admin)
// ==================================================================
export const getHouses = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM rumah ORDER BY blok_rumah, no_rumah"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================================================================
// 2. GET RUMAH KOSONG (Untuk Dropdown Tambah Warga)
// ==================================================================
export const getEmptyHouses = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, blok_rumah, no_rumah FROM rumah WHERE UPPER(status_rumah) = 'KOSONG' ORDER BY blok_rumah ASC, no_rumah ASC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================================================================
// 3. TAMBAH SATUAN (Fungsi yang tadi Error/Missing) ✅
// ==================================================================
export const createHouse = async (req, res) => {
  // Kita terima 'blok' dan 'no_rumah' (atau 'no')
  const { blok, no_rumah, no } = req.body;
  const nomor = no_rumah || no; // Handle jika frontend kirim pakai nama 'no'

  if (!blok || !nomor) {
    return res.status(400).json({ error: "Blok dan Nomor Rumah wajib diisi!" });
  }

  try {
    // Cek apakah rumah sudah ada?
    const [existing] = await db.query(
      "SELECT id FROM rumah WHERE blok_rumah = ? AND no_rumah = ?",
      [blok, nomor]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: `Rumah ${blok}-${nomor} sudah ada!` });
    }

    // Insert Rumah Baru (Status Default: Kosong)
    await db.query(
      "INSERT INTO rumah (blok_rumah, no_rumah, status_rumah) VALUES (?, ?, 'Kosong')",
      [blok, nomor]
    );

    res.status(201).json({ message: "Rumah berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================================================================
// 4. GENERATE MASSAL
// ==================================================================
export const generateHouses = async (req, res) => {
  const { blok, no_awal, no_akhir } = req.body;

  if (!blok || !no_awal || !no_akhir) {
    return res
      .status(400)
      .json({ error: "Data Blok, No Awal, dan No Akhir wajib diisi!" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    let countSuccess = 0;
    // Loop dari nomor awal ke akhir
    for (let i = parseInt(no_awal); i <= parseInt(no_akhir); i++) {
      // Cek duplikat di dalam loop
      const [existing] = await connection.query(
        "SELECT id FROM rumah WHERE blok_rumah = ? AND no_rumah = ?",
        [blok, i]
      );

      if (existing.length === 0) {
        await connection.query(
          "INSERT INTO rumah (blok_rumah, no_rumah, status_rumah) VALUES (?, ?, 'Kosong')",
          [blok, i]
        );
        countSuccess++;
      }
    }

    await connection.commit();
    res.json({
      message: `Sukses! ${countSuccess} rumah ditambahkan di Blok ${blok}.`,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: "Gagal generate: " + error.message });
  } finally {
    connection.release();
  }
};
