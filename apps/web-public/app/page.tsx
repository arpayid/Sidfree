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
      
      {/* Statistics Section */}
      <div className="mt-24 border-t border-slate-200 pt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Desa Sukamaju dalam Angka</h2>
          <p className="mt-4 text-lg text-slate-500">Transparansi data kependudukan dan pelayanan publik desa.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-blue-600">3.245</div>
            <div className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wide">Penduduk</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-blue-600">912</div>
            <div className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wide">Kepala Keluarga</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-green-600">1.450</div>
            <div className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wide">Surat Selesai</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-red-600">98%</div>
            <div className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wide">Aduan Tertangani</div>
          </div>
        </div>
      </div>

      {/* News & Announcements Section */}
      <div className="mt-24 border-t border-slate-200 pt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Berita & Pengumuman</h2>
            <p className="mt-2 text-lg text-slate-500">Kabar terbaru dari Desa Sukamaju.</p>
          </div>
          <a href="#" className="text-blue-600 font-medium hover:text-blue-800">Lihat Semua →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Jadwal Posyandu Balita Bulan Ini",
              date: "12 Okt 2026",
              desc: "Pelaksanaan posyandu balita akan diadakan di Balai Desa mulai pukul 08:00 WIB.",
              category: "Kesehatan"
            },
            {
              title: "Kerja Bakti Rutin Warga RW 02",
              date: "10 Okt 2026",
              desc: "Dihimbau kepada seluruh warga RW 02 untuk mengikuti kerja bakti membersihkan saluran air.",
              category: "Lingkungan"
            },
            {
              title: "Penyaluran BLT Dana Desa Tahap 3",
              date: "05 Okt 2026",
              desc: "Penyaluran BLT akan dilakukan secara bertahap sesuai jadwal masing-masing RT.",
              category: "Bansos"
            }
          ].map((news, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition cursor-pointer group">
              <div className="h-48 bg-slate-100 flex items-center justify-center">
                <FileText className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{news.category}</span>
                  <span className="text-xs text-slate-500">{news.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{news.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{news.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
