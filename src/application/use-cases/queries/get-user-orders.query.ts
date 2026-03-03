import { Injectable } from '@nestjs/common';
import { IOrderRepository, PaginatedResult } from '../../../domain/interfaces/order-repository.interface';
import { OrderDTO } from '../../dto/response/order.dto';

export class GetUserOrdersQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}

@Injectable()
export class GetUserOrdersQueryHandler {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(query: GetUserOrdersQuery): Promise<PaginatedResult<OrderDTO>> {
    const offset = (query.page - 1) * query.limit;

    const result = await this.orderRepository.findByUserId(query.userId, {
      page: query.page,
      limit: query.limit,
      offset,
    });

    return {
      items: result.items.map((order) => OrderDTO.fromDomain(order)),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
