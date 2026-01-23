import { OrderStatus } from '@prisma/client';

export class OrderStateMachine {
  private static readonly transitions: Map<OrderStatus, OrderStatus[]> = new Map([
    [OrderStatus.PENDING, [OrderStatus.CONFIRMED, OrderStatus.CANCELLED]],
    [OrderStatus.CONFIRMED, [OrderStatus.PROCESSING, OrderStatus.CANCELLED, OrderStatus.REFUNDED]],
    [OrderStatus.PROCESSING, [OrderStatus.SHIPPED, OrderStatus.REFUNDED]],
    [OrderStatus.SHIPPED, [OrderStatus.DELIVERED, OrderStatus.REFUNDED]],
    [OrderStatus.DELIVERED, [OrderStatus.REFUNDED]],
    [OrderStatus.CANCELLED, []],
    [OrderStatus.REFUNDED, []],
  ]);

  static canTransition(from: OrderStatus, to: OrderStatus): boolean {
    const allowedTransitions = this.transitions.get(from);
    return allowedTransitions?.includes(to) || false;
  }

  static validateTransition(from: OrderStatus, to: OrderStatus): void {
    if (!this.canTransition(from, to)) {
      throw new Error(`Invalid state transition from ${from} to ${to}`);
    }
  }

  static getAllowedTransitions(from: OrderStatus): OrderStatus[] {
    return this.transitions.get(from) || [];
  }
}
