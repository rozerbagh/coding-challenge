import { screen } from '@testing-library/react';
import { CategoryFeature } from './category-feature';
import { renderWithProviders } from '@/test/render-with-providers';
import { Product } from '@/types/product';

const products: Product[] = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  title: `Rated item ${index + 1}`,
  price: 14 + index,
  description: 'A popular everyday item.',
  category: 'jewelery',
  image: `https://images.example/${index + 1}.jpg`,
  rating: { rate: 5 - index / 10, count: 20 + index },
}));

describe('CategoryFeature', () => {
  it('shows the top three products first and places the rest in More to explore', () => {
    renderWithProviders(
      <CategoryFeature category="jewelery" initialProducts={products} />,
    );

    expect(screen.getByRole('heading', { name: 'jewelery' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Top rated' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'More to explore' }),
    ).toBeInTheDocument();
    for (const product of products) {
      expect(screen.getByRole('heading', { name: product.title })).toBeInTheDocument();
    }
  });

  it('does not render a duplicate-products section when only three items exist', () => {
    renderWithProviders(
      <CategoryFeature category="jewelery" initialProducts={products.slice(0, 3)} />,
    );

    expect(screen.queryByRole('heading', { name: 'More to explore' })).toBeNull();
  });
});
