"use client";
import { useEffect, useState } from "react";
import { Search, AlertCircle, Check, X, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function AduanPage() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<any>(null);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/complaints", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setComplaints(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchComplaints();
        toast.success("Status aduan berhasil diperbarui");
      } else {
        const error = await res.json();
        toast.error(error.message || "Gagal memperbarui status");
      }
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const filteredComplaints = complaints.filter((c: any) => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.resident && c.resident.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Aduan Masyarakat</h1>
          <p className="text-slate-500 mt-1 leading-relaxed">Kelola laporan dan aduan dari warga desa.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Aduan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full bg-slate-50 hover:bg-slate-100 transition-colors"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200">Subjek Aduan</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200">Pelapor</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200">Tanggal</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">Memuat data...</td></tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <MessageSquare className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">Data Tidak Ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint: any) => (
                  <tr key={complaint.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{complaint.title}</div>
                      <div className="text-sm text-slate-500 truncate max-w-xs">{complaint.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{complaint.resident?.name || 'Anonim'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(complaint.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                        ${complaint.status === 'Pending' ? 'bg-amber-100 text-amber-800' : ''}
                        ${complaint.status === 'Processed' ? 'bg-blue-100 text-blue-800' : ''}
                        ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => {
                          setActiveItem(complaint);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-slate-600 hover:text-slate-900 mr-4"
                        title="Lihat Detail"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                      {complaint.status === 'Pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(complaint.id, 'Processed')}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Proses Aduan"
                        >
                          <AlertCircle className="w-5 h-5" />
                        </button>
                      )}
                      {(complaint.status === 'Pending' || complaint.status === 'Processed') && (
                        <button 
                          onClick={() => handleUpdateStatus(complaint.id, 'Resolved')}
                          className="text-green-600 hover:text-green-900"
                          title="Tandai Selesai"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Detail Aduan</h3>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Pengirim</div>
                <div className="text-sm text-slate-900">{activeItem.resident?.name || "Anonim"} ({activeItem.resident?.nik || "-"})</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Tanggal</div>
                <div className="text-sm text-slate-900">{new Date(activeItem.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Judul Aduan</div>
                <div className="text-sm font-semibold text-slate-900">{activeItem.title}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Isi Aduan</div>
                <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">{activeItem.content}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Status</div>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                  activeItem.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                  activeItem.status === 'Processed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {activeItem.status === 'Resolved' ? 'Selesai' : activeItem.status === 'Processed' ? 'Diproses' : 'Pending'}
                </span>
              </div>
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
