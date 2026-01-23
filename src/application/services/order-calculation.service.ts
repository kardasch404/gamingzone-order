import { Injectable } from '@nestjs/common';
import { CartItem } from './cart-validation.service';

export interface OrderTotals {
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
}

@Injectable()
export class OrderCalculationService {
  private readonly TAX_RATE = 0.2;
  private readonly FREE_SHIPPING_THRESHOLD = 500;
  private readonly FLAT_SHIPPING_COST = 30;

  calculate(items: CartItem[], shippingAddress?: any): OrderTotals {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const taxAmount = subtotal * this.TAX_RATE;
    const shippingCost = this.calculateShippingCost(subtotal, shippingAddress);
    const discount = 0;
    const totalAmount = subtotal + taxAmount + shippingCost - discount;

    return {
      subtotal,
      taxAmount,
      shippingCost,
      discount,
      totalAmount,
    };
  }

  private calculateShippingCost(subtotal: number, address?: any): number {
    if (subtotal >= this.FREE_SHIPPING_THRESHOLD) {
      return 0;
    }

    return this.FLAT_SHIPPING_COST;
  }
}
