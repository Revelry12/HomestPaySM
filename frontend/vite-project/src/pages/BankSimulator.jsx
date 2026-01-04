import React, { useState } from 'react';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

export default function BankSimulator() {
  const [vaNumber, setVaNumber] = useState('');
  const [amount, setAmount] = useState('150000');
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      // PANGGIL WEBHOOK BACKEND KITA
      const response = await fetch('http://localhost:3000/api/pembayaran/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomor_va: vaNumber,
          jumlah_bayar: amount
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setMessage("Pembayaran Berhasil! Sistem Admin otomatis terupdate.");
      } else {
        setStatus('error');
        setMessage(result.error || result.message || "Gagal bayar");
      }
    } catch {
      setStatus('error');
      setMessage("Server Backend mati atau tidak merespon.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header Bank */}
        <div className="bg-blue-800 p-6 text-white text-center">
          <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-80" />
          <h1 className="text-2xl font-bold tracking-wider">M-BANKING SIMULATOR</h1>
          <p className="text-blue-200 text-sm">Mocking Virtual Account Payment</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handlePay} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nomor Virtual Account</label>
              <input 
                type="text" 
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-xl font-mono font-bold text-gray-700 focus:border-blue-500 focus:outline-none transition"
                placeholder="Contoh: 8800202601001"
                value={vaNumber}
                onChange={(e) => setVaNumber(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nominal Pembayaran</label>
              <input 
                type="number" 
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-lg font-medium text-gray-700 focus:border-blue-500 focus:outline-none transition"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all disabled:bg-gray-400"
            >
              {isLoading ? 'Memproses...' : 'BAYAR SEKARANG'}
            </button>
          </form>

          {/* Status Message */}
          {status && (
            <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {status === 'success' ? <CheckCircle className="shrink-0"/> : <XCircle className="shrink-0"/>}
              <div>
                <h4 className="font-bold">{status === 'success' ? 'Transaksi Berhasil' : 'Transaksi Gagal'}</h4>
                <p className="text-sm mt-1 opacity-90">{message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}