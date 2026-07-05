const fs = require('fs');
let page = fs.readFileSync('apps/web-admin/app/keluarga/page.tsx', 'utf8');

if (!page.includes('isDetailModalOpen')) {
  page = page.replace(
    'const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);',
    'const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);\n  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);'
  );
  
  page = page.replace(
    'import { Plus, Search, Edit2, Trash2, Users, X, AlertTriangle } from "lucide-react";',
    'import { Plus, Search, Edit2, Trash2, Users, X, AlertTriangle, Eye } from "lucide-react";'
  );

  page = page.replace(
    `className="text-blue-600 hover:text-blue-900"`,
    `className="text-blue-600 hover:text-blue-900"`
  );

  // Add detail button
  page = page.replace(
    `<button
                        onClick={() => handleOpenForm(family)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Data"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>`,
    `<button
                        onClick={() => {
                          setActiveItem(family);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-slate-600 hover:text-slate-900 mr-3"
                        title="Lihat Detail Anggota"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenForm(family)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Data"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>`
  );

  // Add detail modal
  const detailModal = `
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
  `;

  page = page.replace('    </div>\n  );\n}', detailModal + '    </div>\n  );\n}');

  fs.writeFileSync('apps/web-admin/app/keluarga/page.tsx', page);
  console.log("Patched");
}
