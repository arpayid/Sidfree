"use client";
import { useEffect, useState } from "react";
import { Store } from "lucide-react";

export default function AdminPotensiPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/businesses', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setBusinesses(data || []));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen UMKM</h1>
          <p className="text-slate-500">Kelola direktori potensi desa.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-medium text-slate-500">Nama Usaha</th>
              <th className="p-4 text-sm font-medium text-slate-500">Pemilik</th>
              <th className="p-4 text-sm font-medium text-slate-500">Kategori</th>
              <th className="p-4 text-sm font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map(b => (
              <tr key={b.id} className="border-b border-slate-100">
                <td className="p-4 font-bold text-slate-800">{b.name}</td>
                <td className="p-4 text-sm text-slate-600">{b.resident.name}</td>
                <td className="p-4 text-sm text-slate-600">{b.category}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${b.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
            {businesses.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">Belum ada UMKM terdaftar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
