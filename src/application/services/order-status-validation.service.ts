import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrderStateMachine } from '../../domain/services/order-state-machine.service';

@Injectable()
export class OrderStatusValidationService {
  canTransitionTo(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    return OrderStateMachine.canTransition(currentStatus, newStatus);
  }

  validateTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    if (!this.canTransitionTo(currentStatus, newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  getAllowedTransitions(currentStatus: OrderStatus): OrderStatus[] {
    return OrderStateMachine.getAllowedTransitions(currentStatus);
  }

  canBeCancelled(status: OrderStatus): boolean {
    const allowedStatuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
    return allowedStatuses.includes(status);
  }

  canBeModified(status: OrderStatus): boolean {
    return status === OrderStatus.PENDING;
  }

  isTerminalStatus(status: OrderStatus): boolean {
    const terminalStatuses: OrderStatus[] = [
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
      OrderStatus.REFUNDED,
    ];
    return terminalStatuses.includes(status);
  }
}
