"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  FileOutput,
  X,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [families, setFamilies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active item state
  const [activeItem, setActiveItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    nik: "",
    name: "",
    status: "Aktif",
    familyId: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [resResidents, resFamilies] = await Promise.all([
        fetch("/api/residents", { headers }),
        fetch("/api/families", { headers }),
      ]);
      if (resResidents.ok) {
        setResidents(await resResidents.json());
      }
      if (resFamilies.ok) {
        setFamilies(await resFamilies.json());
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenForm = (resident = null) => {
    if (resident) {
      setActiveItem(resident);
      setFormData({
        nik: resident.nik,
        name: resident.name,
        status: resident.status,
        familyId: resident.familyId || "",
      });
    } else {
      setActiveItem(null);
      setFormData({ nik: "", name: "", status: "Aktif", familyId: "" });
    }
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (resident: any) => {
    setActiveItem(resident);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const method = activeItem ? "PUT" : "POST";
      const url = activeItem
        ? `/api/residents/${activeItem.id}`
        : "/api/residents";

      // Filter out empty familyId if not selected
      const bodyPayload = { ...formData };
      if (!bodyPayload.familyId) delete bodyPayload.familyId;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });
      if (res.ok) {
        setIsFormModalOpen(false);
        fetchData();
        toast.success(activeItem ? "Data penduduk berhasil diperbarui" : "Data penduduk berhasil ditambahkan");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save data");
      }
    } catch (err) {
      console.error("Failed to save", err);
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const handleDelete = async () => {
    if (!activeItem) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/residents/${activeItem.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        fetchData();
        toast.success("Data penduduk berhasil dihapus");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to delete data");
      }
    } catch (err) {
      console.error("Failed to delete", err);
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const exportToCSV = () => {
    if (residents.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }
    const headers = ["NIK", "Nama Lengkap", "Nomor KK", "Jenis Kelamin", "Tanggal Lahir", "Alamat", "Pekerjaan"];
    const csvData = residents.map((r: any) => [
      r.nik,
      r.name,
      r.family?.kkNumber || "-",
      r.gender,
      r.birthDate ? new Date(r.birthDate).toLocaleDateString("id-ID") : "-",
      `"${r.address || "-"}"`,
      r.occupation || "-"
    ]);
    
    const csvContent = [headers.join(","), ...csvData.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Penduduk_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Data berhasil diekspor");
  };

  const filteredResidents = residents.filter(
    (r: any) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nik.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            placeholder="Cari penduduk (NIK atau Nama)..."
          />
        </div>

        <div className="flex gap-2">
          <button onClick={exportToCSV} className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <FileOutput className="w-4 h-4 mr-2" />
            Ekspor
          </button>
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Data
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  NIK
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Nama
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  No. KK
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-slate-500"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : filteredResidents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-slate-500"
                  >
                    Data tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredResidents.map((resident: any) => (
                  <tr key={resident.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {resident.nik}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {resident.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {resident.family?.kkNumber || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resident.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {resident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenForm(resident)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(resident)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {activeItem ? "Edit Data Penduduk" : "Tambah Data Penduduk"}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  NIK
                </label>
                <input
                  required
                  type="text"
                  value={formData.nik}
                  onChange={(e) =>
                    setFormData({ ...formData, nik: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Keluarga (No. KK)
                </label>
                <select
                  value={formData.familyId}
                  onChange={(e) =>
                    setFormData({ ...formData, familyId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">-- Tidak Tautkan KK --</option>
                  {families.map((fam: any) => (
                    <option key={fam.id} value={fam.id}>
                      {fam.kkNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Pindah">Pindah</option>
                  <option value="Meninggal">Meninggal</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  {activeItem ? "Simpan Perubahan" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Hapus Penduduk
            </h3>
            <p className="text-slate-500 mb-6">
              Apakah Anda yakin ingin menghapus data penduduk{" "}
              <strong>{activeItem?.name}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 rounded-lg font-medium text-white hover:bg-red-700"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
