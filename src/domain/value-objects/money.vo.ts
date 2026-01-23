export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'MAD',
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (!this.currency) {
      throw new Error('Currency is required');
    }
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  lessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount < other.amount;
  }

  greaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount > other.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot operate on different currencies: ${this.currency} and ${other.currency}`);
    }
  }

  toJSON(): { amount: number; currency: string } {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }

  static fromJSON(data: { amount: number; currency: string }): Money {
    return new Money(data.amount, data.currency);
  }

  static zero(currency: string = 'MAD'): Money {
    return new Money(0, currency);
  }
}
