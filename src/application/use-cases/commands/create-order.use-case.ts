import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../../domain/interfaces/order-repository.interface';
import { OrderNumberGenerator } from '../../../domain/services/order-number-generator.service';
import { Order } from '../../../domain/aggregates/order.aggregate';
import { CreateOrderCommand } from '../../dto/request/create-order.command';
import { OrderDTO } from '../../dto/response/order.dto';
import { UuidGenerator } from '../../../shared/utils/uuid-generator.util';
import { CartValidationService, Cart } from '../../services/cart-validation.service';
import { OrderCalculationService } from '../../services/order-calculation.service';
import { InventoryGrpcClient } from '../../../infrastructure/grpc/clients/inventory-grpc.client';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderNumberGenerator: OrderNumberGenerator,
    private readonly cartValidation: CartValidationService,
    private readonly orderCalculation: OrderCalculationService,
    private readonly inventoryClient: InventoryGrpcClient,
  ) {}

  async execute(command: CreateOrderCommand, cart: Cart): Promise<OrderDTO> {
    const validation = await this.cartValidation.validate(cart);
    if (!validation.valid) {
      throw new Error(`Cart validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    const totals = this.orderCalculation.calculate(cart.items, command.shippingAddress);

    const orderId = UuidGenerator.generate();
    const orderNumber = await this.orderNumberGenerator.generate();

    const reservations: string[] = [];
    const items = [];

    try {
      for (const cartItem of cart.items) {
        const reservation = await this.inventoryClient.reserveStock({
          sku: cartItem.sku,
          quantity: cartItem.quantity,
          orderId,
        });

        reservations.push(reservation.reservationId);

        items.push({
          id: UuidGenerator.generate(),
          productId: cartItem.productId,
          sku: cartItem.sku,
          name: cartItem.name,
          price: cartItem.price,
          quantity: cartItem.quantity,
          image: cartItem.image,
          reservationId: reservation.reservationId,
        });
      }
    } catch (error) {
      for (const reservationId of reservations) {
        await this.inventoryClient.releaseReservation({ reservationId });
      }
      throw new Error('Stock reservation failed');
    }

    const order = Order.create({
      id: orderId,
      orderNumber,
      userId: command.userId,
      items,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      shippingCost: totals.shippingCost,
      discount: totals.discount,
      totalAmount: totals.totalAmount,
      currency: 'MAD',
      shippingAddress: command.shippingAddress,
      billingAddress: command.billingAddress,
    });

    await this.orderRepository.save(order);

    return OrderDTO.fromDomain(order);
  }
}
