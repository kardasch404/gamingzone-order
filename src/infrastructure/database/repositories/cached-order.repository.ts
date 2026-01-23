import { Injectable } from '@nestjs/common';
import { Order } from '../../../domain/aggregates/order.aggregate';
import {
  IOrderRepository,
  PaginationParams,
  PaginatedResult,
  OrderSearchParams,
} from '../../../domain/interfaces/order-repository.interface';
import { OrderRepository } from './order.repository';
import { OrderCacheService } from '../../cache/order-cache.service';

@Injectable()
export class CachedOrderRepository implements IOrderRepository {
  constructor(
    private readonly repository: OrderRepository,
    private readonly cache: OrderCacheService,
  ) {}

  async save(order: Order): Promise<void> {
    await this.repository.save(order);
    await this.cache.delete(`order:${order.id}`);
    await this.cache.deletePattern(`user-orders:${order.userId}:*`);
  }

  async findById(orderId: string): Promise<Order | null> {
    const cacheKey = `order:${orderId}`;
    const cached = await this.cache.get<Order>(cacheKey);
    
    if (cached) return cached;

    const order = await this.repository.findById(orderId);
    
    if (order) {
      await this.cache.set(cacheKey, order, 600);
    }
    
    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const cacheKey = `order:number:${orderNumber}`;
    const cached = await this.cache.get<Order>(cacheKey);
    
    if (cached) return cached;

    const order = await this.repository.findByOrderNumber(orderNumber);
    
    if (order) {
      await this.cache.set(cacheKey, order, 600);
    }
    
    return order;
  }

  async findByUserId(
    userId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Order>> {
    const cacheKey = `user-orders:${userId}:${pagination.page}:${pagination.limit}`;
    const cached = await this.cache.get<PaginatedResult<Order>>(cacheKey);
    
    if (cached) return cached;

    const result = await this.repository.findByUserId(userId, pagination);
    await this.cache.set(cacheKey, result, 300);
    
    return result;
  }

  async search(
    params: OrderSearchParams,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Order>> {
    return await this.repository.search(params, pagination);
  }

  async delete(orderId: string): Promise<void> {
    await this.repository.delete(orderId);
    await this.cache.delete(`order:${orderId}`);
  }
}
