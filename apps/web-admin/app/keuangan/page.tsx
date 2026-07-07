"use client";
import { useEffect, useState } from "react";
import { DollarSign, FileText } from "lucide-react";

export default function KeuanganPage() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/payments', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setPayments(data || []));
  }, []);

  const totalRevenue = payments.filter(p => p.status === 'Success').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Keuangan Desa</h1>
          <p className="text-slate-500">Dashboard penerimaan retribusi & iuran warga.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <DollarSign />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Penerimaan</p>
            <p className="text-2xl font-bold text-slate-800">Rp{totalRevenue.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Riwayat Pembayaran</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-medium text-slate-500">Tanggal</th>
              <th className="p-4 text-sm font-medium text-slate-500">Warga</th>
              <th className="p-4 text-sm font-medium text-slate-500">Jenis</th>
              <th className="p-4 text-sm font-medium text-slate-500">Jumlah</th>
              <th className="p-4 text-sm font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="p-4 text-sm text-slate-600">{new Date(p.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="p-4 text-sm font-medium text-slate-800">{p.resident.name}</td>
                <td className="p-4 text-sm text-slate-600">{p.type}</td>
                <td className="p-4 text-sm font-bold text-slate-800">Rp{p.amount.toLocaleString('id-ID')}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">Belum ada data pembayaran.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
