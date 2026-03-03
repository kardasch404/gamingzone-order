import { Injectable } from '@nestjs/common';

@Injectable()
export class IdempotencyService {
  private processedEvents: Set<string> = new Set();

  async isEventProcessed(eventId: string): Promise<boolean> {
    return this.processedEvents.has(eventId);
  }

  async markEventProcessed(eventId: string): Promise<void> {
    this.processedEvents.add(eventId);
  }

  async clearProcessedEvents(): Promise<void> {
    this.processedEvents.clear();
  }
}
