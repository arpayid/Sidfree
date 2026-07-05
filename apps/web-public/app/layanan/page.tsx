'use client';
import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader, FileText } from 'lucide-react';

export default function LayananSuratPage() {
  const [formData, setFormData] = useState({
    nik: '',
    type: 'SKTM',
    keperluan: '',
  });

  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = async (e) => {
    const type = e.target.value;
    setFormData({ ...formData, type });
    
    // Fetch AI template suggestion
    setLoading(true);
    try {
      const res = await fetch('/api/public/ai-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      setAiSuggestion(data.template);
    } catch (error) {
      console.error('Failed to fetch template:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/public/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setSuccess(true);
        setFormData({ nik: '', type: 'SKTM', keperluan: '' });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat pengajuan');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Layanan Surat Desa</h1>
        <p className="text-gray-600 mb-8">Ajukan surat secara online dengan mudah dan cepat</p>
      </div>
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900">Berhasil!</p>
            <p className="text-sm text-green-800">Surat Anda telah diajukan. Silakan tunggu konfirmasi melalui email.</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow border border-slate-200">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">NIK Anda</label>
          <input
            type="text"
            maxLength={16}
            pattern="[0-9]{16}"
            required
            value={formData.nik}
            onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Masukkan 16 digit NIK"
          />
          <p className="text-xs text-gray-500 mt-1">Format: 16 digit angka (cth: 1234567890123456)</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Jenis Surat</label>
          <select
            value={formData.type}
            onChange={handleTypeChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
          >
            <option value="SKTM">Surat Keterangan Tak Mampu (SKTM)</option>
            <option value="Domisili">Surat Keterangan Domisili</option>
            <option value="Pengantar">Surat Pengantar RT/RW</option>
            <option value="Keterangan Usaha">Surat Keterangan Usaha</option>
          </select>
        </div>

        {loading && (
          <div className="flex items-center text-sm text-blue-600">
            <Loader className="w-4 h-4 animate-spin mr-2" />
            Generating AI Template preview...
          </div>
        )}

        {aiSuggestion && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-2">Saran AI / Preview Template:</p>
                <div className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">{aiSuggestion}</div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Keperluan</label>
          <textarea
            value={formData.keperluan}
            onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Jelaskan keperluan Anda (cth: Mendaftar sekolah, membuka usaha, dll)"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Ajukan Surat
            </>
          )}
        </button>
      </form>
    </div>
  );
}
