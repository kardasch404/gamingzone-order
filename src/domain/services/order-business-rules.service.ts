export class OrderBusinessRules {
  static readonly MINIMUM_ORDER_AMOUNT = 50;
  static readonly MAXIMUM_ITEMS_PER_ORDER = 50;
  static readonly DEFAULT_CURRENCY = 'MAD';

  static validateMinimumAmount(amount: number): void {
    if (amount < this.MINIMUM_ORDER_AMOUNT) {
      throw new Error(`Minimum order amount is ${this.MINIMUM_ORDER_AMOUNT} ${this.DEFAULT_CURRENCY}`);
    }
  }

  static validateItemsCount(itemsCount: number): void {
    if (itemsCount === 0) {
      throw new Error('Order must have at least one item');
    }

    if (itemsCount > this.MAXIMUM_ITEMS_PER_ORDER) {
      throw new Error(`Maximum ${this.MAXIMUM_ITEMS_PER_ORDER} items per order`);
    }
  }

  static validateShippingAddress(address: any): void {
    if (!address) {
      throw new Error('Shipping address is required');
    }

    const required = ['name', 'phone', 'address', 'city', 'postalCode'];
    for (const field of required) {
      if (!address[field]) {
        throw new Error(`Shipping address ${field} is required`);
      }
    }
  }

  static validateOrderNumber(orderNumber: string): void {
    const pattern = /^ORD-\d{4}-\d{6}$/;
    if (!pattern.test(orderNumber)) {
      throw new Error('Invalid order number format');
    }
  }

  static validateItemQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Item quantity must be greater than 0');
    }
  }

  static validateItemPrice(price: number): void {
    if (price < 0) {
      throw new Error('Item price cannot be negative');
    }
  }
}
