import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react';

export default function Finance() {
  const [data, setData] = useState({ 
      total_masuk: 0, 
      total_keluar: 0, 
      saldo_akhir: 0, 
      history_pengeluaran: [] 
  });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ judul: '', kategori: 'Operasional', jumlah: '', tanggal: '' });
  
  // 1. SOLUSI: State Pemicu (Refresh Key)
  // Kita pakai angka. Setiap kali angka berubah -> useEffect jalan ulang.
  const [refreshKey, setRefreshKey] = useState(0);

  // 2. SOLUSI: Definisikan fetch DI DALAM useEffect
  // Ini cara paling aman agar tidak ada error dependensi
  useEffect(() => { 
    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/finance/summary');
            const result = await res.json();
            if (res.ok) setData(result);
        } catch (error) {
            console.error("Gagal ambil data:", error);
        }
    };

    fetchData();
  }, [refreshKey]); // <--- Dependensinya hanya 'refreshKey'. Sangat stabil.

  const handleSimpan = async (e) => {
    e.preventDefault();
    if(!confirm("Simpan pengeluaran ini?")) return;

    try {
        const response = await fetch('http://localhost:3000/api/finance/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        });

        if(response.ok) {
            setShowModal(false);
            
            // 3. SOLUSI: Trigger Refresh dengan mengubah key (+1)
            setRefreshKey(old => old + 1);
            
            setForm({ judul: '', kategori: 'Operasional', jumlah: '', tanggal: '' }); 
        } else {
            alert("Gagal menyimpan data");
        }
    } catch (error) {
        console.error(error);
    }
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Keuangan</h1>
          <p className="text-slate-500 text-sm">Rekap Arus Kas (Pemasukan vs Pengeluaran)</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
            <Plus size={18}/> Catat Pengeluaran
        </button>
      </div>

      {/* 3 KARTU UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg"><TrendingUp className="text-green-600"/></div>
                <span className="text-slate-500 text-sm font-bold">Total Pemasukan (Tagihan)</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{formatRp(data.total_masuk)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-red-100 p-2 rounded-lg"><TrendingDown className="text-red-600"/></div>
                <span className="text-slate-500 text-sm font-bold">Total Pengeluaran</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{formatRp(data.total_keluar)}</h3>
        </div>

        <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className="bg-white/20 p-2 rounded-lg"><Wallet className="text-white"/></div>
                <span className="text-indigo-200 text-sm font-bold">Sisa Saldo Kas</span>
            </div>
            <h3 className="text-3xl font-bold relative z-10">{formatRp(data.saldo_akhir)}</h3>
            <div className="absolute -right-5 -bottom-10 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-50"></div>
        </div>
      </div>

      {/* TABEL PENGELUARAN */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-700">Riwayat Pengeluaran Terakhir</h3>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                <tr>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Keterangan</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4 text-right">Nominal</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {data.history_pengeluaran.length > 0 ? (
                    data.history_pengeluaran.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                            <td className="p-4">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                            <td className="p-4 font-medium text-slate-800">{item.judul}</td>
                            <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{item.kategori}</span></td>
                            <td className="p-4 text-right text-red-600 font-bold">- {formatRp(item.jumlah)}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="p-8 text-center text-gray-400">Belum ada data pengeluaran</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>

      {/* MODAL INPUT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Catat Pengeluaran Baru</h3>
                <form onSubmit={handleSimpan} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500">Judul Pengeluaran</label>
                        <input required type="text" className="w-full border p-2 rounded" 
                            value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} placeholder="Misal: Beli Sapu Lidi" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-xs font-bold text-slate-500">Kategori</label>
                             <select className="w-full border p-2 rounded" value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}>
                                <option>Operasional</option>
                                <option>Gaji</option>
                                <option>Perbaikan</option>
                                <option>Lainnya</option>
                             </select>
                        </div>
                        <div>
                             <label className="text-xs font-bold text-slate-500">Tanggal</label>
                             <input required type="date" className="w-full border p-2 rounded" 
                                value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})}/>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500">Nominal (Rp)</label>
                        <input required type="number" className="w-full border p-2 rounded font-bold text-red-600" 
                            value={form.jumlah} onChange={e => setForm({...form, jumlah: e.target.value})} placeholder="0" />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setShowModal(false)} className="w-full bg-slate-200 py-2 rounded font-bold">Batal</button>
                        <button className="w-full bg-indigo-600 text-white py-2 rounded font-bold">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}