import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-stone-200/80 bg-white shadow-[0_12px_40px_-34px_rgba(32,32,24,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-34px_rgba(32,32,24,0.55)]">
      <Link
        href={`/product/${product.id}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
        aria-label={`View ${product.title}`}
      >
        <div className="relative flex aspect-[4/3] items-center justify-center bg-[#f5f3ee] p-8">
          <Image
            src={product.image}
            alt={product.title}
            width={360}
            height={300}
            unoptimized
            className="h-full max-h-56 w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-stone-600">
            {product.category}
          </span>
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-emerald-900">
              ★ {product.rating.rate.toFixed(1)}
            </span>
            <span className="text-xs text-stone-500">
              {product.rating.count} reviews
            </span>
          </div>
          <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-stone-900">
            {product.title}
          </h3>
          <p className="text-lg font-semibold tracking-tight text-stone-950">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </article>
  );
}
