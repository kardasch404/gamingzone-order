export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export class ShippingAddressVO {
  constructor(
    public readonly name: string,
    public readonly phone: string,
    public readonly address: string,
    public readonly city: string,
    public readonly postalCode: string,
    public readonly country: string = 'Morocco',
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name?.trim()) throw new Error('Name is required');
    if (!this.phone?.trim()) throw new Error('Phone is required');
    if (!this.address?.trim()) throw new Error('Address is required');
    if (!this.city?.trim()) throw new Error('City is required');
    if (!this.postalCode?.trim()) throw new Error('Postal code is required');
    if (!this.country?.trim()) throw new Error('Country is required');
  }

  toJSON(): ShippingAddress {
    return {
      name: this.name,
      phone: this.phone,
      address: this.address,
      city: this.city,
      postalCode: this.postalCode,
      country: this.country,
    };
  }

  static fromJSON(data: ShippingAddress): ShippingAddressVO {
    return new ShippingAddressVO(
      data.name,
      data.phone,
      data.address,
      data.city,
      data.postalCode,
      data.country,
    );
  }
}
