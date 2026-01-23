import { OrderBusinessRules } from '../../../src/domain/services/order-business-rules.service';

describe('OrderBusinessRules', () => {
  describe('validateMinimumAmount', () => {
    it('should pass for amount above minimum', () => {
      expect(() => OrderBusinessRules.validateMinimumAmount(100)).not.toThrow();
    });

    it('should throw for amount below minimum', () => {
      expect(() => OrderBusinessRules.validateMinimumAmount(30)).toThrow('Minimum order amount is 50 MAD');
    });
  });

  describe('validateItemsCount', () => {
    it('should pass for valid items count', () => {
      expect(() => OrderBusinessRules.validateItemsCount(5)).not.toThrow();
    });

    it('should throw for zero items', () => {
      expect(() => OrderBusinessRules.validateItemsCount(0)).toThrow('Order must have at least one item');
    });

    it('should throw for too many items', () => {
      expect(() => OrderBusinessRules.validateItemsCount(51)).toThrow('Maximum 50 items per order');
    });
  });

  describe('validateShippingAddress', () => {
    const validAddress = {
      name: 'John Doe',
      phone: '123456',
      address: '123 St',
      city: 'City',
      postalCode: '12345',
    };

    it('should pass for valid address', () => {
      expect(() => OrderBusinessRules.validateShippingAddress(validAddress)).not.toThrow();
    });

    it('should throw for missing address', () => {
      expect(() => OrderBusinessRules.validateShippingAddress(null)).toThrow('Shipping address is required');
    });

    it('should throw for missing name', () => {
      const invalid = { ...validAddress, name: '' };
      expect(() => OrderBusinessRules.validateShippingAddress(invalid)).toThrow('Shipping address name is required');
    });
  });

  describe('validateOrderNumber', () => {
    it('should pass for valid order number', () => {
      expect(() => OrderBusinessRules.validateOrderNumber('ORD-2026-000001')).not.toThrow();
    });

    it('should throw for invalid format', () => {
      expect(() => OrderBusinessRules.validateOrderNumber('INVALID')).toThrow('Invalid order number format');
    });
  });

  describe('validateItemQuantity', () => {
    it('should pass for positive quantity', () => {
      expect(() => OrderBusinessRules.validateItemQuantity(5)).not.toThrow();
    });

    it('should throw for zero quantity', () => {
      expect(() => OrderBusinessRules.validateItemQuantity(0)).toThrow('Item quantity must be greater than 0');
    });

    it('should throw for negative quantity', () => {
      expect(() => OrderBusinessRules.validateItemQuantity(-1)).toThrow('Item quantity must be greater than 0');
    });
  });

  describe('validateItemPrice', () => {
    it('should pass for positive price', () => {
      expect(() => OrderBusinessRules.validateItemPrice(100)).not.toThrow();
    });

    it('should throw for negative price', () => {
      expect(() => OrderBusinessRules.validateItemPrice(-10)).toThrow('Item price cannot be negative');
    });
  });
});
