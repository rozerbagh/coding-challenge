import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductGrid } from '@/components/product-grid';

export function HomeView({ products }: { products: Product[] }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-4 pt-7 md:px-8 md:pt-10">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#e9eee5] px-6 py-12 sm:px-10 md:min-h-[390px] md:px-16 md:py-16">
        <div className="absolute -right-16 -top-24 -z-10 size-80 rounded-full border border-emerald-950/10 sm:size-[27rem]" />
        <div className="absolute -right-2 top-10 -z-10 size-56 rounded-full bg-[#d6dfd0] sm:right-16 sm:size-72" />
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-900">
            A considered collection
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-stone-950 sm:text-5xl md:text-6xl">
            Good things,
            <br />
            found together.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-stone-700">
            Useful favorites and small everyday upgrades, gathered in one easy place.
          </p>
          <Link
            href="#featured"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
          >
            Explore the edit <span aria-hidden="true">↓</span>
          </Link>
        </div>
        <div className="absolute bottom-7 right-8 hidden rotate-[-8deg] rounded-2xl border border-white/80 bg-white/65 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-950 shadow-sm md:block">
          Curated for the everyday
        </div>
      </section>

      <section id="featured" className="scroll-mt-8 pt-14 md:pt-20">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
              Customer favorites
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-4xl">
              The five to know
            </h2>
          </div>
          <span className="hidden pb-1 text-sm text-stone-500 sm:block">
            Rated by the people who use them
          </span>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
