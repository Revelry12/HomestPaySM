import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, ArrowRight } from 'lucide-react';

export default function LoginWarga() {
  const [nohp, setNohp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/mobile/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nohp })
      });

      const result = await response.json();

      if (response.ok) {
        // Simpan data warga ke LocalStorage (Simulasi Session)
        localStorage.setItem('wargaData', JSON.stringify(result.data));
        navigate('/warga/dashboard');
      } else {
        setError(result.error);
      }
    } catch {
      setError("Gagal terhubung ke server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
            <Smartphone className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Portal Warga</h1>
          <p className="text-gray-500 text-sm mt-1">Masuk menggunakan No. HP yang terdaftar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nomor WhatsApp / HP</label>
            <input 
              type="text" 
              placeholder="0812..."
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-lg"
              value={nohp}
              onChange={(e) => setNohp(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
            Masuk Sekarang <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}