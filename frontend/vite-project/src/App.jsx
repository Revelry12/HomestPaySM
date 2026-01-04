import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom'; // Tambah Outlet
import { Bell } from 'lucide-react';

// Import Halaman
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Bills from './pages/Bills';
import Residents from './pages/Residents';
import Houses from './pages/Houses'; 
import LoginWarga from './pages/warga/loginWarga'; // Pastikan nama file/folder benar (case sensitive)
import DashboardWarga from './pages/warga/DashboardWarga';
import BankSimulator from './pages/BankSimulator';
import Finance from './pages/Finance';

// --- KOMPONEN 1: HEADER ADMIN (Hanya helper) ---
const Header = () => {
  const location = useLocation();
  
  // 1. Ambil Data Admin dari LocalStorage
  // Kita gunakan JSON.parse dengan "Safety Check" (||) agar tidak error jika kosong
  const adminData = JSON.parse(localStorage.getItem('adminData')) || { 
    nama: 'Admin',
  };

  const getTitle = (path) => {
    switch(path) {
      case '/': return 'Overview';
      case '/warga': return 'Data Warga';
      case '/tagihan': return 'Manajemen Tagihan';
      case '/admin/houses': return 'Master Data Rumah';
      case '/finance': return 'Keuangan';
      default: return 'Dashboard';
    }
  };

  // Fungsi Logout Sederhana (Opsional)
  const handleLogout = () => {
    if(window.confirm("Keluar dari akun admin?")) {
        localStorage.removeItem('adminData');
        window.location.reload(); // Reload agar kembali ke state awal
    }
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 capitalize">
          {getTitle(location.pathname)}
        </h1>
        <p className="text-slate-500 text-sm">Sistem Manajemen Tagihan Perumahan</p>
      </div>
      
      <div className="flex gap-3">
        <button className="bg-white p-2 rounded-full border border-slate-200 text-slate-500 hover:text-indigo-600 transition">
          <Bell size={20} />
        </button>
        
        {/* Bagian Info Admin & Avatar */}
        <div 
            className="flex items-center gap-3 pl-4 border-l cursor-pointer group"
            onClick={handleLogout} 
            title="Klik untuk Logout"
        >
          <div className="text-right hidden lg:block">
              {/* Tampilkan Nama dari Variable */}
              <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition">
                {adminData.nama}
              </p>
              {/* Tampilkan Role (Opsional) */}
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                {adminData.role}
              </p>
          </div>
          
          {/* Avatar Dinamis berdasarkan Nama */}
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminData.nama}`} 
            className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 group-hover:border-indigo-200 transition" 
            alt="Admin"
          />
        </div>
        {/* --------------------- */}

      </div>
    </header>
  );
};

// --- KOMPONEN 2: LAYOUT ADMIN (PENTING!) ---
// Ini berfungsi membungkus halaman Admin agar punya Sidebar & Header
const LayoutAdmin = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC] font-sans text-slate-800">
      <Sidebar /> {/* Sidebar hanya muncul di Layout ini */}
      <main className="flex-1 md:ml-64 p-8">
        <Header /> {/* Header hanya muncul di Layout ini */}
        
        {/* Outlet adalah tempat Halaman Admin (Dashboard/Tagihan/dll) dirender */}
        <Outlet /> 
      </main>
    </div>
  );
};

// --- KOMPONEN UTAMA: APP ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
    
        <Route path="/warga/login" element={<LoginWarga />} />
        <Route path="/warga/dashboard" element={<DashboardWarga />} />
        <Route path="/bank-simulator" element={<BankSimulator />} />


 
        <Route element={<LayoutAdmin />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/warga" element={<Residents />} />
            <Route path="/tagihan" element={<Bills />} />
            <Route path="/admin/houses" element={<Houses />} />
            <Route path="/finance" element={<Finance />} /> 
        </Route>

      </Routes>
    </BrowserRouter>
  );
}