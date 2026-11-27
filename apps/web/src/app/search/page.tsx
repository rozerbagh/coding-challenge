import { MainWrapper } from '@/components/main-wrapper';
import { SearchFeature } from '@/features/search/search-feature';
import { getProducts, searchProducts } from '@/services/products-api';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const parameters = await searchParams;
  const query = (Array.isArray(parameters.q) ? parameters.q[0] : parameters.q ?? '').trim();
  const products = query ? await searchProducts(query) : await getProducts();

  return (
    <MainWrapper>
      <SearchFeature query={query} initialProducts={products} />
    </MainWrapper>
  );
}
