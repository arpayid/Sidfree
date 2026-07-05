const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.test = "jest";
pkg.scripts["test:watch"] = "jest --watch";
pkg.scripts["test:cov"] = "jest --coverage";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
