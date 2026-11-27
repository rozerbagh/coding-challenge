import { Product } from '@/types/product';
import { ProductGrid } from '@/components/product-grid';

export function SearchView({
  query,
  products,
}: {
  query: string;
  products: Product[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-12 md:px-8 md:pt-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
        Search the collection
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-stone-950 sm:text-5xl">
        {query ? `Results for “${query}”` : 'All products'}
      </h1>
      <p className="mb-8 mt-3 text-sm text-stone-600">
        {products.length} {products.length === 1 ? 'product' : 'products'} found
      </p>
      <ProductGrid products={products} />
    </div>
  );
}
