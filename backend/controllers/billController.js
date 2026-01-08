import db from "../config/db.js";

// ============================================================================
// 1. GET ALL BILLS (Untuk Halaman Admin)
// ============================================================================
export const getBills = async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id, 
        t.jumlah, 
        t.status, 
        t.nomor_va,
        t.jumlah_terbayar,
        t.jatuh_tempo,
        t.created_at,
        COALESCE(r.blok_rumah, '-') AS blok_rumah, 
        COALESCE(r.no_rumah, '-') AS no_rumah, 
        COALESCE(p.nama, 'Belum Ada Penghuni') AS nama_warga,
        COALESCE(per.nama, 'Periode ???') AS bulan,
        per.nama as nama_periode,
        COALESCE(k.nama, 'IPL') AS nama_kategori 
      FROM tagihan t
      LEFT JOIN rumah r ON t.id_rumah = r.id
      LEFT JOIN periode_penagihan per ON t.id_periode = per.id
      LEFT JOIN kategori_tagihan k ON t.id_kategori = k.id
      LEFT JOIN penghuni_rumah pr ON r.id = pr.id_rumah AND pr.aktif = 1
      LEFT JOIN pengguna p ON pr.id_pengguna = p.id
      ORDER BY t.id DESC
    `;

    const [rows] = await db.query(query);

    const formattedRows = rows.map((item) => ({
      ...item,
      tahun: item.created_at ? new Date(item.created_at).getFullYear() : "-",
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error("Error Get Bills:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// 2. GET CATEGORIES (Untuk Dropdown Modal)
// ============================================================================
export const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kategori_tagihan");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// 3. GENERATE TAGIHAN (Fungsi yang tadi Error/Hilang)
// ============================================================================
export const generateBills = async (req, res) => {
  const { nama_periode, bulan, tahun, jumlah_tagihan, id_kategori } = req.body;

  const connection = await db.getConnection(); // Pakai Transaction

  try {
    await connection.beginTransaction();

    // A. SETUP TANGGAL
    const tglAwal = `${tahun}-${bulan}-01`;
    const lastDay = new Date(tahun, bulan, 0).getDate();
    const tglAkhir = `${tahun}-${bulan}-${lastDay}`;
    const kodeWaktu = `${tahun}${bulan.toString().padStart(2, "0")}`;

    // Hitung Jatuh Tempo (Tgl 10 bulan depannya)
    let nextMonth = parseInt(bulan) + 1;
    let nextYear = parseInt(tahun);
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    }
    const jatuhTempo = `${nextYear}-${nextMonth
      .toString()
      .padStart(2, "0")}-10`;

    // B. CEK PERIODE
    let idPeriode;
    const [existingPeriod] = await connection.query(
      "SELECT id FROM periode_penagihan WHERE nama = ?",
      [nama_periode]
    );

    if (existingPeriod.length > 0) {
      idPeriode = existingPeriod[0].id;
    } else {
      const [newPeriod] = await connection.query(
        "INSERT INTO periode_penagihan (nama, tanggal_awal, tanggal_akhir, aktif) VALUES (?, ?, ?, 1)",
        [nama_periode, tglAwal, tglAkhir]
      );
      idPeriode = newPeriod.insertId;
    }

    // C. SMART INSERT
    const querySmartInsert = `
      INSERT INTO tagihan (
        id_periode, id_rumah, jumlah, status, id_kategori, nomor_va, 
        jumlah_terbayar, jatuh_tempo
      )
      SELECT 
        ? AS id_periode, 
        r.id AS id_rumah, 
        ? AS jumlah, 
        'Belum Bayar' AS status,
        ? AS id_kategori,
        CONCAT('8800', ?, LPAD(r.id, 4, '0')) AS nomor_va,
        0 AS jumlah_terbayar,
        ? AS jatuh_tempo
      FROM rumah r
      INNER JOIN penghuni_rumah pr ON r.id = pr.id_rumah 
      LEFT JOIN tagihan t_cek ON r.id = t_cek.id_rumah AND t_cek.id_periode = ?
      WHERE r.status_rumah IN ('Dihuni', 'Renovasi')
      AND pr.aktif = 1
      AND t_cek.id IS NULL
    `;

    const [insertResult] = await connection.query(querySmartInsert, [
      idPeriode,
      jumlah_tagihan,
      id_kategori,
      kodeWaktu,
      jatuhTempo,
      idPeriode,
    ]);

    await connection.commit();

    if (insertResult.affectedRows > 0) {
      res.json({
        message: `Sukses! ${insertResult.affectedRows} tagihan BARU berhasil ditambahkan.`,
      });
    } else {
      res.json({
        message:
          "Data sudah up-to-date. Tidak ada tagihan baru yang perlu dibuat.",
      });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error Generate:", error);
    res.status(500).json({ error: "Gagal generate: " + error.message });
  } finally {
    connection.release();
  }
};

// ============================================================================
// 4. BAYAR TAGIHAN (Manual Admin)
// ============================================================================
export const bayarTagihan = async (req, res) => {
  const { id } = req.params;
  const { nominal_bayar } = req.body;

  try {
    const [tagihan] = await db.query("SELECT * FROM tagihan WHERE id = ?", [
      id,
    ]);
    if (tagihan.length === 0)
      return res.status(404).json({ error: "Tagihan tidak ditemukan" });

    const data = tagihan[0];
    const totalTagihan = parseFloat(data.jumlah);
    const sudahBayar = parseFloat(data.jumlah_terbayar || 0);
    const bayarSekarang = parseFloat(nominal_bayar);

    if (bayarSekarang <= 0)
      return res.status(400).json({ error: "Nominal tidak valid" });
    if (bayarSekarang + sudahBayar > totalTagihan) {
      return res
        .status(400)
        .json({ error: "Pembayaran melebihi sisa tagihan!" });
    }

    const totalBaru = sudahBayar + bayarSekarang;
    let statusBaru = totalBaru >= totalTagihan ? "Lunas" : "Sebagian";

    await db.query(
      "UPDATE tagihan SET jumlah_terbayar = ?, status = ? WHERE id = ?",
      [totalBaru, statusBaru, id]
    );

    res.json({
      message: "Pembayaran berhasil diproses",
      status_akhir: statusBaru,
      sisa_tagihan: totalTagihan - totalBaru,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// 5. HAPUS TAGIHAN
// ============================================================================
export const deleteBill = async (req, res) => {
  try {
    await db.query("DELETE FROM tagihan WHERE id = ?", [req.params.id]);
    res.json({ message: "Tagihan dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// 6. DASHBOARD USER SUMMARY (Fungsi Baru untuk Dashboard Warga)
// ============================================================================
export const getUserBillSummary = async (req, res) => {
  const { id_pengguna } = req.query;
console.log("🔥 REQUEST DASHBOARD Masuk!");
console.log("👉 ID Pengguna yang diminta:", id_pengguna);
  try {
    if (!id_pengguna) {
      return res.status(400).json({ error: "ID Pengguna diperlukan!" });
    }

    const query = `
      SELECT 
        t.id,
        per.nama AS nama_periode,
        (t.jumlah - t.jumlah_terbayar) AS sisa_tagihan
      FROM tagihan t
      JOIN rumah r ON t.id_rumah = r.id
      JOIN penghuni_rumah pr ON r.id = pr.id_rumah
      JOIN periode_penagihan per ON t.id_periode = per.id
      WHERE pr.id_pengguna = ?
        AND pr.aktif = 1
        AND t.status != 'Lunas'
      ORDER BY t.id ASC
    `;

    const [rows] = await db.query(query, [id_pengguna]);

    let totalTunggakan = 0;
    let periodeList = [];

    rows.forEach((row) => {
      totalTunggakan += parseFloat(row.sisa_tagihan);
      periodeList.push(row.nama_periode);
    });

    res.json({
      total_tunggakan: totalTunggakan,
      periode_tunggakan: periodeList,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: error.message });
  }
};
