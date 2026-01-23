import { OrderCalculationService } from '../../../src/application/services/order-calculation.service';
import { CartItem } from '../../../src/application/services/cart-validation.service';

describe('OrderCalculationService', () => {
  let service: OrderCalculationService;

  beforeEach(() => {
    service = new OrderCalculationService();
  });

  const mockItems: CartItem[] = [
    {
      productId: 'prod-1',
      sku: 'SKU-001',
      name: 'Product 1',
      price: 100,
      quantity: 2,
    },
    {
      productId: 'prod-2',
      sku: 'SKU-002',
      name: 'Product 2',
      price: 50,
      quantity: 1,
    },
  ];

  it('should calculate subtotal correctly', () => {
    const result = service.calculate(mockItems);

    expect(result.subtotal).toBe(250);
  });

  it('should calculate tax at 20%', () => {
    const result = service.calculate(mockItems);

    expect(result.taxAmount).toBe(50);
  });

  it('should apply free shipping for orders >= 500', () => {
    const largeOrder: CartItem[] = [
      {
        productId: 'prod-1',
        sku: 'SKU-001',
        name: 'Product 1',
        price: 500,
        quantity: 1,
      },
    ];

    const result = service.calculate(largeOrder);

    expect(result.shippingCost).toBe(0);
  });

  it('should charge 30 MAD shipping for orders < 500', () => {
    const result = service.calculate(mockItems);

    expect(result.shippingCost).toBe(30);
  });

  it('should calculate total amount correctly', () => {
    const result = service.calculate(mockItems);

    expect(result.totalAmount).toBe(330);
  });
});
