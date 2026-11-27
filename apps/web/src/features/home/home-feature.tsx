'use client';

import { useFeaturedProducts } from '@/hooks/use-products';
import { Product } from '@/types/product';
import { HomeView } from './home-view';
import { FeatureError } from '@/components/feature-error';

export function HomeFeature({ initialProducts }: { initialProducts: Product[] }) {
  const { data, isError, error, refetch } = useFeaturedProducts(initialProducts);

  if (isError && !data.length) {
    return <FeatureError message={error.message} onRetry={() => void refetch()} />;
  }

  return <HomeView products={data} />;
}
