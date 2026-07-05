const fs = require('fs');

// 1. Update AdminLayout to support Role-based menus
let adminLayout = fs.readFileSync('apps/web-admin/app/AdminLayout.tsx', 'utf8');
adminLayout = adminLayout.replace(
  'const [isAuthenticated, setIsAuthenticated] = useState(false);',
  'const [isAuthenticated, setIsAuthenticated] = useState(false);\n  const [userRole, setUserRole] = useState<string | null>(null);'
);
adminLayout = adminLayout.replace(
  'if (token) {',
  'if (token) {\n      try {\n        const user = JSON.parse(localStorage.getItem("user") || "{}");\n        setUserRole(user.role);\n      } catch (e) {}\n'
);

adminLayout = adminLayout.replace(
  '{ icon: Settings, label: "Pengaturan", href: "/pengaturan" },',
  '...(userRole === "Super Admin" || userRole === "Admin Desa" ? [{ icon: Settings, label: "Pengaturan", href: "/pengaturan" }] : []),'
);

fs.writeFileSync('apps/web-admin/app/AdminLayout.tsx', adminLayout);

// 2. Add Analytics Dashboard to Admin Home
let adminPage = fs.readFileSync('apps/web-admin/app/page.tsx', 'utf8');
const dashboardContent = `
"use client";
import { useEffect, useState } from "react";
import { Users, FileText, CheckCircle, AlertTriangle, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Simulasi fetch stats
    setTimeout(() => {
      setStats({
        totalResidents: 3245,
        totalFamilies: 912,
        totalLetters: 1450,
        pendingComplaints: 12,
        chartData: [
          { name: "Jan", surat: 120, aduan: 10 },
          { name: "Feb", surat: 150, aduan: 15 },
          { name: "Mar", surat: 180, aduan: 8 },
          { name: "Apr", surat: 140, aduan: 20 },
          { name: "Mei", surat: 200, aduan: 12 },
          { name: "Jun", surat: 170, aduan: 5 },
        ]
      });
    }, 500);
  }, []);

  if (!stats) return <div className="animate-pulse space-y-6">
    <div className="h-32 bg-slate-200 rounded-xl"></div>
  </div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Total Penduduk</div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalResidents}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Kepala Keluarga</div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalFamilies}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Surat Selesai</div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalLetters}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Aduan Pending</div>
            <div className="text-2xl font-bold text-slate-900">{stats.pendingComplaints}</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-500" />
          Aktivitas Pelayanan (6 Bulan Terakhir)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="surat" name="Surat" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="aduan" name="Aduan" fill="#eab308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('apps/web-admin/app/page.tsx', dashboardContent);

// 3. Install recharts
console.log("Features updated.");
