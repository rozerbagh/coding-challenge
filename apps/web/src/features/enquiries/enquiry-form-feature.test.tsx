import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { submitEnquiry } from '@/services/enquiries-api';
import { renderWithProviders } from '@/test/render-with-providers';
import { Product } from '@/types/product';
import { EnquiryFormFeature } from './enquiry-form-feature';

jest.mock('@/services/enquiries-api', () => ({
  submitEnquiry: jest.fn(),
}));

const mockedSubmitEnquiry = jest.mocked(submitEnquiry);

const product: Product = {
  id: 31,
  title: 'Leather travel wallet',
  price: 27,
  description: 'A compact travel wallet.',
  category: 'accessories',
  image: 'https://images.example/wallet.jpg',
  rating: { rate: 4.4, count: 12 },
};

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Your name'), 'Asha Rao');
  await user.type(screen.getByLabelText('Email address'), 'asha@example.com');
  await user.type(screen.getByLabelText('Phone number'), '+91 98765 43210');
  await user.type(
    screen.getByLabelText('How can we help?'),
    'Please share more information about delivery.',
  );
}

describe('EnquiryFormFeature', () => {
  beforeEach(() => {
    mockedSubmitEnquiry.mockReset();
  });

  it('validates the customer fields before sending a request', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EnquiryFormFeature product={product} />);

    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(await screen.findByText('Enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid phone number.')).toBeInTheDocument();
    expect(
      screen.getByText('Add a little more detail (at least 10 characters).'),
    ).toBeInTheDocument();
    expect(mockedSubmitEnquiry).not.toHaveBeenCalled();
  });

  it('shows the thank-you confirmation after the enquiry API succeeds', async () => {
    const user = userEvent.setup();
    mockedSubmitEnquiry.mockResolvedValue({ message: 'Enquiry sent' });
    renderWithProviders(<EnquiryFormFeature product={product} />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(
      await screen.findByRole('heading', {
        name: 'Thank you for getting in touch.',
      }),
    ).toBeInTheDocument();
    expect(mockedSubmitEnquiry.mock.calls[0]?.[0]).toEqual({
      productId: product.id,
      name: 'Asha Rao',
      email: 'asha@example.com',
      phone: '+91 98765 43210',
      message: 'Please share more information about delivery.',
    });
  });

  it('shows an error and keeps the form available if submission fails', async () => {
    const user = userEvent.setup();
    mockedSubmitEnquiry.mockRejectedValue(
      new Error('Unable to deliver your enquiry. Please try again later.'),
    );
    renderWithProviders(<EnquiryFormFeature product={product} />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('Unable to deliver your enquiry');
    expect(screen.getByRole('button', { name: 'Send enquiry' })).toBeInTheDocument();
    await waitFor(() => expect(mockedSubmitEnquiry).toHaveBeenCalledTimes(1));
  });
});
