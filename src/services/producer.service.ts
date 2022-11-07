import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {Producer, producer as productDecorator} from 'loopback4-kafka-client';
import {KafkaTopics, TestStream} from '../kafka-test/test-stream';
@injectable({scope: BindingScope.TRANSIENT})
export class ProducerService {
  constructor(
    @productDecorator(KafkaTopics.PageEngagement)
    private producer: Producer<TestStream>,
  ) {}
}
