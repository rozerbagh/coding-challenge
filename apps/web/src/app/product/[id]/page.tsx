import { notFound } from 'next/navigation';
import { MainWrapper } from '@/components/main-wrapper';
import { ApiRequestError } from '@/services/api-client';
import { getProduct } from '@/services/products-api';
import { ProductDetailFeature } from '@/features/products/product-detail-feature';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) notFound();

  let product;
  try {
    product = await getProduct(id);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    throw error;
  }

  return (
    <MainWrapper>
      <ProductDetailFeature initialProduct={product} />
    </MainWrapper>
  );
}
