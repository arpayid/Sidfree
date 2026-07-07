"use client";
import { useEffect, useState } from "react";
import { PieChart, Users, Download } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard/analytics/demographics', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(d => setData(d));
  }, []);

  if (!data) return <div className="p-8">Memuat analitik...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Advanced Analytics</h1>
          <p className="text-slate-500">Laporan demografi dan profil desa.</p>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-blue-500"/> Demografi Berdasarkan Jenis Kelamin</h2>
          <div className="space-y-4">
            {data.gender.map((g: any) => (
              <div key={g.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">{g.name}</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">{g.value} Jiwa</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500"/> Status Kependudukan</h2>
          <div className="space-y-4">
            {data.status.map((s: any) => (
              <div key={s.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">{s.name}</span>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">{s.value} Jiwa</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
