const fs = require('fs');
let content = fs.readFileSync('apps/api/src/app.module.ts', 'utf8');

if (!content.includes('TenantModule')) {
    content = content.replace('import { DashboardModule } from "./dashboard/dashboard.module";', 'import { DashboardModule } from "./dashboard/dashboard.module";\nimport { TenantModule } from "./tenant/tenant.module";');
    
    content = content.replace('DashboardModule,', 'DashboardModule,\n    TenantModule,');
    
    fs.writeFileSync('apps/api/src/app.module.ts', content);
    console.log("Patched AppModule with TenantModule");
}
