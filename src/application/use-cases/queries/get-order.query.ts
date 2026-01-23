import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../../domain/interfaces/order-repository.interface';
import { OrderDTO } from '../../dto/response/order.dto';

export class GetOrderQuery {
  constructor(public readonly orderId: string) {}
}

@Injectable()
export class GetOrderQueryHandler {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(query: GetOrderQuery): Promise<OrderDTO | null> {
    const order = await this.orderRepository.findById(query.orderId);

    if (!order) {
      return null;
    }

    return OrderDTO.fromDomain(order);
  }
}
