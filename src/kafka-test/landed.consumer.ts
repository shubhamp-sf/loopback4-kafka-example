import {
  consumer,
  eventHandler,
  IConsumer,
  StreamHandler,
} from 'loopback4-kafka-client';
import {Events, KafkaTopics, TestStream} from './test-stream';

// start.consumer.ts
@consumer<TestStream, Events.LANDED>()
export class LandedConsumer implements IConsumer<TestStream, Events.LANDED> {
  constructor(
    @eventHandler<TestStream>(Events.LANDED)
    public handler: StreamHandler<TestStream, Events.LANDED>,
  ) {}
  topic = KafkaTopics.PageEngagement;
  event = Events.LANDED as const;
}
