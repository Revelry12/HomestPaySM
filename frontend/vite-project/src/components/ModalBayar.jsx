import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, X, Loader2, Receipt, ArrowLeft } from 'lucide-react';

// --- SUB-KOMPONEN: TAMPILAN INVOICE ---
const InvoiceView = ({ data, onClose }) => {
    if (!data) return null;
    return (
        <div className="bg-slate-50 p-6 animate-in fade-in">
            <div className="bg-white border-2 border-dashed border-slate-300 p-6 rounded-xl relative">
                <div className="absolute -left-3 top-1/2 -mt-3 w-6 h-6 bg-slate-50 rounded-full border-r-2 border-slate-300"></div>
                <div className="absolute -right-3 top-1/2 -mt-3 w-6 h-6 bg-slate-50 rounded-full border-l-2 border-slate-300"></div>

                <div className="text-center mb-6 border-b border-slate-100 pb-4">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Bukti Pembayaran</h3>
                    <p className="text-sm text-slate-500">{data.waktu}</p>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">No. Referensi</span><span className="font-mono font-bold text-slate-700">{data.referensi}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Metode</span><span className="font-bold text-slate-700">Virtual Account</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Nomor VA</span><span className="font-mono font-bold text-slate-700">{data.va}</span></div>
                    <div className="flex justify-between border-t border-dashed border-slate-200 pt-4 mt-4">
                        <span className="text-slate-500">Pembayaran Untuk</span><span className="font-bold text-slate-700">Tagihan IPL {data.periode}</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg mt-2">
                        <span className="text-emerald-700 font-bold">TOTAL BAYAR</span>
                        <span className="text-xl font-bold text-emerald-700">Rp {parseInt(data.nominal).toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="w-full mt-6 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition">Tutup Jendela</button>
        </div>
    );
};

// --- KOMPONEN UTAMA MODAL ---
export default function ModalBayar({ isOpen, onClose, tagihan, user, onSuccess, idRumah }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 
  const [message, setMessage] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [vaNumber, setVaNumber] = useState('');
  const [amount, setAmount] = useState('');

  // === PERBAIKAN DISINI (MENCEGAH LOOP) ===
  // Gunakan useEffect yang bergantung pada 'isOpen', 'tagihan', dan 'user.id'
  // Nilai-nilai ini hanya digunakan saat modal dibuka untuk set initial state
useEffect(() => {
    if (isOpen) {
       // 1. Reset State UI
       setStatus(null);
       setMessage('');
       setShowInvoice(false);
       setTransactionData(null);
       setLoading(false);

       // 2. Set Data Form
       console.log(user);
       if (tagihan > 0) {
           const rumahIdFormatted = idRumah? idRumah.toString().padStart(4, '0') : '0000';
           setVaNumber(`8800202601${rumahIdFormatted}`);
           setAmount(tagihan.toString());
       }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCloseModal = () => {
      if(status === 'success') {
         onSuccess(); // Refresh dashboard
      }
      onClose();
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('http://localhost:3000/api/pembayaran/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomor_va: vaNumber, jumlah_bayar: amount })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setTransactionData(result.transactionDetails);
      } else {
        setStatus('error');
        setMessage(result.message || "Gagal melakukan pembayaran.");
      }
    } catch {
      setStatus('error');
      setMessage("Gagal terhubung ke server pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200 my-8">
        
        {/* Header Biru */}
        {!showInvoice && (
            <div className="bg-blue-900 p-6 text-white text-center relative">
                <button onClick={handleCloseModal} className="absolute top-4 right-4 text-blue-200 hover:text-white transition"><X size={24} /></button>
                <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-80" />
                <h2 className="text-xl font-bold tracking-wide">SIMULASI M-BANKING</h2>
                <p className="text-blue-200 text-xs">Virtual Account Payment Gateway</p>
            </div>
        )}

        {/* --- LOGIKA TAMPILAN --- */}
        {showInvoice && transactionData ? (
             <InvoiceView data={transactionData} onClose={handleCloseModal} />
        ) : status === 'success' ? (
            <div className="p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                     <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Pembayaran Berhasil!</h3>
                <p className="text-slate-500 text-sm mb-8">Tagihan Anda telah lunas.</p>
                <div className="space-y-3">
                    <button onClick={() => setShowInvoice(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition"><Receipt size={18} /> Lihat Invoice Pembayaran</button>
                    <button onClick={handleCloseModal} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition"><ArrowLeft size={18} /> Kembali ke Dashboard</button>
                </div>
            </div>
        ) : (
            <div className="p-6">
                {status === 'error' && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4 animate-in slide-in-from-top-2"><XCircle size={18} className="shrink-0" /> {message}</div>
                )}
                <form onSubmit={handlePay} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nomor Virtual Account</label>
                        <input type="text" className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg font-mono font-bold text-gray-700 bg-gray-50 cursor-not-allowed" value={vaNumber} readOnly />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Tagihan</label>
                        <input type="text" className="w-full border-2 gray-200 rounded-lg p-3 text-2xl font-bold text-blue-900 bg-blue-50 border-blue-100 cursor-not-allowed" value={`Rp ${parseInt(amount || 0).toLocaleString('id-ID')}`} readOnly />
                    </div>
                    <button type="submit" disabled={loading || amount <= 0} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2 mt-6 disabled:bg-slate-300 disabled:shadow-none disabled:scale-100">
                        {loading ? <><Loader2 className="animate-spin" /> Memproses...</> : 'BAYAR SEKARANG'}
                    </button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
}