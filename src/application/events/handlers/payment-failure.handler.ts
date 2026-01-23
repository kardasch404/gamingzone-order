import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../../domain/interfaces/order-repository.interface';
import { InventoryGrpcClient } from '../../../infrastructure/grpc/clients/inventory-grpc.client';

export interface PaymentFailedEvent {
  eventId: string;
  orderId: string;
  reason: string;
  timestamp: Date;
}

@Injectable()
export class PaymentFailureHandler {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly inventoryClient: InventoryGrpcClient,
  ) {}

  async handle(event: PaymentFailedEvent): Promise<void> {
    const order = await this.orderRepository.findById(event.orderId);

    if (!order) {
      console.log(`Order ${event.orderId} not found for payment failure`);
      return;
    }

    for (const item of order.items) {
      if (item.reservationId) {
        await this.inventoryClient.releaseReservation({
          reservationId: item.reservationId,
        });
      }
    }

    console.log(`Payment failed for order ${order.orderNumber}: ${event.reason}`);
  }
}
