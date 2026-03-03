import { Order } from '../aggregates/order.aggregate';

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderSearchParams {
  userId?: string;
  status?: string;
  orderNumber?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(orderId: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  findByUserId(userId: string, pagination: PaginationParams): Promise<PaginatedResult<Order>>;
  search(params: OrderSearchParams, pagination: PaginationParams): Promise<PaginatedResult<Order>>;
  delete(orderId: string): Promise<void>;
}
