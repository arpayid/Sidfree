"use client";
import { useEffect, useState } from "react";

export default function PotensiDesaPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/businesses')
      .then(res => res.json())
      .then(data => {
        setBusinesses(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Potensi Desa & UMKM</h1>
      <p className="text-slate-600 mb-8">Jelajahi produk lokal dan kerajinan karya warga desa.</p>
      
      {loading ? (
        <p>Memuat...</p>
      ) : businesses.length === 0 ? (
        <p className="text-slate-500">Belum ada data UMKM.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-400">
                {b.imageUrl ? <img src={b.imageUrl} alt={b.name} className="w-full h-full object-cover"/> : "No Image"}
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{b.category}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{b.name}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{b.description}</p>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Oleh: {b.resident.name}</span>
                  <a href={`https://wa.me/${b.contact?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-700 text-sm font-bold">
                    Hubungi
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
