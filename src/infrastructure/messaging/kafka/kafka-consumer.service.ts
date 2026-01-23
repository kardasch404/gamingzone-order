import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { kafkaConfig } from '../../../shared/config/kafka.config';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;
  private handlers: Map<string, (payload: any) => Promise<void>> = new Map();

  constructor() {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
    });

    this.consumer = this.kafka.consumer({
      groupId: kafkaConfig.groupId,
    });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topics: ['payment.events', 'shipment.events'],
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });
  }

  registerHandler(eventType: string, handler: (payload: any) => Promise<void>) {
    this.handlers.set(eventType, handler);
  }

  private async handleMessage(payload: EachMessagePayload) {
    const { topic, partition, message } = payload;
    const eventType = message.key?.toString() || '';
    const eventData = JSON.parse(message.value?.toString() || '{}');

    const handler = this.handlers.get(eventType);
    if (handler) {
      await handler(eventData);
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
