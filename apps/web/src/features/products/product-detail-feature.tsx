'use client';

import { FeatureError } from '@/components/feature-error';
import { useProductDetails } from '@/hooks/use-products';
import { Product } from '@/types/product';
import { EnquiryFormFeature } from '@/features/enquiries/enquiry-form-feature';
import { ProductDetailView } from './product-detail-view';

export function ProductDetailFeature({
  initialProduct,
}: {
  initialProduct: Product;
}) {
  const { data, isError, error, refetch } = useProductDetails(
    initialProduct.id,
    initialProduct,
  );

  if (isError && !data) {
    return <FeatureError message={error.message} onRetry={() => void refetch()} />;
  }

  return (
    <div>
      <ProductDetailView product={data} />
      <section id="enquiry" className="mx-auto mt-16 mb-8 max-w-3xl scroll-mt-8 px-5 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
          We’re here to help
        </p>
        <h2 className="mb-6 mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
          Ask us about it
        </h2>
        <EnquiryFormFeature product={data} />
      </section>
    </div>
  );
}
