export function validateEnvironment(
  environment: NodeJS.ProcessEnv,
): NodeJS.ProcessEnv {
  const emailProvider = environment.EMAIL_PROVIDER ?? 'smtp';
  if (emailProvider !== 'smtp' && emailProvider !== 'resend') {
    throw new Error('EMAIL_PROVIDER must be either smtp or resend');
  }
  if (emailProvider === 'resend') {
    if (!environment.RESEND_API_KEY?.trim()) {
      throw new Error('RESEND_API_KEY is required when EMAIL_PROVIDER=resend');
    }
    if (!environment.RESEND_FROM_EMAIL?.trim()) {
      throw new Error(
        'RESEND_FROM_EMAIL is required when EMAIL_PROVIDER=resend',
      );
    }
    if (!environment.SALES_EMAIL?.trim()) {
      throw new Error('SALES_EMAIL is required when EMAIL_PROVIDER=resend');
    }
  }

  const port = parsePort(
    environment.API_PORT ?? environment.PORT,
    3001,
    'PORT',
  );
  const smtpPort = parsePort(environment.SMTP_PORT, 1025, 'SMTP_PORT');
  const productApiUrl =
    environment.FAKE_STORE_API_URL ?? 'https://fakestoreapi.com';

  try {
    const parsedUrl = new URL(productApiUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error();
    }
  } catch {
    throw new Error('FAKE_STORE_API_URL must be a valid HTTP or HTTPS URL');
  }

  environment.PORT = String(port);
  environment.EMAIL_PROVIDER = emailProvider;
  environment.SMTP_PORT = String(smtpPort);
  environment.SMTP_HOST ||= 'localhost';
  environment.FAKE_STORE_API_URL = productApiUrl;
  environment.SALES_EMAIL ||= 'sales@example.com';
  environment.EMAIL_FROM ||= 'Product Catalogue <noreply@example.com>';
  return environment;
}

function parsePort(
  value: string | undefined,
  fallback: number,
  key: string,
): number {
  const port = Number(value ?? fallback);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`${key} must be an integer between 1 and 65535`);
  }
  return port;
}
