import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-[65vh] place-items-center px-5 py-16">
      <div className="max-w-lg text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
          404 · Not found
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
          We couldn’t find that product.
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          It may have moved, or the link may be out of date.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Back to the collection
        </Link>
      </div>
    </main>
  );
}
