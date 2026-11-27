import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateEnquiryDto } from './create-enquiry.dto';

describe('CreateEnquiryDto', () => {
  it('accepts valid customer details and transforms a numeric product ID', async () => {
    const dto = plainToInstance(CreateEnquiryDto, {
      productId: '4',
      name: '  Sam Lee  ',
      email: 'sam@example.com',
      phone: '+1 (555) 555-5555',
      message: '  I would like to know more about this product.  ',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto.productId).toBe(4);
    expect(dto.name).toBe('Sam Lee');
    expect(dto.message).toBe('I would like to know more about this product.');
  });

  it('rejects invalid email, phone, message length, and product ID', async () => {
    const dto = plainToInstance(CreateEnquiryDto, {
      productId: 0,
      name: 'Sam Lee',
      email: 'not-an-email',
      phone: 'abc',
      message: 'short',
    });

    const errors = await validate(dto);
    expect(errors.map(({ property }) => property)).toEqual(
      expect.arrayContaining(['productId', 'email', 'phone', 'message']),
    );
  });
});
