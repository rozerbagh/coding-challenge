import { FormEvent, ChangeEvent } from 'react';

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function SearchForm({ value, onChange, onSubmit }: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex w-full items-center gap-2">
      <label className="sr-only" htmlFor="catalogue-search">
        Search products
      </label>
      <input
        id="catalogue-search"
        name="search"
        type="search"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        placeholder="Search the collection"
        className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
      />
      <button
        type="submit"
        aria-label="Submit product search"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-stone-900 text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="size-4"
        >
          <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.8" />
          <path d="m15.5 15.5 4.1 4.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
