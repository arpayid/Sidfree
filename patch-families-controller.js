const fs = require('fs');
let file = fs.readFileSync('apps/api/src/families/families.controller.ts', 'utf8');

file = file.replace(
  `          : f.kkNumber,
    }));`,
  `          : f.kkNumber,
      residents: f.residents?.map(r => ({
        ...r,
        nik: r.nik && r.nik.length >= 8 ? r.nik.replace(/(.{4}).*(.{4})/, "$1********$2") : r.nik
      })) || []
    }));`
);

fs.writeFileSync('apps/api/src/families/families.controller.ts', file);
