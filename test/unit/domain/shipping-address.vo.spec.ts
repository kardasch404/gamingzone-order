import { ShippingAddressVO } from '../../../src/domain/value-objects/shipping-address.vo';

describe('ShippingAddressVO', () => {
  const validData = {
    name: 'John Doe',
    phone: '+212600000000',
    address: '123 Main St',
    city: 'Casablanca',
    postalCode: '20000',
    country: 'Morocco',
  };

  it('should create valid shipping address', () => {
    const address = new ShippingAddressVO(
      validData.name,
      validData.phone,
      validData.address,
      validData.city,
      validData.postalCode,
      validData.country,
    );

    expect(address.name).toBe(validData.name);
    expect(address.phone).toBe(validData.phone);
    expect(address.city).toBe(validData.city);
  });

  it('should throw error for empty name', () => {
    expect(() => new ShippingAddressVO('', validData.phone, validData.address, validData.city, validData.postalCode)).toThrow('Name is required');
  });

  it('should throw error for empty phone', () => {
    expect(() => new ShippingAddressVO(validData.name, '', validData.address, validData.city, validData.postalCode)).toThrow('Phone is required');
  });

  it('should convert to JSON', () => {
    const address = new ShippingAddressVO(
      validData.name,
      validData.phone,
      validData.address,
      validData.city,
      validData.postalCode,
      validData.country,
    );

    const json = address.toJSON();
    expect(json).toEqual(validData);
  });

  it('should create from JSON', () => {
    const address = ShippingAddressVO.fromJSON(validData);
    expect(address.name).toBe(validData.name);
    expect(address.toJSON()).toEqual(validData);
  });

  it('should use default country', () => {
    const address = new ShippingAddressVO(
      validData.name,
      validData.phone,
      validData.address,
      validData.city,
      validData.postalCode,
    );
    expect(address.country).toBe('Morocco');
  });
});
