"use client";
import { useState } from "react";

export default function PembayaranPage() {
  const [nik, setNik] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/public/payments/billing?nik=${nik}`);
      if (res.ok) {
        setData(await res.json());
      } else {
        alert("Data tidak ditemukan");
        setData(null);
      }
    } catch {
      alert("Error jaringan");
    }
    setLoading(false);
  };

  const payBill = async (id: string) => {
    try {
      const res = await fetch(`/api/public/payments/pay/${id}`, { method: 'POST' });
      if (res.ok) {
        alert("Pembayaran berhasil disimulasikan");
        setData({
          ...data,
          bills: data.bills.filter((b: any) => b.id !== id)
        });
      }
    } catch {
      alert("Error pembayaran");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Pembayaran Retribusi</h1>
      <p className="text-slate-600 mb-8">Cek dan bayar tagihan iuran desa Anda secara online.</p>
      
      <form onSubmit={checkBilling} className="flex gap-4 mb-8">
        <input 
          type="text" 
          value={nik} 
          onChange={e => setNik(e.target.value)}
          placeholder="Masukkan NIK 16 digit"
          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
          maxLength={16}
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700">
          Cek Tagihan
        </button>
      </form>

      {data && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4">Tagihan untuk: {data.resident.name}</h2>
          {data.bills.length === 0 ? (
            <p className="text-green-600 bg-green-50 p-4 rounded-xl">Tidak ada tagihan tertunda. Terima kasih!</p>
          ) : (
            <div className="space-y-4">
              {data.bills.map((bill: any) => (
                <div key={bill.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <div>
                    <h3 className="font-bold text-slate-800">{bill.type}</h3>
                    <p className="text-slate-500 text-sm">Tagihan: Rp{bill.amount.toLocaleString('id-ID')}</p>
                  </div>
                  <button onClick={() => payBill(bill.id)} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600">
                    Bayar (Simulasi QRIS)
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
