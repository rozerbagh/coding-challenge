'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { SearchForm } from '@/components/search-form';
import { setSearchDraft } from '@/store/search-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function SearchFormFeature() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.search.draft);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  }

  return (
    <SearchForm
      value={value}
      onChange={(nextValue) => dispatch(setSearchDraft(nextValue))}
      onSubmit={submitSearch}
    />
  );
}
