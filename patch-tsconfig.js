const fs = require('fs');
let code = fs.readFileSync('apps/api/tsconfig.json', 'utf8');
code = code.replace(/"noFallbackArgs": false/g, '');
fs.writeFileSync('apps/api/tsconfig.json', code);
