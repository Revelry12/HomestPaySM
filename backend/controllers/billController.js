import db from "../config/db.js";

// 1. Ambil Semua Tagihan (UPDATE: Tambah nomor_va)
// backend/controllers/billController.js

// backend/controllers/billController.js

export const getBills = async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id, 
        t.jumlah, 
        t.status, 
        t.nomor_va,
        COALESCE(r.blok_rumah, '-') AS blok_rumah, 
        COALESCE(r.no_rumah, '-') AS no_rumah, 
        COALESCE(p.nama, 'Belum Ada Penghuni') AS nama_penghuni, 
        COALESCE(per.nama, 'Periode ???') AS nama_periode,
        
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
    res.json(rows);

  } catch (error) {
    console.error("Error Get Bills:", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Ambil Kategori
export const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kategori_tagihan");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Generate Tagihan Massal (UPDATE: Generate VA Otomatis)
// backend/controllers/billController.js

// backend/controllers/billController.js

export const generateBills = async (req, res) => {
  const { nama_periode, bulan, tahun, jumlah_tagihan, id_kategori } = req.body;
  
  const connection = await db.getConnection(); // Gunakan connection untuk transaksi aman

  try {
    await connection.beginTransaction();

    // 1. SETUP TANGGAL
    const tglAwal = `${tahun}-${bulan}-01`;
    const lastDay = new Date(tahun, bulan, 0).getDate();
    const tglAkhir = `${tahun}-${bulan}-${lastDay}`;
    const kodeWaktu = `${tahun}${bulan.toString().padStart(2, '0')}`; // 202603

    // -------------------------------------------------------------
    // 2. CEK PERIODE (Mencegah Periode Ganda)
    // -------------------------------------------------------------
    let idPeriode;
    
    // Cari apakah periode dengan nama ini sudah ada?
    const [existingPeriod] = await connection.query(
      'SELECT id FROM periode_penagihan WHERE nama = ?', 
      [nama_periode]
    );

    if (existingPeriod.length > 0) {
        // JIKA SUDAH ADA: Pakai ID yang lama
        idPeriode = existingPeriod[0].id;
        console.log(`Periode '${nama_periode}' sudah ada. Menggunakan ID: ${idPeriode}`);
    } else {
        // JIKA BELUM ADA: Buat baru
        const [newPeriod] = await connection.query(
          'INSERT INTO periode_penagihan (nama, tanggal_awal, tanggal_akhir, aktif) VALUES (?, ?, ?, 1)',
          [nama_periode, tglAwal, tglAkhir]
        );
        idPeriode = newPeriod.insertId;
        console.log(`Membuat Periode Baru: ${idPeriode}`);
    }

    // -------------------------------------------------------------
    // 3. SMART INSERT (Mencegah Tagihan Ganda)
    // -------------------------------------------------------------
    // Logika: 
    // Ambil Rumah (Dihuni & Ada Warga)
    // LEFT JOIN ke tabel Tagihan untuk cek apakah sudah pernah ditagih di periode ini
    // WHERE t_cek.id IS NULL (Artinya: Hanya ambil yang BELUM ada tagihannya)
    
    const querySmartInsert = `
      INSERT INTO tagihan (id_periode, id_rumah, jumlah, status, id_kategori, nomor_va)
      SELECT 
        ? AS id_periode, 
        r.id AS id_rumah, 
        ? AS jumlah, 
        'Belum Bayar' AS status,
        ? AS id_kategori,
        CONCAT('8800', ?, LPAD(r.id, 4, '0')) AS nomor_va 
      FROM rumah r
      INNER JOIN penghuni_rumah pr ON r.id = pr.id_rumah 
      -- JOIN UNTUK CEK DUPLIKASI:
      LEFT JOIN tagihan t_cek ON r.id = t_cek.id_rumah AND t_cek.id_periode = ?
      WHERE r.status_rumah IN ('Dihuni', 'Renovasi')
      AND pr.aktif = 1
      AND t_cek.id IS NULL  -- <--- KUNCI AJAIBNYA DISINI (Hanya insert jika tagihan belum ada)
    `;

    // Perhatikan parameter terakhir (?) adalah idPeriode untuk pengecekan
    const [insertResult] = await connection.query(querySmartInsert, [
        idPeriode, 
        jumlah_tagihan, 
        id_kategori, 
        kodeWaktu, 
        idPeriode // Parameter untuk LEFT JOIN t_cek
    ]);

    await connection.commit();

    // 4. RESPON
    if (insertResult.affectedRows > 0) {
        res.json({ message: `Sukses! ${insertResult.affectedRows} tagihan BARU berhasil ditambahkan.` });
    } else {
        // Jika 0, berarti semua warga sudah punya tagihan
        res.json({ message: "Data sudah up-to-date. Tidak ada tagihan baru yang perlu dibuat." });
    }

  } catch (error) {
    await connection.rollback();
    console.error("Error Generate:", error);
    res.status(500).json({ error: "Gagal generate: " + error.message });
  } finally {
    connection.release();
  }
};
