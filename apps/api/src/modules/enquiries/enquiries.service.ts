import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CreateEnquiryDto } from './create-enquiry.dto';
import { EmailProvider } from './email.provider';

@Injectable()
export class EnquiriesService {
  private readonly logger = new Logger(EnquiriesService.name);

  constructor(
    private readonly productsService: ProductsService,
    private readonly emailProvider: EmailProvider,
  ) {}

  async createEnquiry(
    enquiry: CreateEnquiryDto,
  ): Promise<{ message: 'Enquiry sent' }> {
    const product = await this.productsService.getProductById(
      enquiry.productId,
    );

    try {
      await this.emailProvider.sendProductEnquiry({
        product,
        customer: {
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          message: enquiry.message,
        },
      });
    } catch {
      this.logger.error('Enquiry email delivery failed');
      throw new ServiceUnavailableException(
        'Unable to deliver your enquiry. Please try again later.',
      );
    }

    return { message: 'Enquiry sent' };
  }
}
