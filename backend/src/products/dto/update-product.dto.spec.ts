import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateProductDto } from './update-product.dto';

async function errorsFor(payload: object) {
  const errors = await validate(plainToInstance(UpdateProductDto, payload));
  return errors.map((e) => e.property);
}

describe('UpdateProductDto', () => {
  it('should accept an empty payload (all fields are optional)', async () => {
    expect(await errorsFor({})).toEqual([]);
  });

  it('should accept a partial payload with valid values', async () => {
    expect(await errorsFor({ price: 49.9, stock: 0 })).toEqual([]);
  });

  it('should reject a non-integer stock', async () => {
    expect(await errorsFor({ stock: 2.5 })).toEqual(['stock']);
  });

  it('should reject a negative price and an invalid categoryId when provided', async () => {
    expect((await errorsFor({ price: -1, categoryId: 'not-a-uuid' })).sort()).toEqual(['categoryId', 'price']);
  });

  it('should reject empty strings for required text fields when provided', async () => {
    expect((await errorsFor({ name: '', imageUrl: '' })).sort()).toEqual(['imageUrl', 'name']);
  });
});
