import { EnquiryEmail } from './enquiry-email.model';

export function renderEnquiryEmail(enquiry: EnquiryEmail): string {
  const { customer, product } = enquiry;
  return `<!doctype html>
<html lang="en">
  <body style="font-family: Arial, sans-serif; color: #222; line-height: 1.5">
    <h1>Product enquiry</h1>
    <h2>${escapeHtml(product.title)}</h2>
    <p><strong>Product ID:</strong> ${product.id}</p>
    <h3>Customer details</h3>
    <p><strong>Name:</strong> ${escapeHtml(customer.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(customer.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(customer.phone)}</p>
    <h3>Message</h3>
    <p style="white-space: pre-wrap">${escapeHtml(customer.message)}</p>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return replacements[character];
  });
}
