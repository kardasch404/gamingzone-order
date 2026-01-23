export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly sku: string,
    public readonly name: string,
    public readonly price: number,
    public readonly quantity: int,
    public readonly subtotal: number,
    public readonly image: string | null = null,
    public readonly reservationId: string | null = null,
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (this.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (this.subtotal !== this.price * this.quantity) {
      throw new Error('Subtotal must equal price * quantity');
    }
  }

  static create(data: {
    id: string;
    productId: string;
    sku: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    reservationId?: string;
  }): OrderItem {
    const subtotal = data.price * data.quantity;
    
    return new OrderItem(
      data.id,
      data.productId,
      data.sku,
      data.name,
      data.price,
      data.quantity,
      subtotal,
      data.image || null,
      data.reservationId || null,
    );
  }

  updateQuantity(newQuantity: number): OrderItem {
    return new OrderItem(
      this.id,
      this.productId,
      this.sku,
      this.name,
      this.price,
      newQuantity,
      this.price * newQuantity,
      this.image,
      this.reservationId,
    );
  }
}
