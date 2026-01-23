import { OrderStateMachine } from '../../../src/domain/services/order-state-machine.service';
import { OrderStatus } from '@prisma/client';

describe('OrderStateMachine', () => {
  describe('canTransition', () => {
    it('should allow PENDING to CONFIRMED', () => {
      expect(OrderStateMachine.canTransition(OrderStatus.PENDING, OrderStatus.CONFIRMED)).toBe(true);
    });

    it('should allow PENDING to CANCELLED', () => {
      expect(OrderStateMachine.canTransition(OrderStatus.PENDING, OrderStatus.CANCELLED)).toBe(true);
    });

    it('should allow CONFIRMED to PROCESSING', () => {
      expect(OrderStateMachine.canTransition(OrderStatus.CONFIRMED, OrderStatus.PROCESSING)).toBe(true);
    });

    it('should allow PROCESSING to SHIPPED', () => {
      expect(OrderStateMachine.canTransition(OrderStatus.PROCESSING, OrderStatus.SHIPPED)).toBe(true);
    });

    it('should allow SHIPPED to DELIVERED', () => {
      expect(OrderStateMachine.canTransition(OrderStatus.SHIPPED, OrderStatus.DELIVERED)).toBe(true);
    });

    it('should not allow PENDING to SHIPPED', () => {
      expect(OrderStateMachine.canTransition(OrderStatus.PENDING, OrderStatus.SHIPPED)).toBe(false);
    });

    it('should not allow CANCELLED to any status', () => {
      expect(OrderStateMachine.canTransition(OrderStatus.CANCELLED, OrderStatus.CONFIRMED)).toBe(false);
    });

    it('should allow any status to REFUNDED', () => {
      expect(OrderStateMachine.canTransition(OrderStatus.CONFIRMED, OrderStatus.REFUNDED)).toBe(true);
      expect(OrderStateMachine.canTransition(OrderStatus.PROCESSING, OrderStatus.REFUNDED)).toBe(true);
      expect(OrderStateMachine.canTransition(OrderStatus.SHIPPED, OrderStatus.REFUNDED)).toBe(true);
    });
  });

  describe('validateTransition', () => {
    it('should not throw for valid transition', () => {
      expect(() => OrderStateMachine.validateTransition(OrderStatus.PENDING, OrderStatus.CONFIRMED)).not.toThrow();
    });

    it('should throw for invalid transition', () => {
      expect(() => OrderStateMachine.validateTransition(OrderStatus.PENDING, OrderStatus.SHIPPED))
        .toThrow('Invalid state transition from PENDING to SHIPPED');
    });
  });

  describe('getAllowedTransitions', () => {
    it('should return allowed transitions for PENDING', () => {
      const transitions = OrderStateMachine.getAllowedTransitions(OrderStatus.PENDING);
      expect(transitions).toContain(OrderStatus.CONFIRMED);
      expect(transitions).toContain(OrderStatus.CANCELLED);
    });

    it('should return empty array for CANCELLED', () => {
      const transitions = OrderStateMachine.getAllowedTransitions(OrderStatus.CANCELLED);
      expect(transitions).toEqual([]);
    });
  });
});
