import { FileText, MessageSquare, Info, ShieldCheck, ArrowRight, Wallet, Store } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Portal Resmi Desa Sukamaju
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
            Pelayanan Publik <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Lebih Cepat & Transparan
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10">
            Sistem Informasi Desa Mandiri & Terpadu (SIDPRO). Mengurus surat, melaporkan aduan, dan mengakses informasi desa kini bisa dilakukan dari rumah.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/layanan" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all active:scale-95 shadow-lg shadow-blue-900/20">
              Urus Surat Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/kiosk" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold transition-all active:scale-95 backdrop-blur-sm">
              Mode Anjungan (Kiosk)
            </Link>
          </div>
        </div>
      </section>

      {/* Main Services Bento Grid */}
      <section className="py-20 bg-slate-50 relative -mt-10 rounded-t-[3rem] z-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Layanan Unggulan Desa</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Akses berbagai layanan administratif dan publik dengan mudah, cepat, dan terintegrasi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Surat Card */}
            <Link href="/layanan" className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Layanan Surat</h3>
              <p className="text-slate-500 mb-6 flex-grow">Ajukan pengantar RT/RW, SKTM, domisili, dan lainnya secara online tanpa perlu antre di balai desa.</p>
              <div className="text-blue-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Mulai Pengajuan <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Aduan Card */}
            <Link href="/aduan" className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Aduan Warga</h3>
              <p className="text-slate-500 mb-6 flex-grow">Sampaikan keluhan, kritik, atau saran untuk pembangunan dan ketertiban desa yang lebih baik.</p>
              <div className="text-rose-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Buat Laporan <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Verifikasi TTE Card */}
            <div className="group bg-slate-900 rounded-3xl p-8 shadow-md border border-slate-800 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-32 h-32 text-white" />
              </div>
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Verifikasi TTE</h3>
              <p className="text-slate-400 mb-6 flex-grow relative z-10">Scan QR Code pada surat yang dicetak untuk memverifikasi keaslian Tanda Tangan Elektronik Kepala Desa.</p>
              <div className="text-emerald-400 font-medium inline-flex items-center gap-1">
                Gunakan Scanner QR di HP Anda
              </div>
            </div>

            {/* UMKM Card */}
            <Link href="/potensi" className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Store className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Etalase UMKM</h3>
              <p className="text-slate-500 mb-6 flex-grow">Jelajahi produk lokal unggulan dan kerajinan tangan hasil karya warga Desa Sukamaju.</p>
              <div className="text-amber-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Lihat Potensi <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Pembayaran Card */}
            <Link href="/pembayaran" className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Info Tagihan</h3>
              <p className="text-slate-500 mb-6 flex-grow">Cek tagihan PBB, retribusi sampah, dan iuran warga lainnya secara transparan.</p>
              <div className="text-purple-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Cek Tagihan <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

             {/* Info Card */}
             <Link href="#" className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Info className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Informasi Publik</h3>
              <p className="text-slate-500 mb-6 flex-grow">Akses transparansi APBDes, berita desa terkini, dan pengumuman penting.</p>
              <div className="text-teal-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Pusat Informasi <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
             <div className="text-center py-4">
               <div className="text-5xl font-extrabold text-slate-900 tracking-tight">3.245</div>
               <div className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">Penduduk</div>
             </div>
             <div className="text-center py-4">
               <div className="text-5xl font-extrabold text-slate-900 tracking-tight">912</div>
               <div className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">Keluarga</div>
             </div>
             <div className="text-center py-4">
               <div className="text-5xl font-extrabold text-slate-900 tracking-tight">1.450</div>
               <div className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">Surat Selesai</div>
             </div>
             <div className="text-center py-4">
               <div className="text-5xl font-extrabold text-slate-900 tracking-tight">98<span className="text-3xl">%</span></div>
               <div className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">Aduan Tuntas</div>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
