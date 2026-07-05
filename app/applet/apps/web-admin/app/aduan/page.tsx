"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, Check, X, MessageSquare } from "lucide-react";

export default function AduanPage() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            placeholder="Cari aduan warga..."
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subjek Aduan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pelapor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">Memuat data...</td></tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <MessageSquare className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">Belum Ada Aduan</p>
                      <p className="text-sm text-slate-500">Aduan dari warga akan muncul di sini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                complaints.map((complaint: any) => (
                  <tr key={complaint.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{complaint.title}</div>
                      <div className="text-sm text-slate-500 truncate max-w-xs">{complaint.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{complaint.resident?.name || 'Anonim'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(complaint.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${complaint.status === 'Pending' ? 'bg-amber-100 text-amber-800' : ''}
                        ${complaint.status === 'Processed' ? 'bg-blue-100 text-blue-800' : ''}
                        ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
    </div>
  );
}
