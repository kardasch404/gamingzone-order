import { Injectable, Inject } from '@nestjs/common';
import { IOrderRepository } from '../../../domain/interfaces/order-repository.interface';
import { IEventBus } from '../../../domain/interfaces/event-bus.interface';
import { InventoryGrpcClient } from '../../../infrastructure/grpc/clients/inventory-grpc.client';
import { OrderConfirmedEvent } from '../../../domain/events/order.events';
import { IdempotencyService } from '../../services/idempotency.service';

export interface PaymentSucceededEvent {
  eventId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  timestamp: Date;
}

@Injectable()
export class PaymentSuccessHandler {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepository: IOrderRepository,
    private readonly inventoryClient: InventoryGrpcClient,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    private readonly idempotency: IdempotencyService,
  ) {}

  async handle(event: PaymentSucceededEvent): Promise<void> {
    if (await this.idempotency.isEventProcessed(event.eventId)) {
      console.log(`Event ${event.eventId} already processed`);
      return;
    }

    const order = await this.orderRepository.findById(event.orderId);

    if (!order) {
      throw new Error(`Order ${event.orderId} not found`);
    }

    order.confirm(event.paymentId);

    await this.orderRepository.save(order);

    for (const item of order.items) {
      console.log(`Deducting stock for SKU: ${item.sku}, Quantity: ${item.quantity}`);
    }

    await this.eventBus.publish(
      new OrderConfirmedEvent(order.id, order.orderNumber, event.paymentId),
    );

    await this.idempotency.markEventProcessed(event.eventId);
  }
}
