import React, { useEffect, useState } from 'react';
import { Wallet, AlertCircle, Home } from 'lucide-react';

const Dashboard = () => {
  // State untuk menyimpan data statistik
  const [stats, setStats] = useState({
    income: 0,
    pending: 0,
    occupied: 0
  });
  const [loading, setLoading] = useState(true);

  // Fungsi Fetch Data dari Backend
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/dashboard/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Helper Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <div>
      {/* SECTION 1: STATISTIK UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Total Pemasukan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600">
              <Wallet size={24} />
            </div>
            <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded-lg">
              Total Uang Masuk
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-1">Total Pemasukan</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {loading ? "..." : formatRupiah(stats.income)}
          </h3>
        </div>

        {/* Card 2: Belum Lunas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-red-100 p-3 rounded-xl text-red-600">
              <AlertCircle size={24} />
            </div>
            <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">
              Tunggakan
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-1">Belum Lunas</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {loading ? "..." : formatRupiah(stats.pending)}
          </h3>
        </div>

        {/* Card 3: Rumah Terisi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <Home size={24} />
            </div>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg">
              Hunian
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-1">Rumah Terisi</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {loading ? "..." : `${stats.occupied} Unit`}
          </h3>
        </div>
      </div>

      {/* SECTION 2: AREA WELCOME */}
      <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Selamat Datang, Admin!</h2>
          <p className="text-indigo-200 max-w-xl">
            HIDUP JOKOWI!!!
          </p>
        </div>
        
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default Dashboard;