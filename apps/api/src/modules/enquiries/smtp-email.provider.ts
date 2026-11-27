import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import { EnquiryEmail } from './enquiry-email.model';
import { EmailProvider } from './email.provider';
import { renderEnquiryEmail } from './enquiry-email.template';

@Injectable()
export class SmtpEmailProvider extends EmailProvider {
  private readonly transporter: Transporter;
  private readonly salesEmail: string;
  private readonly from: string;

  constructor(configService: ConfigService) {
    super();
    const port = Number(configService.get('SMTP_PORT', '1025'));
    const user = configService.get<string>('SMTP_USER');
    const password = configService.get<string>('SMTP_PASSWORD');
    this.salesEmail = configService.get('SALES_EMAIL', 'sales@example.com');
    this.from = configService.get(
      'EMAIL_FROM',
      'Product Catalogue <noreply@example.com>',
    );
    this.transporter = nodemailer.createTransport({
      host: configService.get('SMTP_HOST', 'localhost'),
      port,
      secure: port === 465,
      ...(user && password ? { auth: { user, pass: password } } : {}),
      connectionTimeout: 5_000,
      greetingTimeout: 5_000,
      socketTimeout: 10_000,
    });
  }

  async sendProductEnquiry(enquiry: EnquiryEmail): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: this.salesEmail,
      replyTo: enquiry.customer.email,
      subject: `Product enquiry: ${enquiry.product.title}`,
      html: renderEnquiryEmail(enquiry),
    });
  }
}
