import { Product } from '@/types/product';
import { apiRequest } from './api-client';

export function getFeaturedProducts(): Promise<Product[]> {
  return apiRequest('/products/featured');
}

export function getCategories(): Promise<string[]> {
  return apiRequest('/products/categories');
}

export function getProducts(): Promise<Product[]> {
  return apiRequest('/products');
}

export function getProductsByCategory(category: string): Promise<Product[]> {
  return apiRequest(`/products/categories/${encodeURIComponent(category)}`);
}

export function searchProducts(search: string): Promise<Product[]> {
  return apiRequest(`/products?search=${encodeURIComponent(search)}`);
}

export function getProduct(id: number): Promise<Product> {
  return apiRequest(`/products/${id}`);
}
