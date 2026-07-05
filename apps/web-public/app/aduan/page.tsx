"use client";

import { useState } from "react";
import { MessageSquare, CheckCircle } from "lucide-react";

export default function AduanPage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    nik: "", // opsional
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/public/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error("Gagal mengirim laporan");
      }
      setIsSubmitted(true);
      setFormData({ title: "", content: "", nik: "" });
    } catch (err) {
      console.error(err);
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
            Aduan Terkirim
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto">
            Terima kasih telah menyampaikan laporan Anda. Pihak desa akan segera
            menindaklanjuti laporan yang masuk.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200"
          >
            Buat Laporan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <MessageSquare className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Formulir Aduan Warga
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Sampaikan keluhan, masukan, kritik atau saran Anda mengenai pelayanan
          dan pembangunan desa.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Judul Laporan
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="Contoh: Jalan rusak di RT 01 RW 02"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Isi Laporan / Detail Aduan
            </label>
            <textarea
              required
              rows={5}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="Jelaskan secara detail keluhan atau masukan Anda..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              NIK Pelapor (Opsional)
            </label>
            <input
              type="text"
              value={formData.nik}
              onChange={(e) =>
                setFormData({ ...formData, nik: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="Kosongkan jika ingin melapor secara anonim"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? "Mengirim..." : "Kirim Laporan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
