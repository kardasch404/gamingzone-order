import { Order } from '../../../domain/aggregates/order.aggregate';

export class OrderDTO {
  constructor(
    public readonly id: string,
    public readonly orderNumber: string,
    public readonly userId: string,
    public readonly status: string,
    public readonly totalAmount: number,
    public readonly currency: string,
    public readonly createdAt: Date,
  ) {}

  static fromDomain(order: Order): OrderDTO {
    return new OrderDTO(
      order.id,
      order.orderNumber,
      order.userId,
      order.status,
      order.totalAmount,
      order.currency,
      order.createdAt,
    );
  }
}
