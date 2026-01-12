// File: src/pages/ModalTambahWarga.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, Home, User } from 'lucide-react'; // Pastikan install lucide-react

export default function ModalTambahWarga({ onClose, onSuccess }) {
  const [emptyHouses, setEmptyHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: '',
    nohp: '',
    password: '123', // Default password
    id_rumah: '',    // PENTING: ID Rumah dari Dropdown
    kuasa: 'Tetap'
  });

  // 1. Ambil Data Rumah Kosong saat Modal Dibuka
// 1. Ambil Data Rumah Kosong saat Modal Dibuka
  useEffect(() => {
    let isMounted = true; // Pengaman untuk menghindari memory leak

    const fetchHouses = async () => {
      try {
        // Tambahkan timestamp atau cache-breaker jika perlu agar browser tidak ambil data lama
        const res = await fetch('http://localhost:3000/api/rumah/available?t=' + Date.now());
        const data = await res.json();
        
        if (isMounted) {
          setEmptyHouses(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Gagal load rumah kosong:", err);
      }
    };

    fetchHouses();
    
    return () => { isMounted = false; };
  }, []); // [] berarti dijalankan 1x setiap modal ini di-mount (muncul)

  // 2. Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/warga/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Berhasil! Warga ditambahkan.");
        onSuccess(); // Refresh data di halaman induk
      } else {
        alert("Gagal: " + (result.error || result.message));
      }
    } catch {
      alert("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Tambah Warga Baru</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Input Nama */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Lengkap</label>
            <div className="relative">
                <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                  type="text" required 
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={e => setFormData({...formData, nama: e.target.value})}
                />
            </div>
          </div>

          {/* Input No HP */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">WhatsApp / No. HP</label>
            <input 
              type="number" required 
              placeholder="08..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={e => setFormData({...formData, nohp: e.target.value})}
            />
          </div>

          <hr className="border-slate-100 my-2"/>

          {/* Dropdown Rumah Kosong */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pilih Rumah Kosong</label>
            <div className="relative">
                <Home className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <select 
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  onChange={e => setFormData({...formData, id_rumah: e.target.value})}
                  defaultValue=""
                >
                  <option value="" disabled>-- Pilih Unit --</option>
                  {emptyHouses.length > 0 ? (
                    emptyHouses.map(r => (
                      <option key={r.id} value={r.id}>
                        Blok {r.blok_rumah} No. {r.no_rumah}
                      </option>
                    ))
                  ) : (
                    <option disabled>Tidak ada rumah kosong</option>
                  )}
                </select>
            </div>
            <p className="text-xs text-slate-400 mt-1">*Hanya menampilkan rumah yang belum dihuni.</p>
          </div>

          {/* Dropdown Status */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status Kepemilikan</label>
            <select 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={e => setFormData({...formData, kuasa: e.target.value})}
            >
               <option value="Tetap">Pemilik Tetap</option>
               <option value="Penyewa">Penyewa / Kontrak</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-4 flex gap-3">
             <button 
               type="button" onClick={onClose}
               className="flex-1 py-2.5 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition"
             >
               Batal
             </button>
             <button 
               type="submit" 
               disabled={loading}
               className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2"
             >
               {loading ? 'Menyimpan...' : <><Save size={18}/> Simpan Data</>}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}