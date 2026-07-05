const fs = require('fs');
const file = 'apps/web-admin/app/AdminLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `          <Link 
            href="/penduduk" 
            className={\`flex items-center px-3 py-2 rounded-lg text-sm font-medium \${pathname.startsWith('/penduduk') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}\`}
          >
            <Users className="w-5 h-5 mr-3" />
            Data Penduduk
          </Link>`;

const newStr = `          <Link 
            href="/penduduk" 
            className={\`flex items-center px-3 py-2 rounded-lg text-sm font-medium \${pathname.startsWith('/penduduk') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}\`}
          >
            <Users className="w-5 h-5 mr-3" />
            Data Penduduk
          </Link>
          <Link 
            href="/keluarga" 
            className={\`flex items-center px-3 py-2 rounded-lg text-sm font-medium \${pathname.startsWith('/keluarga') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}\`}
          >
            <Users className="w-5 h-5 mr-3" />
            Data Keluarga
          </Link>`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(file, content);
