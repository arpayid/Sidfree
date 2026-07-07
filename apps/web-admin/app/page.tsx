"use client";
import { useEffect, useState } from "react";
import { Users, FileText, AlertTriangle, Activity, CheckCircle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(u);
    } catch (e) {}

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return (
    <div className="animate-pulse space-y-8">
      <div className="h-10 w-64 bg-slate-200 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>)}
      </div>
      <div className="h-96 bg-slate-200 rounded-2xl"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-lg shadow-blue-900/20">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Selamat Datang, {user?.name || 'Admin'}! 👋</h2>
          <p className="text-blue-100 max-w-2xl text-lg">Pantau aktivitas desa, kelola surat menyurat, dan tindak lanjuti aduan warga hari ini.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-200" />
          <div>
            <div className="text-sm font-medium text-blue-200">Waktu Sistem</div>
            <div className="text-xl font-bold">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Users className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Penduduk</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.totalResidents}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <Users className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Kepala Keluarga</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.totalFamilies}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Surat Selesai</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.totalLetters}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Aduan Pending</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.pendingComplaints}</div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-600" />
              Statistik Pelayanan Publik
            </h3>
            <p className="text-slate-500 mt-1">Tren pengajuan surat dan pelaporan aduan warga dalam 6 bulan terakhir.</p>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 14, fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 14, fontWeight: 500 }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontWeight: 600 }}
              />
              <Bar dataKey="surat" name="Surat Masuk" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
              <Bar dataKey="aduan" name="Aduan Masuk" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
