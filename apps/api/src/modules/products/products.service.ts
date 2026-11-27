import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { ProductProvider } from './product.provider';

@Injectable()
export class ProductsService {
  constructor(private readonly productProvider: ProductProvider) {}

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.productProvider.getProducts();
    return [...products].sort(byRatingThenId).slice(0, 5);
  }

  getCategories(): Promise<string[]> {
    return this.productProvider.getCategories();
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const normalizedCategory = category.trim().toLowerCase();
    const products = await this.productProvider.getProducts();
    return products
      .filter(
        (product) => product.category.toLowerCase() === normalizedCategory,
      )
      .sort(byRatingThenId);
  }

  async searchProducts(search?: string): Promise<Product[]> {
    const products = await this.productProvider.getProducts();
    const term = search?.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) =>
      [product.title, product.description, product.category].some((field) =>
        field.toLowerCase().includes(term),
      ),
    );
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productProvider.getProductById(id);
    if (!product) throw new NotFoundException(`Product ${id} was not found`);
    return product;
  }
}

function byRatingThenId(left: Product, right: Product): number {
  return right.rating.rate - left.rating.rate || left.id - right.id;
}
