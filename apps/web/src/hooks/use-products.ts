'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getFeaturedProducts,
  getProduct,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '@/services/products-api';
import { Product } from '@/types/product';

export function useFeaturedProducts(initialData: Product[]) {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: getFeaturedProducts,
    initialData,
  });
}

export function useCategoryProducts(
  category: string,
  initialData: Product[],
) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => getProductsByCategory(category),
    initialData,
  });
}

export function useSearchResults(search: string, initialData: Product[]) {
  return useQuery({
    queryKey: ['products', 'search', search],
    queryFn: () => (search.trim() ? searchProducts(search) : getProducts()),
    initialData,
  });
}

export function useProductDetails(id: number, initialData: Product) {
  return useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: () => getProduct(id),
    initialData,
  });
}
