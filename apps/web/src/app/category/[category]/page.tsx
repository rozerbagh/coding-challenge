import { notFound } from 'next/navigation';
import { MainWrapper } from '@/components/main-wrapper';
import { CategoryFeature } from '@/features/category/category-feature';
import { getProductsByCategory } from '@/services/products-api';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!category.trim()) notFound();

  const products = await getProductsByCategory(category);
  return (
    <MainWrapper>
      <CategoryFeature category={category} initialProducts={products} />
    </MainWrapper>
  );
}
