import { BadGatewayException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from '../src/common/configure-app';
import { EmailProvider } from '../src/modules/enquiries/email.provider';
import { Product } from '../src/modules/products/product.model';
import { ProductProvider } from '../src/modules/products/product.provider';
import { AppModule } from '../src/app.module';

const sampleProduct: Product = {
  id: 1,
  title: 'Canvas backpack',
  price: 45.5,
  description: 'A sturdy everyday backpack.',
  category: 'bags',
  image: 'https://images.example/backpack.jpg',
  rating: { rate: 4.6, count: 25 },
};

describe('Product Catalogue API (e2e)', () => {
  let app: INestApplication<App>;
  let productProvider: jest.Mocked<ProductProvider>;
  let emailProvider: jest.Mocked<EmailProvider>;

  beforeAll(async () => {
    productProvider = {
      getProducts: jest.fn().mockResolvedValue([sampleProduct]),
      getCategories: jest.fn().mockResolvedValue(['bags']),
      getProductById: jest
        .fn()
        .mockImplementation((id: number) =>
          Promise.resolve(id === sampleProduct.id ? sampleProduct : null),
        ),
    };
    emailProvider = {
      sendProductEnquiry: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProductProvider)
      .useValue(productProvider)
      .overrideProvider(EmailProvider)
      .useValue(emailProvider)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    productProvider.getProducts.mockResolvedValue([sampleProduct]);
    productProvider.getCategories.mockResolvedValue(['bags']);
    productProvider.getProductById.mockImplementation((id: number) =>
      Promise.resolve(id === sampleProduct.id ? sampleProduct : null),
    );
    emailProvider.sendProductEnquiry.mockResolvedValue(undefined);
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves the versioned health endpoint with security headers', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect({ status: 'ok' })
      .expect('x-content-type-options', 'nosniff');
  });

  it('serves categories and applies case-insensitive category matching', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/products/categories')
      .expect(200)
      .expect(['bags']);
    await request(app.getHttpServer())
      .get('/api/v1/products/categories/BAGS')
      .expect(200)
      .expect([sampleProduct]);
  });

  it('returns 400 for an invalid product ID and 404 for an unknown product', async () => {
    await request(app.getHttpServer()).get('/api/v1/products/nope').expect(400);
    await request(app.getHttpServer()).get('/api/v1/products/99').expect(404);
  });

  it('rejects missing and unexpected enquiry fields at the HTTP boundary', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/enquiries')
      .send({ productId: 1, email: 'invalid' })
      .expect(400);
    await request(app.getHttpServer())
      .post('/api/v1/enquiries')
      .send({
        productId: 1,
        name: 'Sam Lee',
        email: 'sam@example.com',
        phone: '+1 555 555 5555',
        message: 'Please share more product information.',
        unexpected: true,
      })
      .expect(400);
    expect(emailProvider.sendProductEnquiry.mock.calls).toHaveLength(0);
  });

  it('sends a valid enquiry and returns success only after the email provider resolves', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/enquiries')
      .send({
        productId: 1,
        name: 'Sam Lee',
        email: 'sam@example.com',
        phone: '+1 555 555 5555',
        message: 'Please share more product information.',
      })
      .expect(201)
      .expect({ message: 'Enquiry sent' });
    expect(emailProvider.sendProductEnquiry.mock.calls).toEqual([
      [
        {
          product: sampleProduct,
          customer: {
            name: 'Sam Lee',
            email: 'sam@example.com',
            phone: '+1 555 555 5555',
            message: 'Please share more product information.',
          },
        },
      ],
    ]);
  });

  it('returns a controlled error and hides provider diagnostics when delivery fails', async () => {
    emailProvider.sendProductEnquiry.mockRejectedValue(
      new Error('secret smtp password detail'),
    );

    const response = await request(app.getHttpServer())
      .post('/api/v1/enquiries')
      .send({
        productId: 1,
        name: 'Sam Lee',
        email: 'sam@example.com',
        phone: '+1 555 555 5555',
        message: 'Please share more product information.',
      })
      .expect(503);

    const responseBody = response.body as { message: string };
    expect(responseBody.message).toContain('Unable to deliver your enquiry');
    expect(JSON.stringify(response.body)).not.toContain('secret smtp password');
    expect(JSON.stringify(response.body)).not.toContain('stack');
  });

  it('maps a product-provider failure to a controlled gateway response', async () => {
    productProvider.getProducts.mockRejectedValue(
      new BadGatewayException('Product catalogue provider is unavailable'),
    );

    const response = await request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(502);

    const responseBody = response.body as { message: string };
    expect(responseBody.message).toBe(
      'Product catalogue provider is unavailable',
    );
    expect(JSON.stringify(response.body)).not.toContain('stack');
  });
});
