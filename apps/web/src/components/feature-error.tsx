interface FeatureErrorProps {
  message: string;
  onRetry: () => void;
}

export function FeatureError({ message, onRetry }: FeatureErrorProps) {
  return (
    <div
      role="alert"
      className="mx-auto my-12 max-w-3xl rounded-3xl border border-rose-200 bg-rose-50 px-6 py-8 text-center"
    >
      <h2 className="text-xl font-semibold text-stone-950">
        We couldn’t load this collection
      </h2>
      <p className="mt-2 text-sm text-stone-700">{message}</p>
      <button
        onClick={onRetry}
        className="mt-5 rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
      >
        Try again
      </button>
    </div>
  );
}
