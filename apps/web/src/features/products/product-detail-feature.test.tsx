import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render-with-providers';
import { ProductDetailFeature } from './product-detail-feature';
import { Product } from '@/types/product';

const product: Product = {
  id: 22,
  title: 'Walnut desk lamp',
  price: 39.95,
  description: 'A warm reading lamp with an adjustable shade.',
  category: 'home decor',
  image: 'https://images.example/lamp.jpg',
  rating: { rate: 4.7, count: 43 },
};

describe('ProductDetailFeature', () => {
  it('shows full product information and an enquiry entry point', () => {
    renderWithProviders(<ProductDetailFeature initialProduct={product} />);

    expect(screen.getByRole('heading', { name: product.title })).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByText('$39.95')).toBeInTheDocument();
    expect(screen.getByText('★ 4.7')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Enquire about this product' }),
    ).toHaveAttribute('href', '#enquiry');
    expect(screen.getByRole('heading', { name: 'Ask us about it' })).toBeInTheDocument();
  });
});
