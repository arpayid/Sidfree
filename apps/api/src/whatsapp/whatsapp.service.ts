import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private token: string;
  private phoneId: string;
  private apiUrl: string;

  constructor() {
    this.token = process.env.WHATSAPP_TOKEN || '';
    this.phoneId = process.env.WHATSAPP_PHONE_ID || '';
    this.apiUrl = `https://graph.facebook.com/v17.0/${this.phoneId}/messages`;
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    if (!this.token || !this.phoneId) {
      this.logger.warn(`WhatsApp credentials not configured. Mock sending to ${to}: ${message}`);
      return true;
    }

    try {
      // Ensure phone number has country code (assuming ID 62)
      let formattedPhone = to.replace(/\D/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.substring(1);
      }

      const payload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: { body: message },
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.logger.error(`Failed to send WhatsApp message: ${JSON.stringify(errorData)}`);
        return false;
      }

      this.logger.log(`WhatsApp message sent successfully to ${formattedPhone}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Error sending WhatsApp message: ${error.message}`);
      return false;
    }
  }
}
