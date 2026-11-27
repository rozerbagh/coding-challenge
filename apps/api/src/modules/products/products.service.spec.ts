import { NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { ProductProvider } from './product.provider';
import { ProductsService } from './products.service';

const product = (
  id: number,
  rate: number,
  title = `Product ${id}`,
  category = 'electronics',
  description = `Description ${id}`,
): Product => ({
  id,
  title,
  price: 10 + id,
  description,
  category,
  image: `https://images.example/${id}.jpg`,
  rating: { rate, count: id * 10 },
});

describe('ProductsService', () => {
  let provider: jest.Mocked<ProductProvider>;
  let service: ProductsService;
  const products = [
    product(4, 4.5, 'Silver watch'),
    product(2, 4.9, 'Blue jacket', 'clothing'),
    product(1, 4.9, 'Red phone'),
    product(6, 3.1, 'Desk lamp'),
    product(3, 4.1, 'Leather wallet', 'clothing', 'A brown leather wallet'),
    product(5, 3.8, 'Wireless headphones'),
    product(7, 4.0, 'Cooking pan', 'kitchen'),
  ];

  beforeEach(() => {
    provider = {
      getProducts: jest.fn().mockResolvedValue(products),
      getCategories: jest.fn().mockResolvedValue(['electronics', 'clothing']),
      getProductById: jest.fn(),
    };
    service = new ProductsService(provider);
  });

  it('returns exactly five featured products sorted by rating then ID', async () => {
    const featured = await service.getFeaturedProducts();

    expect(featured).toHaveLength(5);
    expect(featured.map(({ id }) => id)).toEqual([1, 2, 4, 3, 7]);
  });

  it('returns available featured products when the provider has fewer than five', async () => {
    provider.getProducts.mockResolvedValue([products[0], products[1]]);

    await expect(service.getFeaturedProducts()).resolves.toHaveLength(2);
  });

  it('filters category products and orders them deterministically', async () => {
    const categoryProducts = await service.getProductsByCategory(' CLOTHING ');

    expect(categoryProducts.map(({ id }) => id)).toEqual([2, 3]);
  });

  it('searches title, description, and category case-insensitively', async () => {
    await expect(service.searchProducts('WALLET')).resolves.toEqual([
      products[4],
    ]);
    await expect(service.searchProducts('KITCHEN')).resolves.toEqual([
      products[6],
    ]);
    await expect(service.searchProducts('brown leather')).resolves.toEqual([
      products[4],
    ]);
  });

  it('returns all products for a missing or blank search', async () => {
    await expect(service.searchProducts()).resolves.toEqual(products);
    await expect(service.searchProducts('   ')).resolves.toEqual(products);
  });

  it('returns a complete product by ID', async () => {
    provider.getProductById.mockResolvedValue(products[0]);

    await expect(service.getProductById(4)).resolves.toEqual(products[0]);
  });

  it('returns 404 when the provider cannot find a product', async () => {
    provider.getProductById.mockResolvedValue(null);

    await expect(service.getProductById(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
