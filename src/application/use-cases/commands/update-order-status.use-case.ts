import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../../domain/interfaces/order-repository.interface';
import { IEventBus } from '../../../domain/interfaces/event-bus.interface';
import { UpdateOrderStatusCommand } from '../../dto/request/update-order-status.command';
import { OrderStatusChangedEvent, OrderShippedEvent, OrderDeliveredEvent } from '../../../domain/events/order.events';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(command: UpdateOrderStatusCommand): Promise<void> {
    const order = await this.orderRepository.findById(command.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    const previousStatus = order.status;

    switch (command.newStatus) {
      case OrderStatus.PROCESSING:
        order.startProcessing();
        break;
      case OrderStatus.SHIPPED:
        order.ship();
        await this.eventBus.publish(
          new OrderShippedEvent(order.id, order.orderNumber),
        );
        break;
      case OrderStatus.DELIVERED:
        order.deliver();
        await this.eventBus.publish(
          new OrderDeliveredEvent(order.id, order.orderNumber),
        );
        break;
      case OrderStatus.REFUNDED:
        order.refund();
        break;
      default:
        throw new Error(`Cannot update to status: ${command.newStatus}`);
    }

    await this.orderRepository.save(order);

    await this.eventBus.publish(
      new OrderStatusChangedEvent(
        order.id,
        order.orderNumber,
        previousStatus,
        order.status,
      ),
    );
  }
}
