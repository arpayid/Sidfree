const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('packages/database/package.json', 'utf8'));
pkg.scripts.seed = "tsx seed.ts";
fs.writeFileSync('packages/database/package.json', JSON.stringify(pkg, null, 2));
