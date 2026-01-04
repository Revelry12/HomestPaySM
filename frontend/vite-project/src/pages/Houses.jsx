import React, { useState, useEffect } from 'react';
import { Home, Plus, Layers, Loader, X } from 'lucide-react';

export default function Houses() {
  const [houses, setHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [modalType, setModalType] = useState(null); // 'single' atau 'bulk'
  
  // Form Data
  const [formData, setFormData] = useState({ block: '', number: '', status: 'Kosong' });
  const [bulkData, setBulkData] = useState({ block: '', startNum: 1, endNum: 10 });

  useEffect(() => { fetchHouses(); }, []);

  const fetchHouses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/rumah');
      if(res.ok) setHouses(await res.json());
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isBulk = modalType === 'bulk';
    const url = isBulk ? 'http://localhost:3000/api/rumah/generate' : 'http://localhost:3000/api/rumah';
    const body = isBulk ? bulkData : formData;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if(res.ok) {
        alert(result.message);
        setModalType(null);
        fetchHouses();
      } else {
        alert("Gagal: " + result.error);
      }
    } catch { alert("Error Server"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Data Rumah</h2>
        <div className="flex gap-2">
          <button onClick={() => setModalType('single')} className="bg-white border text-slate-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50">
            <Plus size={16}/> Tambah Satuan
          </button>
          <button onClick={() => setModalType('bulk')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700">
            <Layers size={16}/> Generate Massal
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-slate-400">Memuat data rumah...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {houses.map((house) => (
            <div key={house.id} className={`p-4 rounded-xl border ${house.is_occupied ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'} flex flex-col items-center justify-center text-center transition hover:shadow-md`}>
              <Home size={24} className={house.is_occupied ? 'text-indigo-600' : 'text-slate-400'} />
              <span className="font-bold text-lg text-slate-700 mt-2">{house.blok_rumah} - {house.no_rumah}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">{house.status_rumah}</span>
            </div>
          ))}
        </div>
      )}

      {/* MODAL (Satu Form untuk 2 Fungsi) */}
      {modalType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex justify-between mb-4">
               <h3 className="font-bold text-lg">{modalType === 'bulk' ? 'Generate Banyak Rumah' : 'Tambah Satu Rumah'}</h3>
               <button onClick={() => setModalType(null)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === 'single' ? (
                <>
                  <input placeholder="Blok (Cth: A)" className="w-full border p-2 rounded" value={formData.block} onChange={e=>setFormData({...formData, block: e.target.value})} required/>
                  <input placeholder="Nomor (Cth: 12)" className="w-full border p-2 rounded" value={formData.number} onChange={e=>setFormData({...formData, number: e.target.value})} required/>
                </>
              ) : (
                <>
                  <input placeholder="Blok (Cth: F)" className="w-full border p-2 rounded" value={bulkData.block} onChange={e=>setBulkData({...bulkData, block: e.target.value})} required/>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Mulai (1)" className="w-full border p-2 rounded" value={bulkData.startNum} onChange={e=>setBulkData({...bulkData, startNum: Number(e.target.value)})} required/>
                    <input type="number" placeholder="Sampai (20)" className="w-full border p-2 rounded" value={bulkData.endNum} onChange={e=>setBulkData({...bulkData, endNum: Number(e.target.value)})} required/>
                  </div>
                  <p className="text-xs text-slate-500">Akan membuat rumah dari nomor {bulkData.startNum} sampai {bulkData.endNum} di Blok {bulkData.block}.</p>
                </>
              )}
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700">Simpan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}