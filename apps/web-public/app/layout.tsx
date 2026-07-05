import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIDPRO - Portal Publik",
  description: "Sistem Informasi Desa untuk Warga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <header className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-blue-600">
                    SIDPRO
                  </span>
                </div>
                <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <a
                    href="/"
                    className="text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium"
                  >
                    Beranda
                  </a>
                  <a
                    href="/layanan"
                    className="text-slate-500 hover:text-slate-700 hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium"
                  >
                    Layanan Surat
                  </a>
                  <a
                    href="/aduan"
                    className="text-slate-500 hover:text-slate-700 hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium"
                  >
                    Aduan Warga
                  </a>
                </nav>
                <div className="flex items-center">
                  <a
                    href="/admin/login"
                    className="text-sm font-medium text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-2 rounded-lg"
                  >
                    Masuk Admin
                  </a>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="bg-white border-t border-slate-200 mt-auto py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <span className="text-xl font-bold text-slate-400">
                    SIDPRO
                  </span>
                  <p className="text-sm text-slate-500 mt-1">
                    Sistem Informasi Desa Mandiri & Terpadu
                  </p>
                </div>
                <p className="text-center text-sm text-slate-500">
                  &copy; 2026 Desa Sukamaju. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
