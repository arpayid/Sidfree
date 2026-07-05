import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private client: GoogleGenerativeAI;

  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
  }

  async analyzeLetter(letterType: string, metadata: any): Promise<string> {
    if (!process.env.GEMINI_API_KEY) return 'Preview template surat (AI tidak dikonfigurasi)';
    try {
      const model = this.client.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Generate template ${letterType} dengan data: ${JSON.stringify(metadata)}`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      console.error(e);
      return 'Preview template surat (Gagal generate)';
    }
  }

  async analyzeComplaint(content: string): Promise<any> {
    if (!process.env.GEMINI_API_KEY) {
      return { priority: 'medium', category: 'Umum', summary: content };
    }
    try {
      const model = this.client.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Analisis aduan warga ini dan tentukan prioritas (low/medium/high) dan kategori:
      "${content}"
      Respond in JSON format: { "priority": "medium", "category": "Kategori", "summary": "Ringkasan" }`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\{[\s\S]*\}/);
      return JSON.parse(match ? match[0] : text);
    } catch (e) {
      console.error(e);
      return { priority: 'medium', category: 'Lainnya', summary: 'Gagal menganalisis aduan' };
    }
  }
}
