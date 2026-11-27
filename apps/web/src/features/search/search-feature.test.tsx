import { screen, waitFor } from '@testing-library/react';
import { SearchFeature } from './search-feature';
import { renderWithProviders } from '@/test/render-with-providers';
import { Product } from '@/types/product';

const product: Product = {
  id: 14,
  title: 'Blue cotton jacket',
  price: 72,
  description: 'A comfortable light layer.',
  category: 'mens clothing',
  image: 'https://images.example/jacket.jpg',
  rating: { rate: 4.5, count: 18 },
};

describe('SearchFeature', () => {
  it('renders search results and synchronizes the shared search draft', async () => {
    const { store } = renderWithProviders(
      <SearchFeature query="blue jacket" initialProducts={[product]} />,
    );

    expect(
      screen.getByRole('heading', { name: 'Results for “blue jacket”' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: product.title })).toBeInTheDocument();
    await waitFor(() => expect(store.getState().search.draft).toBe('blue jacket'));
  });

  it('shows a useful empty state when no products match', () => {
    renderWithProviders(<SearchFeature query="nothing" initialProducts={[]} />);

    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText('0 products found')).toBeInTheDocument();
  });
});
