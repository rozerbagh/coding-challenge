import { Product } from '@/types/product';
import { ProductGrid } from '@/components/product-grid';

interface CategoryViewProps {
  category: string;
  topRated: Product[];
  moreProducts: Product[];
}

export function CategoryView({
  category,
  topRated,
  moreProducts,
}: CategoryViewProps) {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-14">
      <div className="rounded-[1.8rem] bg-[#e9eee5] px-6 py-9 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-900">
          Browse the collection
        </p>
        <h1 className="mt-3 text-4xl font-semibold capitalize tracking-[-0.045em] text-stone-950 sm:text-5xl">
          {category}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
          Start with the most-loved pieces, then explore the rest of this collection.
        </p>
      </div>

      <section className="pt-11">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
              Highest rated
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
              Top rated
            </h2>
          </div>
          <span className="text-sm text-stone-500">Sorted by customer rating</span>
        </div>
        <ProductGrid products={topRated} />
      </section>

      {moreProducts.length > 0 && (
        <section className="pt-12">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-stone-950">
            More to explore
          </h2>
          <ProductGrid products={moreProducts} />
        </section>
      )}
    </div>
  );
}
