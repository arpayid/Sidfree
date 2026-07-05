const fs = require('fs');
let content = fs.readFileSync('apps/api/src/app.module.ts', 'utf8');

if (!content.includes('DashboardModule')) {
    content = content.replace('import { ComplaintsModule } from "./complaints/complaints.module";', 'import { ComplaintsModule } from "./complaints/complaints.module";\nimport { DashboardModule } from "./dashboard/dashboard.module";');
    
    content = content.replace('ComplaintsModule,', 'ComplaintsModule,\n    DashboardModule,');
    
    fs.writeFileSync('apps/api/src/app.module.ts', content);
    console.log("Patched AppModule");
}
