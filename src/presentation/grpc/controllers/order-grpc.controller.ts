import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GetOrderQueryHandler, GetOrderQuery } from '../../../application/use-cases/queries/get-order.query';
import { GetOrderByNumberQueryHandler, GetOrderByNumberQuery } from '../../../application/use-cases/queries/get-order-by-number.query';

@Controller()
export class OrderGrpcController {
  constructor(
    private readonly getOrderQuery: GetOrderQueryHandler,
    private readonly getOrderByNumberQuery: GetOrderByNumberQueryHandler,
  ) {}

  @GrpcMethod('OrderService', 'GetOrder')
  async getOrder(data: { orderId: string }) {
    const query = new GetOrderQuery(data.orderId);
    const order = await this.getOrderQuery.execute(query);
    
    if (!order) {
      throw new Error('Order not found');
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      status: order.status,
      totalAmount: order.totalAmount,
      currency: order.currency,
    };
  }

  @GrpcMethod('OrderService', 'GetOrderByNumber')
  async getOrderByNumber(data: { orderNumber: string }) {
    const query = new GetOrderByNumberQuery(data.orderNumber);
    const order = await this.getOrderByNumberQuery.execute(query);
    
    if (!order) {
      throw new Error('Order not found');
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      status: order.status,
      totalAmount: order.totalAmount,
      currency: order.currency,
    };
  }
}
