const fs = require('fs');
const file = '/app/applet/apps/web-admin/app/AdminLayout.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  'Settings, LogOut, Menu } from "lucide-react";',
  'Settings, LogOut, Menu, MessageSquare } from "lucide-react";'
);
content = content.replace(
  '<Link \n            href="/pengaturan"',
  `<Link \n            href="/aduan" \n            className={\`flex items-center px-3 py-2 rounded-lg text-sm font-medium \${pathname.startsWith('/aduan') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}\`}\n          >\n            <MessageSquare className="w-5 h-5 mr-3" />\n            Aduan Warga\n          </Link>\n          <Link \n            href="/pengaturan"`
);
fs.writeFileSync(file, content);
