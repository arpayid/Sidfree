"use client";
import { useEffect, useState } from "react";
import { Search, FileText, Check, X, FileOutput, Printer } from "lucide-react";

export default function SuratPage() {
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLetters = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/letters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setLetters(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch letters", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/letters/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchLetters();
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
            placeholder="Cari pengajuan surat..."
          />
        </div>

        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <FileOutput className="w-4 h-4 mr-2" />
            Rekap Data
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
                  Tipe Surat
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Pemohon
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Tanggal
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
              ) : letters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">
                        Belum Ada Pengajuan Surat
                      </p>
                      <p className="text-sm text-slate-500">
                        Pengajuan surat baru dari warga akan muncul di sini.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                letters.map((letter: any) => (
                  <tr key={letter.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {letter.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {letter.resident?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(letter.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${letter.status === "Pending" ? "bg-amber-100 text-amber-800" : ""}
                        ${letter.status === "Approved" ? "bg-green-100 text-green-800" : ""}
                        ${letter.status === "Rejected" ? "bg-red-100 text-red-800" : ""}
                        ${letter.status === "Printed" ? "bg-blue-100 text-blue-800" : ""}
                      `}
                      >
                        {letter.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {letter.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(letter.id, "Approved")
                            }
                            className="text-green-600 hover:text-green-900 mr-4"
                            title="Setujui"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(letter.id, "Rejected")
                            }
                            className="text-red-600 hover:text-red-900"
                            title="Tolak"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {(letter.status === "Approved" ||
                        letter.status === "Printed") && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(letter.id, "Printed")
                          }
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          title="Cetak Surat"
                        >
                          <Printer className="w-5 h-5" />
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
