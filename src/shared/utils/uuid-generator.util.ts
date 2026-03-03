import { uuidv7 } from 'uuidv7';

export class UuidGenerator {
  static generate(): string {
    return uuidv7();
  }
}
