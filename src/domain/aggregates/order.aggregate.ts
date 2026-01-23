import { AggregateRoot } from './aggregate-root.base';
import { OrderStatus, PaymentStatus, FulfillmentStatus } from '@prisma/client';

export class Order extends AggregateRoot {
  private constructor(
    public readonly id: string,
    public readonly orderNumber: string,
    public readonly userId: string,
    public status: OrderStatus,
    public paymentStatus: PaymentStatus,
    public fulfillmentStatus: FulfillmentStatus,
    public items: any[],
    public subtotal: number,
    public taxAmount: number,
    public shippingCost: number,
    public discount: number,
    public totalAmount: number,
    public currency: string,
    public shippingAddress: any,
    public billingAddress: any | null,
    public paymentMethod: string | null,
    public paymentId: string | null,
    public paidAt: Date | null,
    public notes: string | null,
    public cancelReason: string | null,
    public cancelledAt: Date | null,
    public estimatedDelivery: Date | null,
    public deliveredAt: Date | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {
    super();
  }

  static create(data: {
    id: string;
    orderNumber: string;
    userId: string;
    items: any[];
    subtotal: number;
    taxAmount: number;
    shippingCost: number;
    discount: number;
    totalAmount: number;
    currency: string;
    shippingAddress: any;
    billingAddress?: any;
  }): Order {
    if (data.totalAmount < 50) {
      throw new Error('Minimum order amount is 50 MAD');
    }

    if (data.items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    if (data.items.length > 50) {
      throw new Error('Maximum 50 items per order');
    }

    const order = new Order(
      data.id,
      data.orderNumber,
      data.userId,
      OrderStatus.PENDING,
      PaymentStatus.PENDING,
      FulfillmentStatus.UNFULFILLED,
      data.items,
      data.subtotal,
      data.taxAmount,
      data.shippingCost,
      data.discount,
      data.totalAmount,
      data.currency,
      data.shippingAddress,
      data.billingAddress || null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      new Date(),
      new Date(),
    );

    return order;
  }

  confirm(paymentId: string): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error(`Cannot confirm order in ${this.status} status`);
    }

    this.status = OrderStatus.CONFIRMED;
    this.paymentStatus = PaymentStatus.PAID;
    this.paymentId = paymentId;
    this.paidAt = new Date();
    this.updatedAt = new Date();
  }

  cancel(reason: string): void {
    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(this.status)) {
      throw new Error(`Cannot cancel order in ${this.status} status`);
    }

    this.status = OrderStatus.CANCELLED;
    this.cancelReason = reason;
    this.cancelledAt = new Date();
    this.updatedAt = new Date();
  }

  startProcessing(): void {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new Error(`Cannot process order in ${this.status} status`);
    }

    this.status = OrderStatus.PROCESSING;
    this.updatedAt = new Date();
  }

  ship(trackingNumber?: string): void {
    if (this.status !== OrderStatus.PROCESSING) {
      throw new Error(`Cannot ship order in ${this.status} status`);
    }

    this.status = OrderStatus.SHIPPED;
    this.fulfillmentStatus = FulfillmentStatus.FULFILLED;
    this.updatedAt = new Date();
  }

  deliver(): void {
    if (this.status !== OrderStatus.SHIPPED) {
      throw new Error(`Cannot deliver order in ${this.status} status`);
    }

    this.status = OrderStatus.DELIVERED;
    this.deliveredAt = new Date();
    this.updatedAt = new Date();
  }

  refund(): void {
    if (this.paymentStatus !== PaymentStatus.PAID) {
      throw new Error('Can only refund paid orders');
    }

    this.status = OrderStatus.REFUNDED;
    this.paymentStatus = PaymentStatus.REFUNDED;
    this.updatedAt = new Date();
  }

  canBeCancelled(): boolean {
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(this.status);
  }

  canBeModified(): boolean {
    return this.status === OrderStatus.PENDING;
  }
}
