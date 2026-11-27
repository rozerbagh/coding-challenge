import Link from 'next/link';
import { SearchFormFeature } from '@/features/search/search-form-feature';

export function SiteHeader({ categories }: { categories: string[] }) {
  return (
    <header className="border-b border-stone-200 bg-[#fbfaf7]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/"
            className="shrink-0 text-sm font-black tracking-[0.2em] text-emerald-950"
          >
            FIELDNOTE<span className="text-amber-700">.</span>
          </Link>
          <div className="w-[min(58vw,340px)] lg:hidden">
            <SearchFormFeature />
          </div>
        </div>
        <nav
          aria-label="Product categories"
          className="order-3 flex gap-5 overflow-x-auto pb-1 text-xs font-semibold capitalize tracking-wide text-stone-600 lg:order-1 lg:mx-8 lg:flex-1 lg:justify-center"
        >
          <Link className="shrink-0 transition hover:text-emerald-900" href="/">
            Home
          </Link>
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category}
              className="shrink-0 transition hover:text-emerald-900"
              href={`/category/${encodeURIComponent(category)}`}
            >
              {category}
            </Link>
          ))}
        </nav>
        <div className="hidden w-72 lg:order-2 lg:block">
          <SearchFormFeature />
        </div>
      </div>
    </header>
  );
}
