export abstract class AggregateRoot {
  private domainEvents: any[] = [];

  protected addDomainEvent(event: any): void {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): any[] {
    return this.domainEvents;
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
