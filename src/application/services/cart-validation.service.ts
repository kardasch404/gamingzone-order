import { Injectable } from '@nestjs/common';

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

export interface ValidationError {
  sku: string;
  message: string;
  type: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

@Injectable()
export class CartValidationService {
  async validate(cart: Cart): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    if (!cart || cart.items.length === 0) {
      errors.push({
        sku: '',
        message: 'Cart is empty',
        type: 'EMPTY_CART',
      });
    }

    if (cart.items.length > 50) {
      errors.push({
        sku: '',
        message: 'Maximum 50 items per order',
        type: 'TOO_MANY_ITEMS',
      });
    }

    for (const item of cart.items || []) {
      if (item.quantity <= 0) {
        errors.push({
          sku: item.sku,
          message: 'Quantity must be greater than 0',
          type: 'INVALID_QUANTITY',
        });
      }

      if (item.price < 0) {
        errors.push({
          sku: item.sku,
          message: 'Price cannot be negative',
          type: 'INVALID_PRICE',
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
