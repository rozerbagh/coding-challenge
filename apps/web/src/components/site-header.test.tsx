import { screen } from '@testing-library/react';
import { SiteHeader } from './site-header';
import { renderWithProviders } from '@/test/render-with-providers';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('SiteHeader', () => {
  it('renders category navigation links supplied by the API', () => {
    renderWithProviders(
      <SiteHeader categories={['electronics', 'jewelery']} />,
    );

    expect(
      screen.getByRole('navigation', { name: 'Product categories' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'electronics' })).toHaveAttribute(
      'href',
      '/category/electronics',
    );
    expect(screen.getByRole('link', { name: 'jewelery' })).toHaveAttribute(
      'href',
      '/category/jewelery',
    );
  });
});
