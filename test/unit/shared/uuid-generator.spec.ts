import { UuidGenerator } from '../../../src/shared/utils/uuid-generator.util';

describe('UuidGenerator', () => {
  it('should generate valid UUID v7', () => {
    const uuid = UuidGenerator.generate();
    
    expect(uuid).toBeDefined();
    expect(typeof uuid).toBe('string');
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should generate unique UUIDs', () => {
    const uuid1 = UuidGenerator.generate();
    const uuid2 = UuidGenerator.generate();
    
    expect(uuid1).not.toBe(uuid2);
  });

  it('should generate sortable UUIDs', () => {
    const uuid1 = UuidGenerator.generate();
    const uuid2 = UuidGenerator.generate();
    
    expect(uuid1 < uuid2).toBe(true);
  });
});
