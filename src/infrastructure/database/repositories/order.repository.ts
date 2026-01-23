import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '../../../domain/aggregates/order.aggregate';
import {
  IOrderRepository,
  PaginationParams,
  PaginatedResult,
  OrderSearchParams,
} from '../../../domain/interfaces/order-repository.interface';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(order: Order): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.order.upsert({
        where: { id: order.id },
        create: {
          id: order.id,
          orderNumber: order.orderNumber,
          userId: order.userId,
          status: order.status,
          paymentStatus: order.paymentStatus,
          fulfillmentStatus: order.fulfillmentStatus,
          subtotal: order.subtotal,
          taxAmount: order.taxAmount,
          shippingCost: order.shippingCost,
          discount: order.discount,
          totalAmount: order.totalAmount,
          currency: order.currency,
          shippingAddress: order.shippingAddress,
          billingAddress: order.billingAddress,
          paymentMethod: order.paymentMethod,
          paymentId: order.paymentId,
          paidAt: order.paidAt,
          notes: order.notes,
          cancelReason: order.cancelReason,
          cancelledAt: order.cancelledAt,
          estimatedDelivery: order.estimatedDelivery,
          deliveredAt: order.deliveredAt,
        },
        update: {
          status: order.status,
          paymentStatus: order.paymentStatus,
          fulfillmentStatus: order.fulfillmentStatus,
          paymentId: order.paymentId,
          paidAt: order.paidAt,
          cancelReason: order.cancelReason,
          cancelledAt: order.cancelledAt,
          deliveredAt: order.deliveredAt,
          updatedAt: order.updatedAt,
        },
      });
    });
  }

  async findById(orderId: string): Promise<Order | null> {
    const orderRecord = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!orderRecord) return null;

    return this.toDomain(orderRecord);
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const orderRecord = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!orderRecord) return null;

    return this.toDomain(orderRecord);
  }

  async findByUserId(
    userId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Order>> {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: pagination.offset,
        take: pagination.limit,
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      items: orders.map((o) => this.toDomain(o)),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async search(
    params: OrderSearchParams,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Order>> {
    const where: any = {};

    if (params.userId) where.userId = params.userId;
    if (params.status) where.status = params.status;
    if (params.orderNumber) where.orderNumber = { contains: params.orderNumber };
    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: pagination.offset,
        take: pagination.limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items: orders.map((o) => this.toDomain(o)),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async delete(orderId: string): Promise<void> {
    await this.prisma.order.delete({ where: { id: orderId } });
  }

  private toDomain(record: any): Order {
    return Order.create({
      id: record.id,
      orderNumber: record.orderNumber,
      userId: record.userId,
      items: record.items || [],
      subtotal: Number(record.subtotal),
      taxAmount: Number(record.taxAmount),
      shippingCost: Number(record.shippingCost),
      discount: Number(record.discount),
      totalAmount: Number(record.totalAmount),
      currency: record.currency,
      shippingAddress: record.shippingAddress,
      billingAddress: record.billingAddress,
    });
  }
}
