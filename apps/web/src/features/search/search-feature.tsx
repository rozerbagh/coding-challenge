'use client';

import { useEffect } from 'react';
import { FeatureError } from '@/components/feature-error';
import { useSearchResults } from '@/hooks/use-products';
import { setSearchDraft } from '@/store/search-slice';
import { useAppDispatch } from '@/store/hooks';
import { Product } from '@/types/product';
import { SearchView } from './search-view';

export function SearchFeature({
  query,
  initialProducts,
}: {
  query: string;
  initialProducts: Product[];
}) {
  const dispatch = useAppDispatch();
  const { data, isError, error, refetch } = useSearchResults(
    query,
    initialProducts,
  );

  useEffect(() => {
    dispatch(setSearchDraft(query));
  }, [dispatch, query]);

  if (isError && !data.length) {
    return <FeatureError message={error.message} onRetry={() => void refetch()} />;
  }

  return <SearchView query={query} products={data} />;
}
