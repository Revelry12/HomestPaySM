import db from "../config/db.js";

// 1. Ambil Semua Data Rumah
export const getHouses = async (req, res) => {
  try {
    const query = `
      SELECT r.*, 
      (SELECT COUNT(*) FROM penghuni_rumah pr WHERE pr.id_rumah = r.id AND pr.aktif = 1) as is_occupied
      FROM rumah r 
      ORDER BY r.blok_rumah ASC, CAST(r.no_rumah AS UNSIGNED) ASC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Tambah Rumah Baru (Satuan)
export const createHouse = async (req, res) => {
  const { block, number, status } = req.body;
  try {
    // Cek duplikat
    const [exist] = await db.query(
      "SELECT id FROM rumah WHERE blok_rumah = ? AND no_rumah = ?",
      [block, number]
    );
    if (exist.length > 0)
      return res.status(400).json({ error: "Rumah ini sudah terdaftar!" });

    await db.query(
      "INSERT INTO rumah (blok_rumah, no_rumah, status_rumah) VALUES (?, ?, ?)",
      [block, number, status || "Kosong"]
    );
    res.json({ message: "Rumah berhasil ditambahkan." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Generate Rumah Massal (Otomatis A1 - A20)
export const generateHouseRange = async (req, res) => {
  const { block, startNum, endNum } = req.body; // Misal: Blok F, Mulai 1, Sampai 20

  try {
    let count = 0;
    for (let i = startNum; i <= endNum; i++) {
      // Cek dulu biar gak error duplikat
      const [exist] = await db.query(
        "SELECT id FROM rumah WHERE blok_rumah = ? AND no_rumah = ?",
        [block, i]
      );
      if (exist.length === 0) {
        await db.query(
          "INSERT INTO rumah (blok_rumah, no_rumah, status_rumah) VALUES (?, ?, ?)",
          [block, i, "Kosong"]
        );
        count++;
      }
    }
    res.json({
      message: `Berhasil generate ${count} rumah baru di Blok ${block}.`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
