import { Order } from '../../../src/domain/aggregates/order.aggregate';
import { OrderStatus, PaymentStatus, FulfillmentStatus } from '@prisma/client';

describe('Order Aggregate', () => {
  const validOrderData = {
    id: 'test-id',
    orderNumber: 'ORD-2026-000001',
    userId: 'user-123',
    items: [{ id: '1', productId: 'p1', quantity: 2, price: 100 }],
    subtotal: 200,
    taxAmount: 20,
    shippingCost: 10,
    discount: 0,
    totalAmount: 230,
    currency: 'MAD',
    shippingAddress: { name: 'John', phone: '123', address: 'St', city: 'City', postalCode: '12345' },
  };

  describe('create', () => {
    it('should create order with valid data', () => {
      const order = Order.create(validOrderData);

      expect(order.id).toBe(validOrderData.id);
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.paymentStatus).toBe(PaymentStatus.PENDING);
    });

    it('should throw error for amount below minimum', () => {
      const invalidData = { ...validOrderData, totalAmount: 30 };
      expect(() => Order.create(invalidData)).toThrow('Minimum order amount is 50 MAD');
    });

    it('should throw error for empty items', () => {
      const invalidData = { ...validOrderData, items: [] };
      expect(() => Order.create(invalidData)).toThrow('Order must have at least one item');
    });

    it('should throw error for too many items', () => {
      const items = Array(51).fill({ id: '1', productId: 'p1', quantity: 1, price: 10 });
      const invalidData = { ...validOrderData, items };
      expect(() => Order.create(invalidData)).toThrow('Maximum 50 items per order');
    });
  });

  describe('confirm', () => {
    it('should confirm pending order', () => {
      const order = Order.create(validOrderData);
      order.confirm('payment-123');

      expect(order.status).toBe(OrderStatus.CONFIRMED);
      expect(order.paymentStatus).toBe(PaymentStatus.PAID);
      expect(order.paymentId).toBe('payment-123');
      expect(order.paidAt).toBeDefined();
    });

    it('should throw error when confirming non-pending order', () => {
      const order = Order.create(validOrderData);
      order.confirm('payment-123');

      expect(() => order.confirm('payment-456')).toThrow('Cannot confirm order in CONFIRMED status');
    });
  });

  describe('cancel', () => {
    it('should cancel pending order', () => {
      const order = Order.create(validOrderData);
      order.cancel('Customer request');

      expect(order.status).toBe(OrderStatus.CANCELLED);
      expect(order.cancelReason).toBe('Customer request');
      expect(order.cancelledAt).toBeDefined();
    });

    it('should cancel confirmed order', () => {
      const order = Order.create(validOrderData);
      order.confirm('payment-123');
      order.cancel('Out of stock');

      expect(order.status).toBe(OrderStatus.CANCELLED);
    });

    it('should throw error when cancelling processing order', () => {
      const order = Order.create(validOrderData);
      order.confirm('payment-123');
      order.startProcessing();

      expect(() => order.cancel('reason')).toThrow('Cannot cancel order in PROCESSING status');
    });
  });

  describe('ship', () => {
    it('should ship processing order', () => {
      const order = Order.create(validOrderData);
      order.confirm('payment-123');
      order.startProcessing();
      order.ship();

      expect(order.status).toBe(OrderStatus.SHIPPED);
      expect(order.fulfillmentStatus).toBe(FulfillmentStatus.FULFILLED);
    });

    it('should throw error when shipping non-processing order', () => {
      const order = Order.create(validOrderData);
      expect(() => order.ship()).toThrow('Cannot ship order in PENDING status');
    });
  });

  describe('deliver', () => {
    it('should deliver shipped order', () => {
      const order = Order.create(validOrderData);
      order.confirm('payment-123');
      order.startProcessing();
      order.ship();
      order.deliver();

      expect(order.status).toBe(OrderStatus.DELIVERED);
      expect(order.deliveredAt).toBeDefined();
    });
  });

  describe('refund', () => {
    it('should refund paid order', () => {
      const order = Order.create(validOrderData);
      order.confirm('payment-123');
      order.refund();

      expect(order.status).toBe(OrderStatus.REFUNDED);
      expect(order.paymentStatus).toBe(PaymentStatus.REFUNDED);
    });

    it('should throw error when refunding unpaid order', () => {
      const order = Order.create(validOrderData);
      expect(() => order.refund()).toThrow('Can only refund paid orders');
    });
  });

  describe('canBeCancelled', () => {
    it('should return true for pending order', () => {
      const order = Order.create(validOrderData);
      expect(order.canBeCancelled()).toBe(true);
    });

    it('should return false for processing order', () => {
      const order = Order.create(validOrderData);
      order.confirm('payment-123');
      order.startProcessing();
      expect(order.canBeCancelled()).toBe(false);
    });
  });
});
