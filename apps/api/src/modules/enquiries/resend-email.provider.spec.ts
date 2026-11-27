import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EnquiryEmail } from './enquiry-email.model';
import { ResendEmailProvider } from './resend-email.provider';

jest.mock('resend', () => ({ Resend: jest.fn() }));

const mockedResend = jest.mocked(Resend);

const enquiry: EnquiryEmail = {
  product: {
    id: 3,
    title: 'Canvas backpack',
    price: 45.5,
    description: 'A sturdy everyday backpack.',
    category: 'bags',
    image: 'https://images.example/backpack.jpg',
    rating: { rate: 4.6, count: 25 },
  },
  customer: {
    name: 'Asha Rao',
    email: 'asha@example.com',
    phone: '+91 98765 43210',
    message: 'Please share delivery details.',
  },
};

describe('ResendEmailProvider', () => {
  const send = jest.fn<
    ReturnType<Resend['emails']['send']>,
    Parameters<Resend['emails']['send']>
  >();

  beforeEach(() => {
    jest.clearAllMocks();
    send.mockResolvedValue({
      data: { id: 'email_test_id' },
      error: null,
      headers: null,
    });
    mockedResend.mockImplementation(
      () => ({ emails: { send } }) as unknown as Resend,
    );
  });

  it('sends the enquiry using the configured sender and sales recipient', async () => {
    const provider = new ResendEmailProvider(
      new ConfigService({
        RESEND_API_KEY: 're_test_key',
        RESEND_FROM_EMAIL: 'Catalogue <hello@example.com>',
        SALES_EMAIL: 'sales@example.com',
      }),
    );

    await provider.sendProductEnquiry(enquiry);

    expect(mockedResend).toHaveBeenCalledWith('re_test_key');
    const emailOptions = send.mock.calls[0]?.[0];
    expect(emailOptions?.from).toBe('Catalogue <hello@example.com>');
    expect(emailOptions?.to).toEqual(['sales@example.com']);
    expect(emailOptions?.replyTo).toBe('asha@example.com');
    expect(emailOptions?.subject).toBe('Product enquiry: Canvas backpack');
    expect(
      emailOptions && 'html' in emailOptions ? emailOptions.html : '',
    ).toContain('Please share delivery details.');
  });

  it('rejects a Resend API error without exposing provider details', async () => {
    send.mockResolvedValue({
      data: null,
      error: {
        name: 'validation_error',
        message: 'private provider detail',
        statusCode: 422,
      },
      headers: null,
    });
    const provider = new ResendEmailProvider(
      new ConfigService({
        RESEND_API_KEY: 're_test_key',
        RESEND_FROM_EMAIL: 'Catalogue <hello@example.com>',
        SALES_EMAIL: 'sales@example.com',
      }),
    );

    await expect(provider.sendProductEnquiry(enquiry)).rejects.toThrow(
      'Resend rejected the enquiry email',
    );
  });
});
