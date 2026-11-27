import { renderEnquiryEmail } from './enquiry-email.template';

describe('renderEnquiryEmail', () => {
  it('includes the enquiry fields and escapes customer-controlled HTML', () => {
    const html = renderEnquiryEmail({
      product: {
        id: 12,
        title: '<script>product</script>',
        price: 12,
        description: 'Description',
        category: 'category',
        image: 'https://images.example/item.png',
        rating: { rate: 4, count: 9 },
      },
      customer: {
        name: 'A & B',
        email: 'person@example.com',
        phone: '+1 555 123 4567',
        message: '<img src=x onerror=alert(1)>',
      },
    });

    expect(html).toContain('Product ID:</strong> 12');
    expect(html).toContain('person@example.com');
    expect(html).toContain('+1 555 123 4567');
    expect(html).toContain('&lt;script&gt;product&lt;/script&gt;');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });
});
