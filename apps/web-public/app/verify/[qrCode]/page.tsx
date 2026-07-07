
"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ShieldCheck, FileSignature } from "lucide-react";

export default function VerifyLetter({ params }: { params: { qrCode: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/letters/verify/${params.qrCode}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.qrCode]);

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Memverifikasi Dokumen ke Sistem...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <ShieldCheck className="w-64 h-64 -mt-10 -mr-10" />
          </div>
          <h1 className="text-3xl font-bold text-white relative z-10 tracking-tight">Portal Verifikasi TTE</h1>
          <p className="text-slate-400 mt-2 relative z-10">Pemerintah Desa Sukamaju</p>
        </div>
        
        <div className="p-8">
          {data?.valid ? (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Dokumen Sah & Valid</h2>
              <p className="text-slate-500 text-center mb-8 px-4">Dokumen ini telah ditandatangani secara elektronik dan tercatat resmi dalam sistem <strong>SIDPRO</strong>.</p>
              
              <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100"><FileSignature className="w-5 h-5 text-blue-500" /></div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Jenis Dokumen</p>
                    <p className="text-lg font-medium text-slate-800">{data.letter.type}</p>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-200"></div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">Atas Nama</p>
                    <p className="font-medium text-slate-800">{data.letter.residentName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">Diterbitkan Oleh</p>
                    <p className="font-medium text-slate-800">{data.letter.tenantName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">Tanggal Disahkan</p>
                    <p className="font-medium text-slate-800">{new Date(data.letter.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">Status Sistem</p>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Tercatat Aktif
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Dokumen Tidak Dikenali</h2>
              <p className="text-slate-600 text-center bg-red-50 p-4 rounded-xl border border-red-100">
                Peringatan: Dokumen ini tidak ditemukan di dalam sistem atau QR Code yang dipindai tidak valid. Harap waspada terhadap pemalsuan dokumen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
