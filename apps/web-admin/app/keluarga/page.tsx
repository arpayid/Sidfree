"use client";
import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, Users, X, AlertTriangle, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function KeluargaPage() {
  const [families, setFamilies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Active item state
  const [activeItem, setActiveItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    kkNumber: "",
    address: "",
    rt: "",
    rw: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/families", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setFamilies(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch families", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenForm = (family = null) => {
    if (family) {
      setActiveItem(family);
      setFormData({
        kkNumber: family.kkNumber,
        address: family.address,
        rt: family.rt || "",
        rw: family.rw || "",
      });
    } else {
      setActiveItem(null);
      setFormData({ kkNumber: "", address: "", rt: "", rw: "" });
    }
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (family: any) => {
    setActiveItem(family);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const method = activeItem ? "PUT" : "POST";
      const url = activeItem ? `/api/families/${activeItem.id}` : "/api/families";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsFormModalOpen(false);
        fetchData();
        toast.success(activeItem ? "Data keluarga berhasil diperbarui" : "Data keluarga berhasil ditambahkan");
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Gagal menyimpan data keluarga");
      }
    } catch (err) {
      console.error("Failed to save family", err);
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/families/${activeItem.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        fetchData();
        toast.success("Data keluarga berhasil dihapus");
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Gagal menghapus data");
      }
    } catch (err) {
      console.error("Failed to delete family", err);
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const filteredFamilies = families.filter(
    (f: any) =>
      f.kkNumber.includes(searchQuery) ||
      (f.address && f.address.toLowerCase().includes(searchQuery.toLowerCase()))
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
            placeholder="Cari nomor KK atau alamat..."
          />
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Data
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">No. KK</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Anggota</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Alamat</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">RT / RW</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">Memuat data...</td>
                </tr>
              ) : filteredFamilies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">Data Tidak Ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFamilies.map((family: any) => (
                  <tr key={family.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{family.kkNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {family.residents && family.residents.length > 0 ? `${family.residents.length} Anggota` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{family.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{family.rt} / {family.rw}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenForm(family)} className="text-blue-600 hover:text-blue-900 mr-4" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenDelete(family)} className="text-red-600 hover:text-red-900" title="Hapus">
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
              <h3 className="text-lg font-semibold text-slate-900">{activeItem ? 'Edit Data Keluarga (KK)' : 'Tambah Data Keluarga (KK)'}</h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor KK</label>
                <input
                  required
                  type="text"
                  value={formData.kkNumber}
                  onChange={(e) => setFormData({ ...formData, kkNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="16 Digit Nomor KK"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                <input
                  required
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Alamat Domisili"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">RT</label>
                  <input
                    type="text"
                    value={formData.rt}
                    onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">RW</label>
                  <input
                    type="text"
                    value={formData.rw}
                    onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="002"
                  />
                </div>
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
                  {activeItem ? 'Simpan Perubahan' : 'Simpan'}
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Data KK</h3>
            <p className="text-slate-500 mb-6">
              Apakah Anda yakin ingin menghapus data KK <strong>{activeItem?.kkNumber}</strong>? Tindakan ini tidak dapat dibatalkan.
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

      {isDetailModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Detail Kartu Keluarga</h3>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <div className="text-sm font-medium text-slate-500">Nomor KK</div>
                  <div className="font-semibold text-slate-900">{activeItem.kkNumber}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-500">Alamat</div>
                  <div className="text-slate-900">{activeItem.address} RT {activeItem.rt} / RW {activeItem.rw}</div>
                </div>
              </div>
              
              <h4 className="font-semibold text-slate-900 mb-4">Daftar Anggota Keluarga</h4>
              {activeItem.residents && activeItem.residents.length > 0 ? (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">NIK</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nama</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {activeItem.residents.map((r: any) => (
                        <tr key={r.id}>
                          <td className="px-4 py-3 text-sm text-slate-900">{r.nik}</td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{r.name}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 border border-slate-200 rounded-lg bg-slate-50">
                  Belum ada anggota keluarga terdaftar.
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
  );
}
