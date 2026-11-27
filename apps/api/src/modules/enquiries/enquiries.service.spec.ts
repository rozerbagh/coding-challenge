import { NotFoundException } from '@nestjs/common';
import { Product } from '../products/product.model';
import { ProductsService } from '../products/products.service';
import { CreateEnquiryDto } from './create-enquiry.dto';
import { EmailProvider } from './email.provider';
import { EnquiriesService } from './enquiries.service';

const validEnquiry: CreateEnquiryDto = {
  productId: 3,
  name: 'Asha Rao',
  email: 'asha@example.com',
  phone: '+91 98765 43210',
  message: 'Please share delivery details.',
};

const product: Product = {
  id: 3,
  title: 'Canvas backpack',
  price: 45.5,
  description: 'A durable backpack.',
  category: 'bags',
  image: 'https://images.example/backpack.jpg',
  rating: { rate: 4.6, count: 25 },
};

describe('EnquiriesService', () => {
  let productsService: jest.Mocked<Pick<ProductsService, 'getProductById'>>;
  let emailProvider: jest.Mocked<EmailProvider>;
  let service: EnquiriesService;

  beforeEach(() => {
    productsService = {
      getProductById: jest.fn().mockResolvedValue(product),
    };
    emailProvider = {
      sendProductEnquiry: jest.fn().mockResolvedValue(undefined),
    };
    service = new EnquiriesService(
      productsService as unknown as ProductsService,
      emailProvider,
    );
  });

  it('checks product existence then sends the customer and product details', async () => {
    await expect(service.createEnquiry(validEnquiry)).resolves.toEqual({
      message: 'Enquiry sent',
    });
    expect(productsService.getProductById.mock.calls).toEqual([[3]]);
    expect(emailProvider.sendProductEnquiry.mock.calls).toEqual([
      [
        {
          product,
          customer: {
            name: validEnquiry.name,
            email: validEnquiry.email,
            phone: validEnquiry.phone,
            message: validEnquiry.message,
          },
        },
      ],
    ]);
  });

  it('does not send an email if the product does not exist', async () => {
    productsService.getProductById.mockRejectedValue(new NotFoundException());

    await expect(service.createEnquiry(validEnquiry)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(emailProvider.sendProductEnquiry.mock.calls).toHaveLength(0);
  });

  it('returns a controlled service error if email delivery fails', async () => {
    emailProvider.sendProductEnquiry.mockRejectedValue(
      new Error('private smtp diagnostic'),
    );

    await expect(service.createEnquiry(validEnquiry)).rejects.toMatchObject({
      status: 503,
      message: 'Unable to deliver your enquiry. Please try again later.',
    });
    expect(emailProvider.sendProductEnquiry.mock.calls).toHaveLength(1);
  });
});
