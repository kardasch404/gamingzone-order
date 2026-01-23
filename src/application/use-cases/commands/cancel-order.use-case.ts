import { Injectable, Inject } from '@nestjs/common';
import { IOrderRepository } from '../../../domain/interfaces/order-repository.interface';
import { IEventBus } from '../../../domain/interfaces/event-bus.interface';
import { InventoryGrpcClient } from '../../../infrastructure/grpc/clients/inventory-grpc.client';
import { CancelOrderCommand } from '../../dto/request/cancel-order.command';
import { OrderCancelledEvent } from '../../../domain/events/order.events';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepository: IOrderRepository,
    private readonly inventoryClient: InventoryGrpcClient,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
  ) {}

  async execute(command: CancelOrderCommand): Promise<void> {
    const order = await this.orderRepository.findById(command.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== command.userId && !command.isAdmin) {
      throw new Error('Unauthorized to cancel this order');
    }

    const previousStatus = order.status;
    order.cancel(command.reason);

    await this.orderRepository.save(order);

    for (const item of order.items) {
      if (item.reservationId) {
        await this.inventoryClient.releaseReservation({
          reservationId: item.reservationId,
        });
      }
    }

    await this.eventBus.publish(
      new OrderCancelledEvent(
        order.id,
        order.orderNumber,
        command.reason,
        previousStatus,
      ),
    );

    if (order.paymentStatus === PaymentStatus.PAID) {
      console.log(`Refund requested for order ${order.orderNumber}`);
    }
  }
}
