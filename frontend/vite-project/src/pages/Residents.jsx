import React, { useState, useEffect } from 'react';
import { Plus, Search, User, Home } from 'lucide-react';
import ModalTambahWarga from './ModalTambahWarga'; // Pastikan path import ini sesuai struktur folder Anda

export default function Residents() {
  const [wargaList, setWargaList] = useState([]);
  const [showModal, setShowModal] = useState(false); // Default: Modal Tertutup
  const [loading, setLoading] = useState(true);

  // 1. PINDAHKAN FETCH KE DALAM USEEFFECT (Solusi Error ESLint)
  useEffect(() => {
    const fetchWarga = async () => {
      try {
        // Ganti URL ini jika backend Anda menggunakan port/path berbeda
        const response = await fetch('http://localhost:3000/api/warga'); 
        const data = await response.json();
        
        if (Array.isArray(data)) {
            setWargaList(data);
        } else {
            console.error("Data bukan array:", data);
            setWargaList([]);
        }
      } catch (err) {
        console.error("Gagal ambil data warga:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarga();
  }, []); // Dependency array kosong = jalan sekali saat load

  // Helper function untuk refresh setelah tambah data
  const handleRefresh = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/warga');
        const data = await response.json();
        setWargaList(Array.isArray(data) ? data : []);
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
         <div>
            <h1 className="text-2xl font-bold text-slate-800">Data Warga</h1>
            <p className="text-slate-500 text-sm">Manajemen penghuni perumahan</p>
         </div>
         
         <div className="flex gap-3 w-full md:w-auto">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={20}/>
                <input 
                  type="text" 
                  placeholder="Cari nama atau nomor rumah..." 
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                />
             </div>
             {/* TOMBOL PEMICU MODAL (Ubah state jadi true) */}
             <button 
               onClick={() => setShowModal(true)} 
               className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
             >
               <Plus size={20} /> Tambah Warga
             </button>
         </div>
      </div>

      {/* List Card Warga */}
      {loading ? (
        <div className="text-center py-10 text-slate-400">Memuat data warga...</div>
      ) : wargaList.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-300 rounded-xl">
            <p className="text-slate-500">Belum ada data warga.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wargaList.map((warga, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
               <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-100 text-indigo-700 font-bold rounded-lg w-12 h-12 flex items-center justify-center text-lg">
                    {warga.blok_rumah ? warga.blok_rumah : "?"}
                    {warga.no_rumah}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${warga.status_rumah === 'Dihuni' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {warga.status_rumah || 'Dihuni'}
                  </span>
               </div>
               
               <h3 className="text-lg font-bold text-slate-800 mb-1">{warga.nama_warga || warga.nama}</h3>
               <p className="text-slate-500 text-sm mb-4">{warga.posisi || 'Penghuni'}</p>
               
               <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                     <User size={16} className="text-slate-400" /> 
                     <span>{warga.nohp || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Home size={16} className="text-slate-400" /> 
                     <span>Blok {warga.blok_rumah} No. {warga.no_rumah}</span>
                  </div>
               </div>

               <button className="mt-4 w-full py-2 text-indigo-600 font-bold text-sm hover:bg-indigo-50 rounded-lg transition">
                 Detail Profil
               </button>
            </div>
          ))}
        </div>
      )}

      {/* --- RENDER MODAL SESUAI KONDISI --- */}
      {showModal && (
        <ModalTambahWarga 
          onClose={() => setShowModal(false)} // Tutup saat tombol Batal diklik
          onSuccess={() => {
            setShowModal(false); // Tutup saat sukses
            handleRefresh();     // Refresh data otomatis
          }} 
        />
      )}

    </div>
  );
}