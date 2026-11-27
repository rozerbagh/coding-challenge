import { validateEnvironment } from './environment-config';

describe('validateEnvironment', () => {
  it('sets safe local defaults and preserves valid environment values', () => {
    const environment: NodeJS.ProcessEnv = {};

    validateEnvironment(environment);

    expect(environment.PORT).toBe('3001');
    expect(environment.SMTP_PORT).toBe('1025');
    expect(environment.SMTP_HOST).toBe('localhost');
    expect(environment.FAKE_STORE_API_URL).toBe('https://fakestoreapi.com');
    expect(environment.SALES_EMAIL).toBe('sales@example.com');
    expect(environment.EMAIL_PROVIDER).toBe('smtp');
  });

  it('rejects invalid SMTP/API ports and non-HTTP provider URLs', () => {
    expect(() => validateEnvironment({ SMTP_PORT: '70000' })).toThrow(
      'SMTP_PORT must be an integer between 1 and 65535',
    );
    expect(() => validateEnvironment({ API_PORT: 'invalid' })).toThrow(
      'PORT must be an integer between 1 and 65535',
    );
    expect(() =>
      validateEnvironment({ FAKE_STORE_API_URL: 'file:///tmp/products.json' }),
    ).toThrow('FAKE_STORE_API_URL must be a valid HTTP or HTTPS URL');
  });

  it('requires Resend credentials and a sender when Resend is selected', () => {
    expect(() => validateEnvironment({ EMAIL_PROVIDER: 'invalid' })).toThrow(
      'EMAIL_PROVIDER must be either smtp or resend',
    );
    expect(() => validateEnvironment({ EMAIL_PROVIDER: 'resend' })).toThrow(
      'RESEND_API_KEY is required when EMAIL_PROVIDER=resend',
    );
    expect(() =>
      validateEnvironment({
        EMAIL_PROVIDER: 'resend',
        RESEND_API_KEY: 're_test_key',
      }),
    ).toThrow('RESEND_FROM_EMAIL is required when EMAIL_PROVIDER=resend');
    expect(() =>
      validateEnvironment({
        EMAIL_PROVIDER: 'resend',
        RESEND_API_KEY: 're_test_key',
        RESEND_FROM_EMAIL: 'Catalogue <hello@example.com>',
      }),
    ).toThrow('SALES_EMAIL is required when EMAIL_PROVIDER=resend');
  });

  it('accepts Resend configuration without changing its credentials', () => {
    const environment: NodeJS.ProcessEnv = {
      EMAIL_PROVIDER: 'resend',
      RESEND_API_KEY: 're_test_key',
      RESEND_FROM_EMAIL: 'Catalogue <hello@example.com>',
      SALES_EMAIL: 'sales@example.com',
    };

    validateEnvironment(environment);

    expect(environment.EMAIL_PROVIDER).toBe('resend');
    expect(environment.RESEND_API_KEY).toBe('re_test_key');
  });
});
