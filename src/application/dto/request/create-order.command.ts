export class CreateOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly shippingAddress: {
      name: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
      country?: string;
    },
    public readonly billingAddress?: any,
    public readonly notes?: string,
  ) {}
}
