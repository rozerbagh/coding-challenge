import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EnquiryEmail } from './enquiry-email.model';
import { EmailProvider } from './email.provider';
import { renderEnquiryEmail } from './enquiry-email.template';

export class ResendEmailProvider extends EmailProvider {
  private readonly resend: Resend;
  private readonly salesEmail: string;
  private readonly from: string;

  constructor(configService: ConfigService) {
    super();
    const apiKey = configService.get<string>('RESEND_API_KEY');
    const from = configService.get<string>('RESEND_FROM_EMAIL');
    const salesEmail = configService.get<string>('SALES_EMAIL');

    if (!apiKey || !from || !salesEmail) {
      throw new Error(
        'Resend requires RESEND_API_KEY, RESEND_FROM_EMAIL, and SALES_EMAIL',
      );
    }

    this.resend = new Resend(apiKey);
    this.from = from;
    this.salesEmail = salesEmail;
  }

  async sendProductEnquiry(enquiry: EnquiryEmail): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: [this.salesEmail],
      replyTo: enquiry.customer.email,
      subject: `Product enquiry: ${enquiry.product.title}`,
      html: renderEnquiryEmail(enquiry),
    });

    if (error) {
      throw new Error('Resend rejected the enquiry email');
    }
  }
}
