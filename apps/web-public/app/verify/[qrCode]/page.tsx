"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

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

  if (loading) return <div className="p-8 text-center">Memverifikasi...</div>;

  return (
    <div className="max-w-md mx-auto p-8 mt-10 bg-white rounded-2xl shadow-xl text-center">
      {data?.valid ? (
        <>
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Dokumen Valid</h1>
          <div className="text-left bg-slate-50 p-4 rounded-xl mt-6 space-y-2">
            <p><span className="text-slate-500">Jenis:</span> {data.letter.type}</p>
            <p><span className="text-slate-500">Pemohon:</span> {data.letter.residentName}</p>
            <p><span className="text-slate-500">Penerbit:</span> {data.letter.tenantName}</p>
            <p><span className="text-slate-500">Tanggal:</span> {new Date(data.letter.date).toLocaleDateString('id-ID')}</p>
          </div>
        </>
      ) : (
        <>
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Dokumen Tidak Valid</h1>
          <p className="text-slate-600">Surat ini tidak ditemukan di dalam sistem atau mungkin palsu.</p>
        </>
      )}
    </div>
  );
}
