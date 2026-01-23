import { Money } from '../../../src/domain/value-objects/money.vo';

describe('Money Value Object', () => {
  describe('constructor', () => {
    it('should create money with valid amount', () => {
      const money = new Money(100, 'MAD');
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('MAD');
    });

    it('should use default currency', () => {
      const money = new Money(100);
      expect(money.currency).toBe('MAD');
    });

    it('should throw error for negative amount', () => {
      expect(() => new Money(-10)).toThrow('Amount cannot be negative');
    });
  });

  describe('add', () => {
    it('should add two money objects', () => {
      const money1 = new Money(100, 'MAD');
      const money2 = new Money(50, 'MAD');
      const result = money1.add(money2);

      expect(result.amount).toBe(150);
      expect(result.currency).toBe('MAD');
    });

    it('should throw error for different currencies', () => {
      const money1 = new Money(100, 'MAD');
      const money2 = new Money(50, 'USD');

      expect(() => money1.add(money2)).toThrow('Cannot operate on different currencies');
    });
  });

  describe('subtract', () => {
    it('should subtract two money objects', () => {
      const money1 = new Money(100, 'MAD');
      const money2 = new Money(30, 'MAD');
      const result = money1.subtract(money2);

      expect(result.amount).toBe(70);
    });
  });

  describe('multiply', () => {
    it('should multiply money by factor', () => {
      const money = new Money(50, 'MAD');
      const result = money.multiply(3);

      expect(result.amount).toBe(150);
      expect(result.currency).toBe('MAD');
    });
  });

  describe('comparisons', () => {
    it('should compare less than', () => {
      const money1 = new Money(50, 'MAD');
      const money2 = new Money(100, 'MAD');

      expect(money1.lessThan(money2)).toBe(true);
      expect(money2.lessThan(money1)).toBe(false);
    });

    it('should compare greater than', () => {
      const money1 = new Money(100, 'MAD');
      const money2 = new Money(50, 'MAD');

      expect(money1.greaterThan(money2)).toBe(true);
      expect(money2.greaterThan(money1)).toBe(false);
    });

    it('should check equality', () => {
      const money1 = new Money(100, 'MAD');
      const money2 = new Money(100, 'MAD');
      const money3 = new Money(100, 'USD');

      expect(money1.equals(money2)).toBe(true);
      expect(money1.equals(money3)).toBe(false);
    });
  });

  describe('JSON conversion', () => {
    it('should convert to JSON', () => {
      const money = new Money(100, 'MAD');
      const json = money.toJSON();

      expect(json).toEqual({ amount: 100, currency: 'MAD' });
    });

    it('should create from JSON', () => {
      const money = Money.fromJSON({ amount: 100, currency: 'MAD' });

      expect(money.amount).toBe(100);
      expect(money.currency).toBe('MAD');
    });
  });

  describe('zero', () => {
    it('should create zero money', () => {
      const money = Money.zero('MAD');

      expect(money.amount).toBe(0);
      expect(money.currency).toBe('MAD');
    });
  });
});
