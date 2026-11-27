import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProductsModule } from '../products/products.module';
import { EmailProvider } from './email.provider';
import { EnquiriesController } from './enquiries.controller';
import { EnquiriesService } from './enquiries.service';
import { ResendEmailProvider } from './resend-email.provider';
import { SmtpEmailProvider } from './smtp-email.provider';

@Module({
  imports: [
    ProductsModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 5 }]),
  ],
  controllers: [EnquiriesController],
  providers: [
    EnquiriesService,
    {
      provide: EmailProvider,
      useFactory: (configService: ConfigService): EmailProvider => {
        if (configService.get('EMAIL_PROVIDER') === 'resend') {
          return new ResendEmailProvider(configService);
        }
        return new SmtpEmailProvider(configService);
      },
      inject: [ConfigService],
    },
  ],
})
export class EnquiriesModule {}
