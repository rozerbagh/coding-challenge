export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading catalogue"
      className="mx-auto max-w-7xl animate-pulse px-5 py-12 md:px-8"
    >
      <div className="h-72 rounded-[2rem] bg-stone-200" />
      <div className="mt-12 h-8 w-60 rounded bg-stone-200" />
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-80 rounded-[1.6rem] bg-stone-200" />
        ))}
      </div>
    </div>
  );
}
