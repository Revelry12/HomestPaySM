import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Invoice() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch detail tagihan by ID
    fetch(`http://localhost:3000/api/tagihan/detail/${id}`)
      .then(res => res.json())
      .then(res => setData(res));
  }, [id]);

  if(!data) return <p>Loading Invoice...</p>;

  // Proteksi Ganda: Jika belum lunas, jangan tampilkan invoice resmi
  if(data.status !== 'Lunas') {
      return (
        <div className="text-center p-10">
            <h1 className="text-red-600 font-bold text-2xl">INVOICE BELUM TERSEDIA</h1>
            <p>Mohon lunasi tagihan Anda untuk mencetak bukti pembayaran sah.</p>
        </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border p-10 mt-10 shadow-lg print:shadow-none">
        <div className="text-center border-b pb-4 mb-4">
            <h1 className="text-3xl font-bold text-indigo-900">INVOICE LUNAS</h1>
            <p className="text-slate-500">HomestPay Residence</p>
        </div>

        <div className="flex justify-between mb-8">
            <div>
                <p className="text-sm text-slate-500">Kepada Yth:</p>
                <p className="font-bold">{data.nama_warga}</p>
                <p>{data.blok_rumah} No. {data.no_rumah}</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-slate-500">No. Invoice:</p>
                <p className="font-bold">INV-{data.id}/{data.tahun}</p>
                <p className="text-sm text-slate-500 mt-2">Tanggal Lunas:</p>
                <p className="font-bold text-green-600">{new Date().toLocaleDateString()}</p>
            </div>
        </div>

        <table className="w-full mb-8">
            <thead className="bg-slate-100">
                <tr>
                    <th className="text-left p-3">Keterangan</th>
                    <th className="text-right p-3">Jumlah</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="p-3">Iuran Pengelolaan Lingkungan (IPL) - {data.bulan} {data.tahun}</td>
                    <td className="text-right p-3 font-bold">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.jumlah)}
                    </td>
                </tr>
            </tbody>
        </table>

        <div className="text-center mt-12">
            <p className="text-sm text-slate-400">Terima kasih telah melakukan pembayaran tepat waktu.</p>
            <p className="text-xs text-slate-300 mt-1">Bukti ini sah dan digenerate secara komputerisasi.</p>
            <button onClick={() => window.print()} className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded print:hidden">
                Print / Simpan PDF
            </button>
        </div>
    </div>
  );
}