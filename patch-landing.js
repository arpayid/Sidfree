const fs = require('fs');

let page = fs.readFileSync('apps/web-public/app/page.tsx', 'utf8');

const newsSection = `
      {/* News & Announcements Section */}
      <div className="mt-24 border-t border-slate-200 pt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Berita & Pengumuman</h2>
            <p className="mt-2 text-lg text-slate-500">Kabar terbaru dari Desa Sukamaju.</p>
          </div>
          <a href="#" className="text-blue-600 font-medium hover:text-blue-800">Lihat Semua →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Jadwal Posyandu Balita Bulan Ini",
              date: "12 Okt 2026",
              desc: "Pelaksanaan posyandu balita akan diadakan di Balai Desa mulai pukul 08:00 WIB.",
              category: "Kesehatan"
            },
            {
              title: "Kerja Bakti Rutin Warga RW 02",
              date: "10 Okt 2026",
              desc: "Dihimbau kepada seluruh warga RW 02 untuk mengikuti kerja bakti membersihkan saluran air.",
              category: "Lingkungan"
            },
            {
              title: "Penyaluran BLT Dana Desa Tahap 3",
              date: "05 Okt 2026",
              desc: "Penyaluran BLT akan dilakukan secara bertahap sesuai jadwal masing-masing RT.",
              category: "Bansos"
            }
          ].map((news, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition cursor-pointer group">
              <div className="h-48 bg-slate-100 flex items-center justify-center">
                <FileText className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{news.category}</span>
                  <span className="text-xs text-slate-500">{news.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{news.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{news.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
`;

page = page.replace('    </div>\n  );\n}', newsSection + '    </div>\n  );\n}');
fs.writeFileSync('apps/web-public/app/page.tsx', page);
