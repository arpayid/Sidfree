import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Building2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIDPRO - Portal Publik",
  description: "Sistem Informasi Desa Mandiri & Terpadu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          
          {/* Navigation */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-20 items-center">
                <div className="flex-shrink-0 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight block leading-none">
                      SIDPRO
                    </span>
                    <span className="text-xs font-medium text-slate-500 block mt-1">Desa Sukamaju</span>
                  </div>
                </div>
                
                <nav className="hidden lg:flex space-x-1">
                  <a href="/" className="text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-full text-sm font-semibold transition-all">Beranda</a>
                  <a href="/layanan" className="text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-full text-sm font-semibold transition-all">Layanan Surat</a>
                  <a href="/aduan" className="text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-full text-sm font-semibold transition-all">Aduan Warga</a>
                  <a href="/pembayaran" className="text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-full text-sm font-semibold transition-all">Pembayaran</a>
                  <a href="/potensi" className="text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-full text-sm font-semibold transition-all">Potensi Desa</a>
                  <a href="/kiosk" className="text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-full text-sm font-semibold transition-all">Anjungan</a>
                </nav>

                <div className="flex items-center gap-4">
                  <a
                    href="/admin/login"
                    className="text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    Masuk Admin
                  </a>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="bg-slate-900 border-t border-slate-800 mt-auto py-16 text-slate-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white border border-slate-700">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xl font-bold text-white tracking-tight block leading-none">
                        SIDPRO
                      </span>
                      <span className="text-xs font-medium text-slate-500 block mt-1">Sistem Informasi Desa Mandiri & Terpadu</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Platform digitalisasi desa yang terintegrasi untuk mewujudkan tata kelola pemerintahan yang baik, transparan, dan pelayanan publik yang prima.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-4">Layanan Cepat</h4>
                  <ul className="space-y-3 text-sm">
                    <li><a href="/layanan" className="hover:text-blue-400 transition-colors">Pengajuan Surat Online</a></li>
                    <li><a href="/aduan" className="hover:text-blue-400 transition-colors">Laporan Aduan Warga</a></li>
                    <li><a href="/pembayaran" className="hover:text-blue-400 transition-colors">Cek Tagihan Retribusi</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4">Informasi</h4>
                  <ul className="space-y-3 text-sm">
                    <li><a href="/potensi" className="hover:text-blue-400 transition-colors">Produk UMKM Desa</a></li>
                    <li><a href="/kiosk" className="hover:text-blue-400 transition-colors">Mode Anjungan (Kiosk)</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm">
                  &copy; 2026 Pemerintah Desa Sukamaju. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm">
                  <a href="#" className="hover:text-white">Kebijakan Privasi</a>
                  <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
