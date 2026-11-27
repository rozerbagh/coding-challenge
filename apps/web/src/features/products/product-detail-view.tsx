import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/components/product-card';
import { Product } from '@/types/product';

export function ProductDetailView({ product }: { product: Product }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-8 md:px-8 md:pt-12">
      <nav aria-label="Breadcrumb" className="text-xs font-medium text-stone-500">
        <Link href="/" className="hover:text-emerald-900">Home</Link>
        <span className="px-2" aria-hidden="true">/</span>
        <Link
          href={`/category/${encodeURIComponent(product.category)}`}
          className="capitalize hover:text-emerald-900"
        >
          {product.category}
        </Link>
        <span className="px-2" aria-hidden="true">/</span>
        <span className="text-stone-700">Product</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="flex min-h-[330px] items-center justify-center rounded-[2rem] bg-[#f2f0eb] p-8 sm:min-h-[500px]">
          <Image
            src={product.image}
            alt={product.title}
            width={620}
            height={560}
            priority
            unoptimized
            className="max-h-[430px] w-full object-contain mix-blend-multiply"
          />
        </div>
        <section className="self-center py-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
            {product.category}
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-stone-950 sm:text-4xl">
            {product.title}
          </h1>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm font-bold text-emerald-900">
              ★ {product.rating.rate.toFixed(1)}
            </span>
            <span className="text-sm text-stone-500">
              {product.rating.count} customer reviews
            </span>
          </div>
          <p className="mt-6 text-2xl font-semibold text-stone-950">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-600">
            {product.description}
          </p>
          <a
            href="#enquiry"
            className="mt-8 inline-flex rounded-full bg-emerald-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
          >
            Enquire about this product
          </a>
          <p className="mt-4 text-xs text-stone-500">
            Ask our team about availability, delivery, or product details.
          </p>
        </section>
      </div>

    </div>
  );
}
