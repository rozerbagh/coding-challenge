'use client';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-[65vh] place-items-center px-5 py-16">
      <div role="alert" className="max-w-lg text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
          A small pause
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
          The collection didn’t load.
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Please try again in a moment.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
