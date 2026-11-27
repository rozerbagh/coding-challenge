import { BadGatewayException } from '@nestjs/common';
import { FakeStoreProductProvider } from './fake-store-product.provider';

describe('FakeStoreProductProvider', () => {
  const originalFetch = global.fetch;
  let provider: FakeStoreProductProvider;

  beforeEach(() => {
    provider = new FakeStoreProductProvider();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('maps upstream failures to a controlled gateway error', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(new Response('upstream detail', { status: 503 }));

    await expect(provider.getProducts()).rejects.toThrow(BadGatewayException);
    await expect(provider.getProducts()).rejects.toThrow(
      'Product catalogue provider is unavailable',
    );
  });

  it('rejects malformed product data instead of returning partial records', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify([{ id: 1, title: 'Incomplete' }]), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    await expect(provider.getProducts()).rejects.toThrow(BadGatewayException);
  });

  it('normalizes and de-duplicates categories', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify([' electronics ', 'electronics', 'clothing']),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      ),
    );

    await expect(provider.getCategories()).resolves.toEqual([
      'electronics',
      'clothing',
    ]);
  });
});
