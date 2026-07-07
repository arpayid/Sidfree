"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check auth on mount
    const token = localStorage.getItem("token");
    if (!token && pathname !== "/login") {
      router.push("/login");
    } else if (token) {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserRole(user.role);
      } catch (e) {}

      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [pathname, router]);
  if (isLoading) return null;
  // Don't wrap login page with sidebar
  if (pathname === "/login") {
    return <>{children}</>;
  }
  if (!isAuthenticated) return null;
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white mr-3">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800">SIDPRO Admin</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <Link
            href="/"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${pathname === "/" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            href="/penduduk"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${pathname.startsWith("/penduduk") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Users className="w-5 h-5 mr-3" />
            Data Penduduk
          </Link>
          <Link
            href="/keluarga"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${pathname.startsWith("/keluarga") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Users className="w-5 h-5 mr-3" />
            Data Keluarga
          </Link>
          <Link
            href="/surat"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${pathname.startsWith("/surat") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <FileText className="w-5 h-5 mr-3" />
            Layanan Surat
          </Link>
          <Link
            href="/aduan"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${pathname.startsWith("/aduan") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Aduan Warga
          </Link>
          <Link
            href="/keuangan"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${pathname.startsWith("/keuangan") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Building2 className="w-5 h-5 mr-3" />
            Keuangan & Kas
          </Link>
          <Link
            href="/analytics"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${pathname.startsWith("/analytics") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Users className="w-5 h-5 mr-3" />
            Laporan & Analitik
          </Link>
          <Link
            href="/potensi"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${pathname.startsWith("/potensi") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Potensi Desa (UMKM)
          </Link>
          <Link
            href="/pengaturan"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${pathname.startsWith("/pengaturan") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Pengaturan
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {pathname === "/"
              ? "Dashboard"
              : pathname.replace("/", "").replace("-", " ")}
          </h1>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-blue-600 hover:underline">
              Ke Portal Publik
            </a>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
