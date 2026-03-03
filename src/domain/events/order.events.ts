import { DomainEvent } from './domain-event.base';
import { OrderStatus } from '@prisma/client';

export class OrderCreatedEvent extends DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly orderNumber: string,
    public readonly userId: string,
    public readonly totalAmount: number,
  ) {
    super();
  }

  getEventName(): string {
    return 'order.created';
  }
}

export class OrderConfirmedEvent extends DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly orderNumber: string,
    public readonly paymentId: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'order.confirmed';
  }
}

export class OrderCancelledEvent extends DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly orderNumber: string,
    public readonly reason: string,
    public readonly previousStatus: OrderStatus,
  ) {
    super();
  }

  getEventName(): string {
    return 'order.cancelled';
  }
}

export class OrderShippedEvent extends DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly orderNumber: string,
    public readonly trackingNumber?: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'order.shipped';
  }
}

export class OrderDeliveredEvent extends DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly orderNumber: string,
  ) {
    super();
  }

  getEventName(): string {
    return 'order.delivered';
  }
}

export class OrderRefundedEvent extends DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly orderNumber: string,
    public readonly amount: number,
  ) {
    super();
  }

  getEventName(): string {
    return 'order.refunded';
  }
}

export class OrderStatusChangedEvent extends DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly orderNumber: string,
    public readonly fromStatus: OrderStatus,
    public readonly toStatus: OrderStatus,
  ) {
    super();
  }

  getEventName(): string {
    return 'order.status.changed';
  }
}
