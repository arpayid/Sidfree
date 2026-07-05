const fs = require('fs');
const path = require('path');

function fixDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('"use client";')) {
        content = content.replace(/"use client";/g, '');
        content = '"use client";\n' + content.trimStart();
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

fixDir('apps/web-admin/app');
fixDir('apps/web-public/app');
