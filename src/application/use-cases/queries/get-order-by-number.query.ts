import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../../domain/interfaces/order-repository.interface';
import { OrderDTO } from '../../dto/response/order.dto';

export class GetOrderByNumberQuery {
  constructor(public readonly orderNumber: string) {}
}

@Injectable()
export class GetOrderByNumberQueryHandler {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(query: GetOrderByNumberQuery): Promise<OrderDTO | null> {
    const order = await this.orderRepository.findByOrderNumber(query.orderNumber);

    if (!order) {
      return null;
    }

    return OrderDTO.fromDomain(order);
  }
}
