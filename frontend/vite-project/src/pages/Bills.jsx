import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]); // <--- STATE BARU UTK KATEGORI
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
    jumlah: 150000,
    id_kategori: '' // <--- STATE BARU
  });

  // 1. FETCH DATA (TAGIHAN + KATEGORI)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Panggil 2 API sekaligus
      const [resBills, resCats] = await Promise.all([
        fetch('http://localhost:3000/api/tagihan'),
        fetch('http://localhost:3000/api/tagihan/categories') // <--- Route baru
      ]);

      const dataBills = await resBills.json();
      const dataCats = await resCats.json();

      if (resBills.ok) setBills(Array.isArray(dataBills) ? dataBills : []);
      
      if (resCats.ok && Array.isArray(dataCats)) {
        setCategories(dataCats);
        // Otomatis pilih kategori pertama sebagai default
        if (dataCats.length > 0) {
          setGenerateForm(prev => ({ ...prev, id_kategori: dataCats[0].id }));
        }
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

const handleGenerate = async (e) => {
    e.preventDefault();
    
    // 1. Validasi Ketersediaan Data
    if (!categories || categories.length === 0) {
        alert("Data Kategori belum siap (masih loading). Tunggu sebentar...");
        return;
    }

    if (!generateForm.id_kategori) {
        alert("Pilih Jenis Tagihan dulu!");
        return;
    }

    // 2. LOGIKA STRUKTURAL: Cari Data yang Cocok
    // Kita gunakan String() agar "1" (String) cocok dengan 1 (Number)
    const selectedCat = categories.find(c => String(c.id) === String(generateForm.id_kategori));

    // 3. VALIDASI KRITIS (Cegah "Undefined")
    if (!selectedCat) {
        // Jika ID dipilih tapi datanya ga ketemu -> ERROR
        alert(`Error Sistem: Kategori dengan ID ${generateForm.id_kategori} tidak ditemukan di database.`);
        return; 
    }

    // 4. SMART PROPERTY DETECTION (Solusi Inti)
    // Cek satu-satu: Apakah namanya tersimpan di kolom 'nama_kategori'? Atau 'nama'? Atau 'jenis'?
    const realName = selectedCat.nama_kategori || selectedCat.nama || selectedCat.jenis || selectedCat.title;

    if (!realName) {
        // Jika datanya ketemu TAPI namanya kosong/null
        alert("Data Kategori ditemukan, tapi kolom Namanya kosong/salah. Cek Database!");
        console.log("Objek Kategori Bermasalah:", selectedCat);
        return;
    }

    // 5. Susun Nama Periode (Sudah Pasti Aman)
    const namaBulan = new Date(generateForm.tahun, generateForm.bulan - 1).toLocaleString('id-ID', { month: 'long' });
    const namaPeriode = `${realName} - ${namaBulan} ${generateForm.tahun}`;

    // -------------------------------------------------------------

    if(!window.confirm(`Yakin generate tagihan: ${namaPeriode}?`)) return;

    try {
      const response = await fetch('http://localhost:3000/api/tagihan/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama_periode: namaPeriode, 
            bulan: generateForm.bulan,
            tahun: generateForm.tahun,
            jumlah_tagihan: generateForm.jumlah,
            id_kategori: generateForm.id_kategori 
          }),
      });

      const result = await response.json();

      if(response.ok) {
        alert(result.message);
        setIsModalOpen(false);
        fetchData(); 
      } else {
        alert("Gagal: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error koneksi server.");
    }
  };

  // Fungsi untuk memproses pembayaran
  const handlePay = async (id, namaWarga) => {
    // Tanya user metode bayar (Simpel dulu pakai prompt browser)
    const metode = window.prompt(`Konfirmasi pembayaran untuk ${namaWarga}?\nKetik metode bayar (Tunai/Transfer):`, "Tunai");
    
    if (metode === null) return; // Kalau cancel

    try {
      const res = await fetch('http://localhost:3000/api/pembayaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_tagihan: id,
          metode_bayar: metode
        })
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        fetchData(); // Refresh data agar status jadi Lunas
      } else {
        alert("Gagal: " + result.error);
      }
    } catch {
      alert("Error koneksi server");
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200"
           >
             <Plus size={16}/> Generate Tagihan
           </button>
      </div>

      {/* Tabel Tagihan */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Rumah & Warga</th>
              <th className="px-6 py-4">Periode</th>
              <th className="px-6 py-4">Nominal</th>
              <th className="px-6 py-4">Virtual Account</th>
              <th className="px-6 py-4">Status</th>
              
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
               <tr><td colSpan="4" className="text-center py-8 text-slate-400">Memuat data...</td></tr>
            ) : bills.length === 0 ? (
               <tr><td colSpan="4" className="text-center py-8 text-slate-400">Belum ada tagihan. Silakan Generate.</td></tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{bill.blok_rumah}-{bill.no_rumah}</div>
                    <div className="text-xs text-slate-500">{bill.nama_penghuni || 'Tanpa Nama'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">{bill.nama_periode}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    Rp {Number(bill.jumlah).toLocaleString('id-ID')}
                  </td>
                  
                  <td className="px-6 py-4 font-mono text-slate-500 text-sm font-bold">
        {bill.nomor_va || '-'}
      </td>
                  <td className="px-6 py-4">
                   {bill.status === 'Lunas' ? (
                      // Lunas : Tampilkan Label Lunas
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        <CheckCircle size={12}/> Lunas
                      </span>
                    ) : (
                      // JIKA BELUM BAYAR: Tampilkan Tombol Bayar
                      <button 
                        onClick={() => handlePay(bill.id, bill.nama_penghuni)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-md shadow-indigo-200"
                      >
                        <AlertCircle size={12}/> Atur Tagihan
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Generate Tagihan</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400"/></button>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Jenis Tagihan</label>
                
                <div className="w-full border p-2 rounded-lg bg-slate-100 text-slate-600 font-medium cursor-not-allowed flex items-center justify-between">
                  
                  {/* LOGIKA DINAMIS: Cek segala kemungkinan nama kolom */}
                  <span className="truncate">
                    {categories.length > 0 
                      ? (
                          categories[0].nama_kategori ||  // Coba cari kolom 'nama_kategori'
                          categories[0].nama ||           // Jika gak ada, coba cari 'nama'
                          categories[0].jenis ||          // Jika gak ada, coba cari 'jenis'
                          categories[0].title ||          // Jika gak ada, coba cari 'title'
                          'IPL (Tanpa Nama)'              // Menyerah, pakai default
                        ) 
                      : 'Memuat data...'}                 {/* Tampil saat loading */}
                  </span>
                  
                  <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-500 whitespace-nowrap ml-2">
                    Default
                  </span>
                </div>

                {/* Debugging (Opsional: Hapus baris ini nanti) */}
                {/* <pre className="text-[10px] text-red-500">{JSON.stringify(categories[0])}</pre> */}
              </div>
              {/* ----------------------------------- */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Bulan</label>
                    <select 
                      className="w-full border p-2 rounded-lg"
                      value={generateForm.bulan}
                      onChange={(e) => setGenerateForm({...generateForm, bulan: e.target.value})}
                    >
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={i+1}>{new Date(0, i).toLocaleString('id-ID', {month:'long'})}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tahun</label>
                    <input 
                      type="number" 
                      className="w-full border p-2 rounded-lg"
                      value={generateForm.tahun}
                      onChange={(e) => setGenerateForm({...generateForm, tahun: e.target.value})}
                    />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nominal (Rp)</label>
                <input 
                  type="number" 
                  className="w-full border p-2 rounded-lg"
                  value={generateForm.jumlah}
                  onChange={(e) => setGenerateForm({...generateForm, jumlah: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 mt-2">
               Buat Tagihan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}