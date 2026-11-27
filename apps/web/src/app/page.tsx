import { MainWrapper } from '@/components/main-wrapper';
import { HomeFeature } from '@/features/home/home-feature';
import { getFeaturedProducts } from '@/services/products-api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <MainWrapper>
      <HomeFeature initialProducts={featuredProducts} />
    </MainWrapper>
  );
}
