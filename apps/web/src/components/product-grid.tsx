import { Product } from '@/types/product';
import { ProductCard } from './product-card';

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-stone-300 bg-white/70 px-6 py-16 text-center">
        <p className="text-lg font-semibold text-stone-900">No products found</p>
        <p className="mt-2 text-sm text-stone-600">
          Try another search or browse a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
