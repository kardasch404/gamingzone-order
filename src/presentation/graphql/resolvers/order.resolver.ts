import { Injectable } from '@nestjs/common';
import { GetOrderQueryHandler, GetOrderQuery } from '../../../application/use-cases/queries/get-order.query';
import { GetUserOrdersQueryHandler, GetUserOrdersQuery } from '../../../application/use-cases/queries/get-user-orders.query';

@Injectable()
export class OrderResolver {
  constructor(
    private readonly getOrderQuery: GetOrderQueryHandler,
    private readonly getUserOrdersQuery: GetUserOrdersQueryHandler,
  ) {}

  async order(id: string) {
    const query = new GetOrderQuery(id);
    return await this.getOrderQuery.execute(query);
  }

  async myOrders(userId: string, page: number = 1, limit: number = 20) {
    const query = new GetUserOrdersQuery(userId, page, limit);
    return await this.getUserOrdersQuery.execute(query);
  }
}
