import { IdempotencyService } from '../../../src/application/services/idempotency.service';

describe('IdempotencyService', () => {
  let service: IdempotencyService;

  beforeEach(() => {
    service = new IdempotencyService();
  });

  it('should mark event as processed', async () => {
    await service.markEventProcessed('evt-1');

    const isProcessed = await service.isEventProcessed('evt-1');

    expect(isProcessed).toBe(true);
  });

  it('should return false for unprocessed events', async () => {
    const isProcessed = await service.isEventProcessed('evt-unknown');

    expect(isProcessed).toBe(false);
  });

  it('should clear processed events', async () => {
    await service.markEventProcessed('evt-1');
    await service.markEventProcessed('evt-2');

    await service.clearProcessedEvents();

    expect(await service.isEventProcessed('evt-1')).toBe(false);
    expect(await service.isEventProcessed('evt-2')).toBe(false);
  });
});
