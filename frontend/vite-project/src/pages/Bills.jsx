import React, { useState, useEffect } from 'react';
import { Printer, Edit, Trash2, Plus, Search, AlertCircle, CheckCircle, X } from 'lucide-react';

export default function Bills() {
  const [tagihanList, setTagihanList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // STATE UNTUK MODAL GENERATE
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nama_periode: '',
    bulan: new Date().getMonth() + 1, // Default bulan ini
    tahun: new Date().getFullYear(),  // Default tahun ini
    jumlah_tagihan: '',
    id_kategori: 1
  });
  const [loadingGen, setLoadingGen] = useState(false);

  // 1. Fetch Data Awal
  useEffect(() => {
    fetchTagihan();
    fetchCategories();
  }, []);

  const fetchTagihan = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tagihan');
      const data = await response.json();
      setTagihanList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal load tagihan:", error);
      setTagihanList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/tagihan/categories'); // Pastikan route ini ada
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      console.log("Gagal load kategori, pakai default.");
    }
  };

  // 2. Logic Generate Tagihan (Fitur Lama Dikembalikan)
  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoadingGen(true);

    try {
      const res = await fetch('http://localhost:3000/api/tagihan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      
      if (res.ok) {
        alert(result.message); // Munculkan pesan sukses dari backend
        setShowModal(false);   // Tutup modal
        fetchTagihan();        // Refresh tabel
      } else {
        alert("Gagal: " + result.error);
      }
    } catch {
      alert("Terjadi kesalahan sistem");
    } finally {
      setLoadingGen(false);
    }
  };

  // 3. Helper Format
  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  
  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // 4. Logic Filter Data
  const safeList = Array.isArray(tagihanList) ? tagihanList : [];
  const filteredData = safeList.filter(item => 
    (item.nama_warga?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Tagihan</h1>
          <p className="text-slate-500 text-sm">Kelola, generate, dan cetak tagihan warga</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Cari warga..." 
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           {/* TOMBOL PEMICU MODAL */}
           <button 
             onClick={() => setShowModal(true)} 
             className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 whitespace-nowrap"
           >
             <Plus size={20} /> Buat Tagihan
           </button>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b">
              <tr>
                <th className="p-4">Warga / Rumah</th>
                <th className="p-4">Periode</th>
                <th className="p-4">Jatuh Tempo</th>
                <th className="p-4">Total Tagihan</th>
                <th className="p-4">Terbayar</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400">Memuat data...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400">Belum ada data tagihan.</td></tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                        <div className="font-bold text-slate-800">{item.nama_warga}</div>
                        <div className="text-xs text-slate-500">{item.blok_rumah} No. {item.no_rumah}</div>
                    </td>
                    <td className="p-4">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
                            {item.bulan} {item.tahun}
                        </span>
                    </td>
                    <td className="p-4 text-slate-600">
                        {item.jatuh_tempo ? formatTanggal(item.jatuh_tempo) : '-'}
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                        {formatRp(item.jumlah)}
                    </td>
                    <td className="p-4">
                        <div className="text-slate-700">{formatRp(item.jumlah_terbayar || 0)}</div>
                        <div className="text-xs text-slate-400">
                           Sisa: {formatRp(item.jumlah - (item.jumlah_terbayar || 0))}
                        </div>
                    </td>
                    <td className="p-4 text-center">
                        {item.status === 'Lunas' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                                <CheckCircle size={12} /> Lunas
                            </span>
                        ) : item.jumlah_terbayar > 0 ? (
                            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                                <AlertCircle size={12} /> Cicilan
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">
                                <AlertCircle size={12} /> Belum
                            </span>
                        )}
                    </td>
                    <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                           <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition">
                             <Printer size={18} />
                           </button>
                           <button className="p-2 text-slate-500 hover:text-orange-500 hover:bg-orange-50 rounded transition">
                             <Edit size={18} />
                           </button>
                           <button className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded transition">
                             <Trash2 size={18} />
                           </button>
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL GENERATE TAGIHAN (POPUP) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold text-slate-800 mb-4">Generate Tagihan Baru</h2>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Periode</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Maret 2026"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                  value={formData.nama_periode}
                  onChange={e => setFormData({...formData, nama_periode: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bulan (Angka)</label>
                  <input 
                    type="number" min="1" max="12" required
                    className="w-full border rounded-lg p-2"
                    value={formData.bulan}
                    onChange={e => setFormData({...formData, bulan: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tahun</label>
                  <input 
                    type="number" min="2024" required
                    className="w-full border rounded-lg p-2"
                    value={formData.tahun}
                    onChange={e => setFormData({...formData, tahun: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Tagihan (Rp)</label>
                <input 
                  type="number" required
                  placeholder="150000"
                  className="w-full border rounded-lg p-2"
                  value={formData.jumlah_tagihan}
                  onChange={e => setFormData({...formData, jumlah_tagihan: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                <select 
                  className="w-full border rounded-lg p-2 bg-white"
                  value={formData.id_kategori}
                  onChange={e => setFormData({...formData, id_kategori: e.target.value})}
                >
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nama}</option>
                    ))
                  ) : (
                    <option value="1">IPL (Default)</option>
                  )}
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loadingGen}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-indigo-300 transition"
                >
                  {loadingGen ? 'Sedang Memproses...' : 'Generate Tagihan Massal'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}