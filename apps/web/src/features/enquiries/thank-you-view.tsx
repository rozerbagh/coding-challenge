export function ThankYouView({ onStartAnother }: { onStartAnother: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-8"
    >
      <span className="grid size-12 place-items-center rounded-full bg-emerald-900 text-xl text-white">
        ✓
      </span>
      <h3 className="mt-5 text-2xl font-semibold tracking-tight text-stone-950">
        Thank you for getting in touch.
      </h3>
      <p className="mt-2 max-w-lg text-sm leading-6 text-stone-700">
        Your enquiry has been sent to our sales team. We’ll be in touch soon.
      </p>
      <button
        onClick={onStartAnother}
        className="mt-6 rounded-full border border-emerald-900 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-900 hover:text-white"
      >
        Send another enquiry
      </button>
    </div>
  );
}
