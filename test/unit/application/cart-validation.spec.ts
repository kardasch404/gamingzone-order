import { CartValidationService, Cart } from '../../../src/application/services/cart-validation.service';

describe('CartValidationService', () => {
  let service: CartValidationService;

  beforeEach(() => {
    service = new CartValidationService();
  });

  const validCart: Cart = {
    userId: 'user-1',
    items: [
      {
        productId: 'prod-1',
        sku: 'SKU-001',
        name: 'Product 1',
        price: 100,
        quantity: 2,
      },
    ],
  };

  it('should validate valid cart', async () => {
    const result = await service.validate(validCart);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject empty cart', async () => {
    const emptyCart: Cart = { userId: 'user-1', items: [] };
    const result = await service.validate(emptyCart);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ type: 'EMPTY_CART' }),
    );
  });

  it('should reject cart with too many items', async () => {
    const items = Array(51)
      .fill(null)
      .map((_, i) => ({
        productId: `prod-${i}`,
        sku: `SKU-${i}`,
        name: `Product ${i}`,
        price: 10,
        quantity: 1,
      }));

    const result = await service.validate({ userId: 'user-1', items });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ type: 'TOO_MANY_ITEMS' }),
    );
  });

  it('should reject items with invalid quantity', async () => {
    const invalidCart: Cart = {
      userId: 'user-1',
      items: [
        {
          productId: 'prod-1',
          sku: 'SKU-001',
          name: 'Product 1',
          price: 100,
          quantity: 0,
        },
      ],
    };

    const result = await service.validate(invalidCart);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ type: 'INVALID_QUANTITY' }),
    );
  });

  it('should reject items with negative price', async () => {
    const invalidCart: Cart = {
      userId: 'user-1',
      items: [
        {
          productId: 'prod-1',
          sku: 'SKU-001',
          name: 'Product 1',
          price: -10,
          quantity: 1,
        },
      ],
    };

    const result = await service.validate(invalidCart);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ type: 'INVALID_PRICE' }),
    );
  });
});
