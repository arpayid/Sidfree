const fs = require('fs');

['apps/web-admin/package.json', 'apps/web-public/package.json'].forEach(file => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.scripts.build = "NODE_ENV=production next build";
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});
