import db from "../config/db.js";

export const paymentCallback = async (req, res) => {
  const { nomor_va, jumlah_bayar } = req.body;

  console.log("------------------------------------------------");
  console.log("💰 [PAYMENT] Request Masuk:", nomor_va);

  try {
    // 1. Parsing ID Rumah
    const idRumahString = nomor_va.slice(-4);
    const idRumah = parseInt(idRumahString);

    if (isNaN(idRumah)) {
      return res
        .status(400)
        .json({ success: false, message: "Format VA Salah" });
    }

    console.log("🏠 [PAYMENT] Target Rumah ID:", idRumah);

    // 2. Cari Tagihan (Gunakan Alias 'id_tagihan' biar tidak tertukar!)
    const [tagihan] = await db.query(
      `SELECT t.id as id_tagihan, t.jumlah, t.status, p.nama as nama_periode 
             FROM tagihan t
             JOIN periode_penagihan p ON t.id_periode = p.id
             WHERE t.id_rumah = ? AND t.status != 'Lunas' 
             ORDER BY t.id ASC LIMIT 1`,
      [idRumah]
    );

    if (tagihan.length === 0) {
      console.log("⚠️ [PAYMENT] Tidak ada tagihan unpaid untuk rumah ini.");
      return res
        .status(404)
        .json({
          success: false,
          message: "Tagihan sudah lunas / tidak ditemukan",
        });
    }

    const bill = tagihan[0];
    console.log(
      "🧾 [PAYMENT] Ditemukan Tagihan ID:",
      bill.id_tagihan,
      "| Nominal:",
      bill.jumlah
    );

    // 3. Eksekusi Pembayaran
    // Hapus 'updated_at' dulu biar aman
    const [updateResult] = await db.query(
      "UPDATE tagihan SET status = 'Lunas', jumlah_terbayar = ? WHERE id = ?",
      [bill.jumlah, bill.id_tagihan]
    );

    console.log("✅ [PAYMENT] Hasil Update:", updateResult);

    if (updateResult.affectedRows === 0) {
      throw new Error("Query jalan tapi data tidak berubah! Cek ID Tagihan.");
    }

    // 4. Kirim Respon Sukses
    const refNo = "TRX" + Date.now().toString().slice(-8);
    const tanggalBayar = new Date().toLocaleString("id-ID");

    res.json({
      success: true,
      message: "Pembayaran Berhasil!",
      transactionDetails: {
        referensi: refNo,
        waktu: tanggalBayar,
        va: nomor_va,
        nominal: bill.jumlah,
        periode: bill.nama_periode,
        status: "LUNAS",
      },
    });
  } catch (error) {
    console.error("❌ [PAYMENT ERROR]:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error: " + error.message });
  }
};
