import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, Calendar, AlertTriangle } from 'lucide-react'; // Tambah AlertTriangle
import { useNavigate } from 'react-router-dom';
import ModalBayar from '../../components/ModalBayar'; // 1. IMPORT MODAL

export default function DashboardWarga() {
  const [stats, setStats] = useState({
    total_tagihan: 0,
    rumah_info: '',
    rincian: [],
    id_rumah: null
  });

  const [userData, setUserData] = useState(null); // Simpan data user lengkap
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // 2. STATE MODAL
  
  const navigate = useNavigate();

  // FUNGSI FETCH DATA (Dipisah biar bisa dipanggil ulang setelah bayar)
  const fetchDashboard = useCallback(async () => {
      try {
        const userString = localStorage.getItem('wargaData');
        if (!userString) { navigate('/login'); return; }

        const user = JSON.parse(userString);
        setUserData(user); // Simpan ke state

        const response = await fetch(`http://localhost:3000/api/warga/stats/${user.id}`);
        const data = await response.json();

        if (response.ok) {
          setStats({
             total_tagihan: parseInt(data.total_tagihan) || 0,
             rumah_info: data.rumah_info || '-',
             rincian: Array.isArray(data.rincian) ? data.rincian : [],
             id_rumah: data.id_rumah 
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
  },[navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* 3. PASANG KOMPONEN MODAL DISINI */}
      <ModalBayar 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        tagihan={stats.total_tagihan}
        user={userData}
        idRumah={stats.id_rumah}
        onSuccess={fetchDashboard} // Refresh data kalau sukses bayar
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Warga</h1>
        <p className="text-slate-500">Halo, <span className="font-bold text-indigo-600">{userData?.nama} 👋</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* KARTU 1: TOTAL TAGIHAN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between">
           <div>
               <div className="flex justify-between items-start mb-4">
                  <div>
                     <p className="text-slate-500 text-sm font-medium mb-1">Total Tagihan Aktif</p>
                     <h2 className="text-4xl font-bold text-slate-800">
                        Rp {(stats.total_tagihan).toLocaleString('id-ID')}
                     </h2>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                     <Wallet size={24} />
                  </div>
               </div>

               {stats.total_tagihan === 0 ? (
                  <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full">
                     ✅ Tidak ada tunggakan
                  </div>
               ) : (
                  <div className="inline-flex items-center gap-2 text-rose-600 text-sm font-bold bg-rose-50 px-3 py-1 rounded-full animate-pulse">
                     <AlertTriangle size={16}/> Segera lakukan pembayaran
                  </div>
               )}
               
               <p className="mt-4 text-xs text-slate-400">
                  Unit: {stats.rumah_info}
               </p>
           </div>

           {/* 4. TOMBOL BAYAR SEKARANG */}
           {stats.total_tagihan > 0 && (
             <button 
               onClick={() => setIsModalOpen(true)}
               className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex justify-center items-center gap-2"
             >
                <Wallet size={18} />
                Bayar Sekarang via Virtual Account
             </button>
           )}
        </div>

        {/* KARTU 2: RINCIAN BULAN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                 <Calendar size={20} />
              </div>
              <div>
                 <h3 className="font-bold text-slate-800">Rincian Bulan</h3>
                 <p className="text-xs text-slate-400">Periode yang harus dibayar</p>
              </div>
           </div>

           {loading ? (
              <p className="text-slate-400 text-sm animate-pulse">Sedang memuat data...</p>
           ) : stats.rincian.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-xl">
                 Belum ada rincian tagihan.
              </div>
           ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                 {stats.rincian.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                       <span className="font-bold text-slate-700">{item.bulan}</span>
                       <span className="font-bold text-indigo-600">
                          Rp {parseInt(item.jumlah).toLocaleString('id-ID')}
                       </span>
                    </div>
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
}