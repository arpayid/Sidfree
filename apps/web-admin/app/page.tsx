"use client";
import { useEffect, useState } from "react";
import { Users, FileText, UserCheck, AlertCircle, Activity } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalResidents: 0,
    activeLetters: 0,
    activeComplaints: 0,
    families: 0,
  });
  
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        const [resResidents, resLetters, resComplaints, resFamilies, resAudit] = await Promise.all([
          fetch("/api/residents", { headers }),
          fetch("/api/letters", { headers }),
          fetch("/api/complaints", { headers }),
          fetch("/api/families", { headers }),
          fetch("/api/audit", { headers }),
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
        
        if (resAudit.ok) {
          const audit = await resAudit.json();
          // Filter to show only WRITE operations (CREATE, UPDATE, DELETE) for better signal-to-noise ratio
          const writeActivities = audit.filter((a: any) => !a.action.startsWith("READ")).slice(0, 5);
          setActivities(writeActivities);
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
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-slate-500" />
            Aktivitas Terakhir
          </h2>
          
          {activities.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              Belum ada aktivitas.
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity: any) => (
                <div key={activity.id} className="flex border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="mt-1 mr-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {activity.user?.name || "Sistem"} melakukan <span className="font-bold">{activity.action}</span> pada <span className="font-bold">{activity.resource}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(activity.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Pengumuman Desa</h2>
          <div className="text-center text-slate-500 py-8">
            Tidak ada pengumuman baru.
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
