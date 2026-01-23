import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GetOrderQueryHandler, GetOrderQuery } from '../../../application/use-cases/queries/get-order.query';
import { GetUserOrdersQueryHandler, GetUserOrdersQuery } from '../../../application/use-cases/queries/get-user-orders.query';

@Resolver('Order')
export class OrderResolver {
  constructor(
    private readonly getOrderQuery: GetOrderQueryHandler,
    private readonly getUserOrdersQuery: GetUserOrdersQueryHandler,
  ) {}

  @Query()
  async order(@Args('id') id: string) {
    const query = new GetOrderQuery(id);
    return await this.getOrderQuery.execute(query);
  }

  @Query()
  async myOrders(
    @Args('userId') userId: string,
    @Args('page') page: number = 1,
    @Args('limit') limit: number = 20,
  ) {
    const query = new GetUserOrdersQuery(userId, page, limit);
    return await this.getUserOrdersQuery.execute(query);
  }
}
