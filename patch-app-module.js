const fs = require('fs');
const file = 'apps/api/src/app.module.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { AppController } from './app.controller';",
  "import { AppController } from './app.controller';\nimport { PublicController } from './public.controller';"
);

content = content.replace(
  "controllers: [AppController],",
  "controllers: [AppController, PublicController],"
);

fs.writeFileSync(file, content);
