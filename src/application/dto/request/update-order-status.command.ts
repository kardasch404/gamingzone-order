import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusCommand {
  constructor(
    public readonly orderId: string,
    public readonly newStatus: OrderStatus,
    public readonly updatedBy: string,
  ) {}
}
