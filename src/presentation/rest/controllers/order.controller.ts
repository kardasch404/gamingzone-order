import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrderUseCase } from '../../../application/use-cases/commands/create-order.use-case';
import { CancelOrderUseCase } from '../../../application/use-cases/commands/cancel-order.use-case';
import { GetOrderQueryHandler, GetOrderQuery } from '../../../application/use-cases/queries/get-order.query';
import { GetUserOrdersQueryHandler, GetUserOrdersQuery } from '../../../application/use-cases/queries/get-user-orders.query';
import { CreateOrderCommand } from '../../../application/dto/request/create-order.command';
import { CancelOrderCommand } from '../../../application/dto/request/cancel-order.command';

@ApiTags('orders')
@Controller('api/orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly getOrderQuery: GetOrderQueryHandler,
    private readonly getUserOrdersQuery: GetUserOrdersQueryHandler,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async createOrder(@Body() body: any) {
    const command = new CreateOrderCommand(
      body.userId,
      body.shippingAddress,
      body.billingAddress,
      body.notes,
    );
    return await this.createOrderUseCase.execute(command, body.cart);
  }

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Returns user orders' })
  async getUserOrders(@Query('userId') userId: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    const query = new GetUserOrdersQuery(userId, page, limit);
    return await this.getUserOrdersQuery.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Returns order details' })
  async getOrder(@Param('id') id: string) {
    const query = new GetOrderQuery(id);
    return await this.getOrderQuery.execute(query);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  async cancelOrder(@Param('id') id: string, @Body() body: any) {
    const command = new CancelOrderCommand(id, body.userId, body.reason);
    await this.cancelOrderUseCase.execute(command);
    return { message: 'Order cancelled successfully' };
  }
}
