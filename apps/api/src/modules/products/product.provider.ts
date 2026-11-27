import { Product } from './product.model';

export abstract class ProductProvider {
  abstract getProducts(): Promise<Product[]>;
  abstract getCategories(): Promise<string[]>;
  abstract getProductById(id: number): Promise<Product | null>;
}
