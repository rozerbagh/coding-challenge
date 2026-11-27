'use client';

import { useCategoryProducts } from '@/hooks/use-products';
import { Product } from '@/types/product';
import { FeatureError } from '@/components/feature-error';
import { CategoryView } from './category-view';

export function CategoryFeature({
  category,
  initialProducts,
}: {
  category: string;
  initialProducts: Product[];
}) {
  const { data, isError, error, refetch } = useCategoryProducts(
    category,
    initialProducts,
  );

  if (isError && !data.length) {
    return <FeatureError message={error.message} onRetry={() => void refetch()} />;
  }

  const topRated = data.slice(0, 3);
  const moreProducts = data.slice(3);

  return (
    <CategoryView
      category={category}
      topRated={topRated}
      moreProducts={moreProducts}
    />
  );
}
