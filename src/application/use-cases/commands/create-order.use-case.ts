import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../../domain/interfaces/order-repository.interface';
import { OrderNumberGenerator } from '../../../domain/services/order-number-generator.service';
import { Order } from '../../../domain/aggregates/order.aggregate';
import { CreateOrderCommand } from '../../dto/request/create-order.command';
import { OrderDTO } from '../../dto/response/order.dto';
import { UuidGenerator } from '../../../shared/utils/uuid-generator.util';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderNumberGenerator: OrderNumberGenerator,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderDTO> {
    const orderId = UuidGenerator.generate();
    const orderNumber = await this.orderNumberGenerator.generate();

    const items = [
      {
        id: UuidGenerator.generate(),
        productId: 'product-1',
        quantity: 1,
        price: 100,
      },
    ];

    const subtotal = 100;
    const taxAmount = subtotal * 0.2;
    const shippingCost = this.calculateShippingCost(subtotal);
    const totalAmount = subtotal + taxAmount + shippingCost;

    const order = Order.create({
      id: orderId,
      orderNumber,
      userId: command.userId,
      items,
      subtotal,
      taxAmount,
      shippingCost,
      discount: 0,
      totalAmount,
      currency: 'MAD',
      shippingAddress: command.shippingAddress,
      billingAddress: command.billingAddress,
    });

    await this.orderRepository.save(order);

    return OrderDTO.fromDomain(order);
  }

  private calculateShippingCost(subtotal: number): number {
    return subtotal >= 500 ? 0 : 30;
  }
}
