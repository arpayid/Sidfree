import { Test, TestingModule } from '@nestjs/testing';
import { PublicController } from './public.controller';
import { PrismaService } from './prisma/prisma.service';
import { AiService } from './ai/ai.service';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { SubmitComplaintDto } from './dto/public.dto';

describe('PublicController', () => {
  let controller: PublicController;
  let prismaService: PrismaService;
  let aiService: AiService;
  let whatsappService: WhatsappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            tenant: { findFirst: jest.fn() },
            complaint: { create: jest.fn() },
            resident: { findFirst: jest.fn() },
            letter: { create: jest.fn() },
          },
        },
        {
          provide: AiService,
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
        },
      ],
    }).compile();

    controller = module.get<PublicController>(PublicController);
    prismaService = module.get<PrismaService>(PrismaService);
    aiService = module.get<AiService>(AiService);
    whatsappService = module.get<WhatsappService>(WhatsappService);
  });

  describe('submitComplaint', () => {
    it('should submit complaint with AI analysis', async () => {
      const mockTenant = { id: 'tenant-1', name: 'Desa Test' };
      const mockComplaint = {
        id: 'complaint-1',
        title: 'Jalan rusak',
        content: 'Jalan di depan rumah rusak parah',
        tenantId: 'tenant-1',
        residentId: null,
        metadata: {
          priority: 'medium',
          category: 'Infrastruktur',
        },
      };

      prismaService.tenant.findFirst = jest.fn().mockResolvedValue(mockTenant);
      prismaService.complaint.create = jest.fn().mockResolvedValue(mockComplaint);

      const dto: SubmitComplaintDto = {
        title: 'Jalan rusak',
        content: 'Jalan di depan rumah rusak parah',
        nik: '1234567890123456',
      };

      const result = await controller.submitComplaint(dto);

      expect(result.id).toBe('complaint-1');
      expect(aiService.analyzeComplaint).toHaveBeenCalledWith(dto.content);
      expect(prismaService.complaint.create).toHaveBeenCalled();
    });

    it('should throw error if tenant not found', async () => {
      prismaService.tenant.findFirst = jest.fn().mockResolvedValue(null);

      const dto: SubmitComplaintDto = {
        title: 'Test',
        content: 'Test complaint',
      };

      await expect(controller.submitComplaint(dto)).rejects.toThrow();
    });
  });
});
