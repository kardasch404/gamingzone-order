import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../../domain/interfaces/order-repository.interface';
import { IEventBus } from '../../../domain/interfaces/event-bus.interface';
import { OrderShippedEvent } from '../../../domain/events/order.events';

export interface ShipmentCreatedEvent {
  eventId: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  timestamp: Date;
}

@Injectable()
export class ShipmentCreatedHandler {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async handle(event: ShipmentCreatedEvent): Promise<void> {
    const order = await this.orderRepository.findById(event.orderId);

    if (!order) {
      throw new Error(`Order ${event.orderId} not found`);
    }

    order.ship(event.trackingNumber);

    await this.orderRepository.save(order);

    await this.eventBus.publish(
      new OrderShippedEvent(order.id, order.orderNumber, event.trackingNumber),
    );
  }
}
