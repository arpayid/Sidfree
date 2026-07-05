import { FileText, MessageSquare, Info } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
          <span className="block">Selamat Datang di</span>
          <span className="block text-blue-600">Portal Desa Sukamaju</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Layanan mandiri warga untuk pengurusan surat pengantar, pelaporan
          aduan, dan informasi seputar desa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center hover:shadow-md transition">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Layanan Surat
          </h3>
          <p className="text-slate-500 mb-6">
            Ajukan pembuatan surat pengantar RT/RW, SKTM, dan surat domisili
            secara online.
          </p>
          <a
            href="/layanan"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Mulai Pengajuan
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center hover:shadow-md transition">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Aduan Warga</h3>
          <p className="text-slate-500 mb-6">
            Sampaikan keluhan, kritik, atau saran untuk pembangunan desa yang
            lebih baik.
          </p>
          <a
            href="/aduan"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
          >
            Buat Laporan
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center hover:shadow-md transition">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Info className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Informasi Desa
          </h3>
          <p className="text-slate-500 mb-6">
            Dapatkan berita terbaru, pengumuman, dan transparansi anggaran desa.
          </p>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
          >
            Lihat Informasi
          </a>
        </div>
      </div>
    </div>
  );
}
