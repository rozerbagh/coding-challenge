import { ReactNode } from 'react';
import { getCategories } from '@/services/products-api';
import { SiteHeader } from './site-header';

export async function MainWrapper({ children }: { children: ReactNode }) {
  const categories = await getCategories().catch(() => []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader categories={categories} />
      <main className="flex-1">{children}</main>
      <footer className="mt-20 border-t border-stone-200 bg-[#f4f1eb]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 text-xs text-stone-600 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p className="font-semibold tracking-[0.16em] text-emerald-950">
            FIELDNOTE · OBJECTS FOR EVERYDAY LIFE
          </p>
          <p>Thoughtful finds, all in one place.</p>
        </div>
      </footer>
    </div>
  );
}
