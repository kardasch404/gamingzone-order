import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export interface OrderFilters {
  userId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  orderNumber?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface OrderQueryResult {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
}

@Injectable()
export class OrderQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrders(
    filters: OrderFilters,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: OrderQueryResult[]; total: number }> {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters.orderNumber) {
      where.orderNumber = { contains: filters.orderNumber, mode: 'insensitive' };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    if (filters.minAmount || filters.maxAmount) {
      where.totalAmount = {};
      if (filters.minAmount) where.totalAmount.gte = filters.minAmount;
      if (filters.maxAmount) where.totalAmount.lte = filters.maxAmount;
    }

    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          userId: true,
          status: true,
          totalAmount: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        ...item,
        totalAmount: Number(item.totalAmount),
      })),
      total,
    };
  }

  async countByStatus(userId?: string): Promise<Record<string, number>> {
    const where = userId ? { userId } : {};

    const counts = await this.prisma.order.groupBy({
      by: ['status'],
      where,
      _count: { status: true },
    });

    return counts.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);
  }
}
