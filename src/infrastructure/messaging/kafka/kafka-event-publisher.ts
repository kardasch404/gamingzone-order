import { Injectable } from '@nestjs/common';
import { IEventBus } from '../../../domain/interfaces/event-bus.interface';
import { DomainEvent } from '../../../domain/events/domain-event.base';

@Injectable()
export class KafkaEventPublisher implements IEventBus {
  async publish(event: DomainEvent): Promise<void> {
    console.log(`Publishing event: ${event.getEventName()}`, event);
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
