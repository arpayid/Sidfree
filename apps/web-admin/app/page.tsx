"use client";
import { useEffect, useState } from "react";
import { Users, FileText, UserCheck, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalResidents: 0,
    activeLetters: 0,
    activeComplaints: 0,
    families: 0,
  });

  useEffect(() => {
    // In a real app, fetch from /api/dashboard/stats
    // For now we simulate with mock counts based on actual endpoints
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [resResidents, resLetters, resComplaints, resFamilies] = await Promise.all([
          fetch("/api/residents", { headers }),
          fetch("/api/letters", { headers }),
          fetch("/api/complaints", { headers }),
          fetch("/api/families", { headers }),
        ]);

        if (resResidents.ok && resLetters.ok && resComplaints.ok && resFamilies.ok) {
          const residents = await resResidents.json();
          const letters = await resLetters.json();
          const complaints = await resComplaints.json();
          const families = await resFamilies.json();

          setStats({
            totalResidents: residents.length,
            activeLetters: letters.filter((l: any) => l.status === "Pending").length,
            activeComplaints: complaints.filter((c: any) => c.status === "Pending").length,
            families: families.length,
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Penduduk" value={stats.totalResidents} icon={<Users className="w-6 h-6 text-blue-600" />} color="bg-blue-100" />
        <StatCard title="Total KK" value={stats.families} icon={<UserCheck className="w-6 h-6 text-indigo-600" />} color="bg-indigo-100" />
        <StatCard title="Surat Pending" value={stats.activeLetters} icon={<FileText className="w-6 h-6 text-amber-600" />} color="bg-amber-100" />
        <StatCard title="Aduan Baru" value={stats.activeComplaints} icon={<AlertCircle className="w-6 h-6 text-red-600" />} color="bg-red-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Aktivitas Terakhir</h2>
          <div className="text-center text-slate-500 py-8">
            Belum ada aktivitas.
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Pengumuman Desa</h2>
          <div className="text-center text-slate-500 py-8">
            Tidak ada pengumuman.
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
