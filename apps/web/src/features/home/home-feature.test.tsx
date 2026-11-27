import { screen } from '@testing-library/react';
import { HomeFeature } from './home-feature';
import { renderWithProviders } from '@/test/render-with-providers';
import { Product } from '@/types/product';

const products: Product[] = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  title: `Featured item ${index + 1}`,
  price: 20 + index,
  description: 'A useful item for everyday life.',
  category: 'essentials',
  image: `https://images.example/${index + 1}.jpg`,
  rating: { rate: 4.8 - index / 10, count: 50 + index },
}));

describe('HomeFeature', () => {
  it('renders the five featured products supplied by the server', () => {
    renderWithProviders(<HomeFeature initialProducts={products} />);

    expect(
      screen.getByRole('heading', { name: 'Good things, found together.' }),
    ).toBeInTheDocument();
    expect(screen.getByText('The five to know')).toBeInTheDocument();
    for (const product of products) {
      expect(screen.getByRole('heading', { name: product.title })).toBeInTheDocument();
    }
  });
});
