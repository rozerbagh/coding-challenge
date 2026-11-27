import { BadGatewayException, Injectable } from '@nestjs/common';
import { Product } from './product.model';
import { ProductProvider } from './product.provider';

const PROVIDER_ERROR = 'Product catalogue provider is unavailable';
const REQUEST_TIMEOUT_MS = 5_000;

@Injectable()
export class FakeStoreProductProvider extends ProductProvider {
  private readonly baseUrl = (
    process.env.FAKE_STORE_API_URL ?? 'https://fakestoreapi.com'
  ).replace(/\/$/, '');

  async getProducts(): Promise<Product[]> {
    const payload = await this.getJson('/products');
    if (!Array.isArray(payload)) throw new BadGatewayException(PROVIDER_ERROR);

    const products = payload.map(parseProduct);
    if (products.some((product) => product === null)) {
      throw new BadGatewayException(PROVIDER_ERROR);
    }
    return products as Product[];
  }

  async getCategories(): Promise<string[]> {
    const payload = await this.getJson('/products/categories');
    if (
      !Array.isArray(payload) ||
      payload.some((category) => typeof category !== 'string')
    ) {
      throw new BadGatewayException(PROVIDER_ERROR);
    }
    return [
      ...new Set(
        (payload as string[]).map((item) => item.trim()).filter(Boolean),
      ),
    ];
  }

  async getProductById(id: number): Promise<Product | null> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/products/${id}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch {
      throw new BadGatewayException(PROVIDER_ERROR);
    }

    if (response.status === 404) return null;
    if (!response.ok) throw new BadGatewayException(PROVIDER_ERROR);

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new BadGatewayException(PROVIDER_ERROR);
    }
    const product = parseProduct(payload);
    if (!product) throw new BadGatewayException(PROVIDER_ERROR);
    return product;
  }

  private async getJson(path: string): Promise<unknown> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch {
      throw new BadGatewayException(PROVIDER_ERROR);
    }
    if (!response.ok) throw new BadGatewayException(PROVIDER_ERROR);

    try {
      return await response.json();
    } catch {
      throw new BadGatewayException(PROVIDER_ERROR);
    }
  }
}

function parseProduct(value: unknown): Product | null {
  if (!isRecord(value) || !isRecord(value.rating)) return null;
  const { id, title, price, description, category, image, rating } = value;
  if (
    !Number.isInteger(id) ||
    typeof title !== 'string' ||
    typeof price !== 'number' ||
    !Number.isFinite(price) ||
    typeof description !== 'string' ||
    typeof category !== 'string' ||
    typeof image !== 'string' ||
    typeof rating.rate !== 'number' ||
    !Number.isFinite(rating.rate) ||
    typeof rating.count !== 'number' ||
    !Number.isInteger(rating.count)
  ) {
    return null;
  }
  return value as unknown as Product;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
