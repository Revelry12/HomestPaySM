import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, CreditCard, LogOut, CheckCircle, ShieldCheck } from 'lucide-react';

export default function DashboardWarga() {
  const [user, setUser] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // State baru untuk layar sukses
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('wargaData');
    if (!data) {
      navigate('/warga/login');
    } else {
      setUser(JSON.parse(data));
    }
  }, [navigate]);

  const handleLogout = () => {
    if(window.confirm("Keluar dari aplikasi warga?")) {
        localStorage.removeItem('wargaData');
        navigate('/warga/login');
    }
  };

  const handlePay = async () => {
    if(!user.tagihan) return;
    
    if(!window.confirm(`Konfirmasi pembayaran sejumlah Rp ${parseInt(user.tagihan.jumlah).toLocaleString()}?`)) return;

    setLoadingPay(true);
    try {
      const response = await fetch('http://localhost:3000/api/pembayaran/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomor_va: user.tagihan.nomor_va,
          jumlah_bayar: user.tagihan.jumlah
        })
      });

      const result = await response.json();
      
      if(result.success) {
        // --- LOGIC BARU: JANGAN LOGOUT ---
        setPaymentSuccess(true); 
        
        // Update data lokal agar status jadi 'Lunas' tanpa reload page
        const updatedUser = { 
            ...user, 
            tagihan: { ...user.tagihan, status: 'Lunas' } 
        };
        setUser(updatedUser);
        localStorage.setItem('wargaData', JSON.stringify(updatedUser)); // Simpan state baru
        
      } else {
        alert("Gagal: " + result.message);
      }
    } catch {
      alert("Error Server");
    } finally {
      setLoadingPay(false);
    }
  };

  if (!user) return null;

  return (
    // Class 'fixed inset-0 z-50' memaksa tampilan ini menutupi Header Admin jika ada yang bocor
    <div className="fixed inset-0 z-50 bg-gray-50 flex justify-center overflow-y-auto">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative">
        
        {/* HEADER BARU: HomestPay Branding */}
        <div className="bg-blue-600 p-6 pt-8 pb-12 rounded-b-[40px] shadow-lg text-white relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                    <ShieldCheck size={24} className="text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-wide">HomestPay</h1>
            </div>
            <button onClick={handleLogout} className="bg-blue-700/50 p-2 rounded-full hover:bg-blue-800 transition">
               <LogOut size={18} />
            </button>
          </div>

          {/* Info User */}
          <div className="flex items-center gap-3 mt-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                  {user.nama.charAt(0)}
              </div>
              <div>
                  <p className="text-blue-100 text-xs uppercase tracking-wider">Selamat Datang</p>
                  <p className="text-lg font-bold">{user.nama}</p>
                  <div className="flex items-center gap-1 text-sm text-blue-200">
                    <Home size={12}/> {user.blok} - {user.nomor}
                  </div>
              </div>
          </div>
        </div>

        {/* KONTEN UTAMA */}
        <div className="p-6 -mt-8 relative z-20">
          
          {/* LOGIC TAMPILAN: SUKSES vs BELUM BAYAR */}
          {paymentSuccess || (user.tagihan && user.tagihan.status === 'Lunas') ? (
            
            // --- TAMPILAN SUKSES (STRUK) ---
            <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Pembayaran Berhasil!</h2>
                <p className="text-gray-500 text-sm mb-6">Terima kasih telah membayar tepat waktu.</p>
                
                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                    <p className="text-xs text-gray-400 uppercase mb-1">Total Dibayar</p>
                    <p className="text-xl font-bold text-gray-800">
                        Rp {parseInt(user.tagihan?.jumlah || 0).toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-green-600 font-bold mt-1 flex items-center justify-center gap-1">
                        <CheckCircle size={12}/> LUNAS
                    </p>
                </div>
                
                {paymentSuccess && (
                  <button 
                    onClick={() => setPaymentSuccess(false)}
                    className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                  >
                    Kembali ke Dashboard
                  </button>
                )}
            </div>

          ) : (
            
            // --- TAMPILAN TAGIHAN (BELUM BAYAR) ---
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                    <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider">Tagihan Aktif</h3>
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        Menunggu Pembayaran
                    </span>
                </div>
                
                {user.tagihan ? (
                <>
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-1">{user.tagihan.periode}</p>
                        <p className="text-4xl font-bold text-gray-800 tracking-tight">
                        Rp {parseInt(user.tagihan.jumlah).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 mt-4">
                        <p className="text-xs text-blue-500 font-bold uppercase mb-2">Virtual Account (Salin)</p>
                        <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2">
                                <CreditCard className="text-blue-600" size={20}/>
                                <span className="text-lg font-mono font-bold tracking-widest text-gray-700">
                                {user.tagihan.nomor_va}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button 
                    onClick={handlePay}
                    disabled={loadingPay}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95 disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                    {loadingPay ? 'Memproses...' : 'BAYAR SEKARANG'}
                    </button>
                </>
                ) : (
                <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2"/>
                    <p className="text-gray-800 font-bold">Tidak Ada Tagihan</p>
                </div>
                )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 mt-8">
            <p>© 2026 HomestPay System</p>
          </div>

        </div>
      </div>
    </div>
  );
}