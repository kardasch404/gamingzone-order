import { OrderStatusValidationService } from '../../../src/application/services/order-status-validation.service';
import { OrderStatus } from '@prisma/client';

describe('OrderStatusValidationService', () => {
  let service: OrderStatusValidationService;

  beforeEach(() => {
    service = new OrderStatusValidationService();
  });

  describe('canTransitionTo', () => {
    it('should allow valid transitions', () => {
      expect(service.canTransitionTo(OrderStatus.PENDING, OrderStatus.CONFIRMED)).toBe(true);
      expect(service.canTransitionTo(OrderStatus.CONFIRMED, OrderStatus.PROCESSING)).toBe(true);
      expect(service.canTransitionTo(OrderStatus.PROCESSING, OrderStatus.SHIPPED)).toBe(true);
    });

    it('should reject invalid transitions', () => {
      expect(service.canTransitionTo(OrderStatus.PENDING, OrderStatus.SHIPPED)).toBe(false);
      expect(service.canTransitionTo(OrderStatus.CANCELLED, OrderStatus.CONFIRMED)).toBe(false);
    });
  });

  describe('validateTransition', () => {
    it('should not throw for valid transition', () => {
      expect(() =>
        service.validateTransition(OrderStatus.PENDING, OrderStatus.CONFIRMED),
      ).not.toThrow();
    });

    it('should throw for invalid transition', () => {
      expect(() =>
        service.validateTransition(OrderStatus.PENDING, OrderStatus.SHIPPED),
      ).toThrow('Invalid status transition');
    });
  });

  describe('canBeCancelled', () => {
    it('should return true for PENDING and CONFIRMED', () => {
      expect(service.canBeCancelled(OrderStatus.PENDING)).toBe(true);
      expect(service.canBeCancelled(OrderStatus.CONFIRMED)).toBe(true);
    });

    it('should return false for other statuses', () => {
      expect(service.canBeCancelled(OrderStatus.PROCESSING)).toBe(false);
      expect(service.canBeCancelled(OrderStatus.SHIPPED)).toBe(false);
    });
  });

  describe('canBeModified', () => {
    it('should return true only for PENDING', () => {
      expect(service.canBeModified(OrderStatus.PENDING)).toBe(true);
      expect(service.canBeModified(OrderStatus.CONFIRMED)).toBe(false);
    });
  });

  describe('isTerminalStatus', () => {
    it('should return true for terminal statuses', () => {
      expect(service.isTerminalStatus(OrderStatus.DELIVERED)).toBe(true);
      expect(service.isTerminalStatus(OrderStatus.CANCELLED)).toBe(true);
      expect(service.isTerminalStatus(OrderStatus.REFUNDED)).toBe(true);
    });

    it('should return false for non-terminal statuses', () => {
      expect(service.isTerminalStatus(OrderStatus.PENDING)).toBe(false);
      expect(service.isTerminalStatus(OrderStatus.PROCESSING)).toBe(false);
    });
  });
});
