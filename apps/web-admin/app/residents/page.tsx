import { Search, Plus, Filter, MoreVertical, ShieldAlert } from "lucide-react";

export default function ResidentsPage() {
  // Mock data for MVP display
  const residents = [
    {
      id: 1,
      name: "Budi Santoso",
      nik: "3271********0001",
      kk: "3271********0010",
      address: "Jl. Merdeka No. 42",
      status: "Aktif",
    },
    {
      id: 2,
      name: "Siti Aminah",
      nik: "3271********0002",
      kk: "3271********0010",
      address: "Jl. Merdeka No. 42",
      status: "Aktif",
    },
    {
      id: 3,
      name: "Ahmad Dahlan",
      nik: "3271********0003",
      kk: "3271********0022",
      address: "Gg. Manggis No. 12",
      status: "Pindah",
    },
    {
      id: 4,
      name: "Rina Wati",
      nik: "3271********0004",
      kk: "3271********0031",
      address: "Perum. Asri Blok C2",
      status: "Aktif",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Data Warga (Resident)
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Kelola data penduduk desa. Data NIK/KK disamarkan (masked) sesuai UU
            PDP.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" />
          Tambah Warga
        </button>
      </div>

      {/* Security Warning */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
        <div>
          <strong>Perhatian (Audit Log Aktif):</strong> Setiap akses untuk
          melihat NIK lengkap, mencetak KK, atau mengubah data penduduk akan
          dicatat di sistem Audit Logging.
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan Nama atau NIK..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition w-full sm:w-auto">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">NIK (Masked)</th>
                <th className="px-6 py-4">No. KK (Masked)</th>
                <th className="px-6 py-4">Alamat Domisili</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {residents.map((resident) => (
                <tr key={resident.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {resident.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {resident.nik}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{resident.kk}</td>
                  <td className="px-6 py-4 truncate max-w-xs">
                    {resident.address}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        resident.status === "Aktif"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {resident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Menampilkan 1-4 dari 4,250 data warga</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">
              Sebelumnya
            </button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
