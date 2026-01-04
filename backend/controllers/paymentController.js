import db from "../config/db.js";

// ---------------------------------------------------------
// 1. FITUR BAYAR MANUAL (Dipakai Admin saat klik tombol "Bayar Sekarang")
// ---------------------------------------------------------
export const payBill = async (req, res) => {
  const { id_tagihan } = req.body;
  // Kita abaikan metode_bayar dulu karena kolomnya blm ada di DB

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // A. Cari Info Tagihan
    const [bill] = await connection.query(
      "SELECT jumlah FROM tagihan WHERE id = ?",
      [id_tagihan]
    );
    if (bill.length === 0) {
      throw new Error("Tagihan tidak ditemukan!");
    }
    const nominal = bill[0].jumlah;

    // B. Update Status Tagihan Utama jadi 'Lunas'
    await connection.query("UPDATE tagihan SET status = 'Lunas' WHERE id = ?", [
      id_tagihan,
    ]);

    // C. Catat ke Tabel Pembayaran (Arsip)
    await connection.query(
      `INSERT INTO pembayaran (id_tagihan, jumlah, waktu_pembayaran, status) 
       VALUES (?, ?, NOW(), 'Lunas')`,
      [id_tagihan, nominal]
    );

    await connection.commit();
    res.json({ message: "Pembayaran Manual Berhasil! Status Lunas." });
  } catch (error) {
    await connection.rollback();
    console.error("Error Payment:", error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ---------------------------------------------------------
// 2. FITUR BAYAR OTOMATIS (Webhook / Callback dari Bank/Simulasi)
// ---------------------------------------------------------
export const receivePaymentCallback = async (req, res) => {
  const { nomor_va, jumlah_bayar } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // A. Cari Tagihan Berdasarkan Nomor VA
    const [bills] = await connection.query(
      "SELECT id, jumlah, status FROM tagihan WHERE nomor_va = ?",
      [nomor_va]
    );

    if (bills.length === 0) {
      throw new Error("Nomor VA tidak ditemukan di sistem!");
    }
    const tagihan = bills[0];

    // Cek apakah sudah lunas?
    if (tagihan.status === "Lunas") {
      return res.json({ message: "Tagihan ini sudah lunas sebelumnya." });
    }

    // B. Update Status Tagihan Jadi Lunas
    await connection.query("UPDATE tagihan SET status = 'Lunas' WHERE id = ?", [
      tagihan.id,
    ]);

    // C. Catat di Tabel Pembayaran
    await connection.query(
      `INSERT INTO pembayaran (id_tagihan, jumlah, waktu_pembayaran, status, nomor_va) 
       VALUES (?, ?, NOW(), 'Lunas', ?)`,
      [tagihan.id, jumlah_bayar, nomor_va]
    );

    await connection.commit();
    res.json({ success: true, message: "Pembayaran Otomatis Diterima." });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
};
