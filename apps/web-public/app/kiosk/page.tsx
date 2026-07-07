"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function KioskPage() {
  const [nik, setNik] = useState("");
  const [step, setStep] = useState(1);
  const [resident, setResident] = useState<{name: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumpad = (num: string) => {
    if (nik.length < 16) setNik(nik + num);
  };
  
  const handleDelete = () => {
    setNik(nik.slice(0, -1));
  };

  const handleLogin = async () => {
    if (nik.length !== 16) {
      toast.error("NIK harus 16 digit");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/public/payments/billing?nik=${nik}`);
      if (res.ok) {
        const data = await res.json();
        setResident(data.resident);
        setStep(2);
      } else {
        toast.error("NIK tidak terdaftar");
      }
    } catch (e) {
      toast.error("Terjadi kesalahan jaringan");
    }
    setLoading(false);
  };

  const handlePrint = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/public/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nik, type, keperluan: "Kiosk Self-Service" })
      });
      if (res.ok) {
        toast.success(`Pengajuan ${type} berhasil! Silakan ambil cetakan atau tunggu validasi TTE dari Kepala Desa.`, { duration: 5000 });
        setStep(1);
        setNik("");
        setResident(null);
      } else {
        toast.error("Gagal mengajukan surat.");
      }
    } catch (e) {
      toast.error("Terjadi kesalahan");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-8 select-none relative">
      <div className="absolute top-8 right-8 flex gap-4">
        <a href="/" className="bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-full shadow-sm border border-slate-200 font-medium transition-all active:scale-95 text-lg">
          🏠 Kembali ke Home
        </a>
      </div>
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-10 text-center">
        {step === 1 && (
          <>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Anjungan Pelayanan Mandiri</h1>
            <p className="text-xl text-slate-500 mb-8">Masukkan NIK Anda untuk memulai</p>
            
            <div className="text-4xl font-mono bg-slate-100 py-6 rounded-xl mb-8 tracking-[0.2em] min-h-[80px] flex items-center justify-center border-2 border-slate-200">
              {nik || <span className="text-slate-300">_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</span>}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} onClick={() => handleNumpad(n.toString())} className="bg-slate-50 hover:bg-slate-200 text-3xl font-bold py-6 rounded-2xl transition-colors shadow-sm border border-slate-200 active:scale-95">
                  {n}
                </button>
              ))}
              <button onClick={handleDelete} className="bg-red-50 hover:bg-red-100 text-red-500 text-xl font-bold py-6 rounded-2xl transition-colors shadow-sm border border-red-100 active:scale-95">
                Hapus
              </button>
              <button onClick={() => handleNumpad("0")} className="bg-slate-50 hover:bg-slate-200 text-3xl font-bold py-6 rounded-2xl transition-colors shadow-sm border border-slate-200 active:scale-95">
                0
              </button>
              <button onClick={handleLogin} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-6 rounded-2xl transition-colors shadow-md active:scale-95 disabled:opacity-50">
                {loading ? "Cek..." : "Masuk"}
              </button>
            </div>
          </>
        )}

        {step === 2 && resident && (
          <>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Selamat Datang,</h1>
            <h2 className="text-3xl text-blue-600 font-medium mb-12">{resident.name}</h2>
            
            <h3 className="text-2xl font-medium text-slate-700 mb-6">Pilih Layanan Mandiri:</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-12">
              {[
                { type: "Surat Keterangan Tidak Mampu", icon: "📄" },
                { type: "Surat Pengantar RT/RW", icon: "📝" },
                { type: "Surat Domisili", icon: "🏠" },
                { type: "Surat Keterangan Usaha", icon: "🏪" },
              ].map(doc => (
                <button 
                  key={doc.type} 
                  onClick={() => handlePrint(doc.type)}
                  disabled={loading}
                  className="bg-white hover:bg-blue-50 text-slate-700 p-8 rounded-2xl border-2 border-slate-200 shadow-sm transition-all hover:border-blue-400 hover:shadow-md flex flex-col items-center gap-4 active:scale-95 disabled:opacity-50"
                >
                  <span className="text-6xl">{doc.icon}</span>
                  <span className="text-xl font-medium text-center">{doc.type}</span>
                </button>
              ))}
            </div>

            <button onClick={() => { setStep(1); setNik(""); setResident(null); }} className="text-slate-500 hover:text-slate-800 text-xl font-medium px-8 py-4 border-2 border-slate-200 rounded-full">
              ← Selesai & Keluar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
