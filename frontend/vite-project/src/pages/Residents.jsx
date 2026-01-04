import React, { useState, useEffect } from 'react';
import { Search, UserPlus, X, Loader } from 'lucide-react';

export default function Residents() {
  const [residents, setResidents] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State Form Input
  const [formData, setFormData] = useState({
    block: '', number: '', owner: '', phone: '', status: 'Dihuni', type: 'Pemilik Tetap'
  });

  // --- 1. FETCH DATA DARI DATABASE ---
  const fetchWarga = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/warga');
      const data = await response.json();
      setResidents(data); // Simpan data asli ke state
    } catch (error) {
      console.error("Gagal ambil data:", error);
      // Jangan alert di sini agar tidak mengganggu saat loading awal
    } finally {
      setIsLoading(false);
    }
  };

  // Jalankan fetch saat halaman pertama dibuka
  useEffect(() => {
    fetchWarga();
  }, []);

  // Handle Input Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- 2. LOGIC SIMPAN KE DATABASE (Versi Strict/Jujur) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi Input
    if (!formData.block || !formData.number || !formData.owner) {
      alert("Mohon lengkapi Blok, Nomor, dan Nama Pemilik!");
      return;
    }

    try {
      // Kirim ke Backend
      const response = await fetch('http://localhost:3000/api/warga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Cek Sukses/Gagal
      if (response.ok) {
        alert("✅ SUKSES! Data tersimpan di Database MySQL.");
        setIsModalOpen(false);
        setFormData({ block: '', number: '', owner: '', phone: '', status: 'Dihuni', type: 'Pemilik Tetap' });
        
        // Refresh tabel otomatis
        fetchWarga(); 
      } else {
        // Tampilkan pesan error spesifik dari Backend (misal: Rumah tidak ditemukan)
        alert("❌ GAGAL: " + (result.error || "Terjadi kesalahan di server"));
      }
    } catch (error) {
      console.error("Error Koneksi:", error);
      alert("⚠️ ERROR KONEKSI: Pastikan Server Backend (node index.js) sudah jalan!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
           <input type="text" placeholder="Cari nama atau nomor rumah..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 outline-none"/>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200 transition-transform active:scale-95"
        >
           <UserPlus size={18}/> Tambah Warga
        </button>
      </div>

      {/* Loading State & Data Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20 text-slate-400 gap-2">
          <Loader className="animate-spin" /> Memuat Data dari Database...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {residents.map((res, index) => (
             /* Gunakan index sebagai key fallback jika id null */
             <div key={res.id || index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {res.blok_rumah}{res.no_rumah}
                   </div>
                   <span className={`text-xs px-2 py-1 rounded-full border ${
                      res.status_rumah === 'Dihuni' ? 'bg-green-50 border-green-100 text-green-600' : 
                      res.status_rumah === 'Kosong' ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-yellow-50 border-yellow-100 text-yellow-600'
                   }`}>{res.status_rumah || 'Kosong'}</span>
                </div>
                
                <h3 className="font-bold text-slate-800 text-lg">{res.nama_penghuni || '-'}</h3>
                <p className="text-slate-500 text-sm mb-4">{res.tipe_warga || 'Belum ada penghuni'}</p>
                
                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                   <span className="text-xs text-slate-400">{res.nohp || '-'}</span>
                   <button className="text-indigo-600 text-sm font-medium hover:underline">Detail</button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Tambah Warga Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Blok</label>
                  <input name="block" value={formData.block} onChange={handleInputChange} type="text" placeholder="Cth: A" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Nomor</label>
                  <input name="number" value={formData.number} onChange={handleInputChange} type="text" placeholder="Cth: 12" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Nama Pemilik / Penghuni</label>
                <input name="owner" value={formData.owner} onChange={handleInputChange} type="text" placeholder="Nama Lengkap" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Nomor HP</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} type="text" placeholder="08..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Status Rumah</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
                      <option value="Dihuni">Dihuni</option>
                      <option value="Kosong">Kosong</option>
                      <option value="Renovasi">Renovasi</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Tipe Warga</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
                      <option value="Pemilik Tetap">Pemilik Tetap</option>
                      <option value="Penyewa">Penyewa</option>
                    </select>
                 </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition">Batal</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}