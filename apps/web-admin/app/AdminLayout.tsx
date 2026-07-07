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
  MessageSquare,
  BarChart3,
  Wallet,
  Store,
  ArrowRight
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
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth on mount
    const token = localStorage.getItem("token");
    if (!token && pathname !== "/login") {
      router.push("/login");
    } else if (token) {
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(u);
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

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Data Penduduk", href: "/penduduk", icon: Users },
    { name: "Data Keluarga", href: "/keluarga", icon: Users },
    { name: "Layanan Surat", href: "/surat", icon: FileText },
    { name: "Aduan Warga", href: "/aduan", icon: MessageSquare },
    { name: "Keuangan & Kas", href: "/keuangan", icon: Wallet },
    { name: "Laporan & Analitik", href: "/analytics", icon: BarChart3 },
    { name: "Potensi Desa (UMKM)", href: "/potensi", icon: Store },
    { name: "Pengaturan", href: "/pengaturan", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <div className="w-72 bg-slate-900 flex flex-col fixed inset-y-0 left-0 z-20 shadow-2xl">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg shadow-blue-900/50">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-white tracking-tight text-lg block leading-tight">SIDPRO</span>
            <span className="text-xs text-slate-400 font-medium">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all group relative ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {isActive && (
                   <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full"></span>
                )}
                <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
          >
            <LogOut className="w-5 h-5 mr-3 text-slate-500 group-hover:text-red-400" />
            Keluar Sistem
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pl-72 flex flex-col min-h-screen">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 capitalize tracking-tight">
              {pathname === "/"
                ? "Dashboard"
                : pathname.replace("/", "").replace("-", " ")}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors">
              Buka Portal Publik <ArrowRight className="w-4 h-4" />
            </a>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900">{user?.name || "Admin"}</div>
                <div className="text-xs font-medium text-slate-500">{user?.role || "Administrator"}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
