"use client";

import { useState } from "react";
import { FileText, CheckCircle } from "lucide-react";

export default function LayananSuratPage() {
  const [formData, setFormData] = useState({
    nik: "",
    type: "Surat Keterangan Tidak Mampu (SKTM)",
    keperluan: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // In a real app we'd first verify NIK to find resident ID
      // Since this is public form, we'd have a public endpoint that takes NIK
      // For this demo, let's assume we find a resident using the API
      // Since it's public we don't have token, we'll just mock this for UI

      const res = await fetch("/api/public/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengirim pengajuan");
      }
      setIsSubmitted(true);
      setFormData({
        nik: "",
        type: "Surat Keterangan Tidak Mampu (SKTM)",
        keperluan: "",
      });
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Pengajuan Berhasil
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto">
            Pengajuan surat Anda telah terkirim ke admin desa dan sedang
            diproses. Silakan cek status secara berkala.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Ajukan Surat Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Layanan Surat Online
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Silakan lengkapi formulir di bawah ini untuk mengajukan surat
          pengantar dari desa.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              NIK Pemohon
            </label>
            <input
              type="text"
              required
              value={formData.nik}
              onChange={(e) =>
                setFormData({ ...formData, nik: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Masukkan 16 digit NIK Anda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Jenis Surat
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="Surat Keterangan Tidak Mampu (SKTM)">
                Surat Keterangan Tidak Mampu (SKTM)
              </option>
              <option value="Surat Pengantar Domisili">
                Surat Pengantar Domisili
              </option>
              <option value="Surat Keterangan Usaha (SKU)">
                Surat Keterangan Usaha (SKU)
              </option>
              <option value="Surat Pengantar Nikah">
                Surat Pengantar Nikah
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Keperluan (Opsional)
            </label>
            <textarea
              rows={3}
              value={formData.keperluan}
              onChange={(e) =>
                setFormData({ ...formData, keperluan: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Jelaskan keperluan pembuatan surat secara singkat"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? "Memproses..." : "Ajukan Surat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
