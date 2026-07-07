const fs = require('fs');
let code = fs.readFileSync('apps/api/src/public.controller.spec.ts', 'utf8');
code = code.replace(/import { AiService } from '\.\/ai\/ai\.service';/,
`import { AiService } from './ai/ai.service';
import { WhatsappService } from './whatsapp/whatsapp.service';`);
code = code.replace(/let aiService: AiService;/,
`let aiService: AiService;
  let whatsappService: WhatsappService;`);
code = code.replace(/          provide: AiService,[\s\S]*?},/,
`          provide: AiService,
          useValue: {
            analyzeComplaint: jest.fn().mockResolvedValue({
              priority: 'medium',
              category: 'Infrastruktur',
              summary: 'Aduan tentang kerusakan jalan',
            }),
          },
        },
        {
          provide: WhatsappService,
          useValue: {
            sendMessage: jest.fn().mockResolvedValue(true),
          },
        },`);
code = code.replace(/aiService = module\.get<AiService>\(AiService\);/,
`aiService = module.get<AiService>(AiService);
    whatsappService = module.get<WhatsappService>(WhatsappService);`);
fs.writeFileSync('apps/api/src/public.controller.spec.ts', code);
