"use client";
import { useEffect, useState } from "react";
import { Search, FileText, Check, X, FileOutput, Printer, PenTool } from "lucide-react";
import toast from "react-hot-toast";

export default function SuratPage() {
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handlePrintLetter = (letter: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Surat ${letter.type}</title>
            <style>
              body { font-family: 'Times New Roman', Times, serif; line-height: 1.6; padding: 40px; }
              .header { text-align: center; border-bottom: 2px solid black; margin-bottom: 20px; padding-bottom: 10px; }
              .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
              .header h2 { margin: 5px 0 0 0; font-size: 18px; font-weight: normal; }
              .content { margin-top: 30px; }
              .footer { margin-top: 50px; text-align: right; }
              .footer-signature { margin-top: 80px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>PEMERINTAH DESA SUKAMAJU</h1>
              <h2>KECAMATAN MAJU JAYA, KABUPATEN INDONESIA</h2>
              <p style="margin: 0;">Jl. Raya Sukamaju No. 1 Kode Pos 12345</p>
            </div>
            <div class="content">
              <h3 style="text-align: center; text-decoration: underline; text-transform: uppercase;">${letter.type}</h3>
              <p>Yang bertanda tangan di bawah ini Kepala Desa Sukamaju, menerangkan dengan sebenarnya bahwa:</p>
              <table style="margin: 20px 0; width: 100%;">
                <tr><td style="width: 200px;">Nama</td><td>: ${letter.resident?.name || '-'}</td></tr>
                <tr><td>NIK</td><td>: ${letter.resident?.nik || '-'}</td></tr>
              </table>
              <p>Surat keterangan ini diberikan untuk keperluan yang bersangkutan. Demikian surat ini dibuat agar dapat dipergunakan sebagaimana mestinya.</p>
            </div>
            <div class="footer">
              <p>Sukamaju, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>Kepala Desa,</p>
              <div class="footer-signature">
                <p><strong>Bpk. Ahmad Subarjo</strong></p>
                ${letter.signature ? `<p style="font-size:12px;color:#666">Telah ditandatangani secara elektronik (TTE)<br/>ID: ${letter.signature}</p>` : ''}
              </div>
            </div>
            ${letter.qrCode ? `
            <div style="margin-top:40px;text-align:center;font-size:14px;color:#444">
              <p>Scan atau kunjungi URL berikut untuk memverifikasi keaslian surat:</p>
              <p><strong>https://sidpro.desa.id/verify/${letter.qrCode}</strong></p>
            </div>
            ` : ''}
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Update status to Printed if not already
      if (letter.status !== "Printed") {
        handleUpdateStatus(letter.id, "Printed");
      }
    }
  };

  const handleSignLetter = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/letters/${id}/sign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchLetters();
        toast.success("Surat berhasil ditandatangani secara digital (TTE)");
      } else {
        const error = await res.json();
        toast.error(error.message || "Gagal TTE");
      }
    } catch (err) {
      console.error("Failed to sign", err);
      toast.error("Terjadi kesalahan sistem");
    }
  };

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
        toast.success("Status surat berhasil diperbarui");
      } else {
        const error = await res.json();
        toast.error(error.message || "Gagal memperbarui status");
      }
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const exportToCSV = () => {
    if (letters.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }
    const headers = ["ID", "Tipe Surat", "Nama Pemohon", "NIK", "Tanggal Pengajuan", "Status"];
    const csvData = letters.map((l: any) => [
      l.id,
      `"${l.type}"`,
      `"${l.resident?.name || "-"}"`,
      `"${l.resident?.nik || "-"}"`,
      new Date(l.createdAt).toLocaleDateString("id-ID"),
      l.status
    ]);
    
    const csvContent = [headers.join(","), ...csvData.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Pengajuan_Surat_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Data surat berhasil diekspor");
  };

  const filteredLetters = letters.filter((l: any) => 
    l.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (l.resident && l.resident.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Layanan Surat</h1>
          <p className="text-slate-500 mt-1 leading-relaxed">Kelola permohonan surat dari warga desa.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pemohon surat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full bg-slate-50 hover:bg-slate-100 transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={exportToCSV} className="flex items-center px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
              <FileOutput className="w-4 h-4 mr-2" />
              Rekap Data
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200"
                >
                  Tipe Surat
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200"
                >
                  Pemohon
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200"
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
              ) : filteredLetters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900">
                        Data Tidak Ditemukan
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLetters.map((letter: any) => (
                  <tr key={letter.id} className="hover:bg-slate-50/80 transition-colors">
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
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
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
                            onClick={() => handleSignLetter(letter.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                            title="Setujui"
                          >
                            <PenTool className="w-5 h-5" />
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
                          onClick={() => handlePrintLetter(letter)}
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
