import React from 'react';
import { Home, Users, Receipt, Wallet, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // Import Link & useLocation

export default function Sidebar() {
  const location = useLocation(); // Untuk cek menu mana yang aktif
  const currentPath = location.pathname;

  // Fungsi helper untuk styling menu aktif
  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm";
    // Jika URL sama dengan path, beri warna ungu (aktif)
    if (currentPath === path) {
      return `${baseClass} bg-indigo-600 text-white shadow-lg shadow-indigo-200`;
    }
    // Jika tidak, warna abu-abu biasa
    return `${baseClass} text-slate-500 hover:bg-white hover:text-indigo-600`;
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 z-50 hidden md:block">
      <div className="p-6">
        <div className="flex items-center gap-3 text-indigo-700 mb-8">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">HomestPay</span>
        </div>

        <nav className="space-y-2">
          {/* Ganti button onClick menjadi Link to */}
          
          <Link to="/" className={getLinkClass('/')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/warga" className={getLinkClass('/warga')}>
            <Users size={20} />
            <span>Data Warga</span>
          </Link>

          <Link to="/tagihan" className={getLinkClass('/tagihan')}>
            <Receipt size={20} />
            <span>Tagihan</span>
          </Link>

          {/* MENU BARU: DATA RUMAH */}
          <Link to="/admin/houses" className={getLinkClass('/admin/houses')}>
            <Home size={20} />
            <span>Data Rumah</span>
          </Link>

          <Link to="/finance" className={getLinkClass('/finance')}>
            <Wallet size={20} />
            <span>Keuangan</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}