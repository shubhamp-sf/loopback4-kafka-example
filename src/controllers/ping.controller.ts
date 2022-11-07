import {inject} from '@loopback/core';
import {
  get,
  Request,
  response,
  ResponseObject,
  RestBindings,
} from '@loopback/rest';
import {Producer, producer as productDecorator} from 'loopback4-kafka-client';
import {Events, KafkaTopics, TestStream} from '../kafka-test/test-stream';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @productDecorator(KafkaTopics.PageEngagement)
    private producer: Producer<TestStream>,
  ) {}

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE)
  async ping(): Promise<object> {
    await this.producer.send(Events.LANDED, [
      {
        url: 'example.com',
        ts: new Date().getTime(),
      },
    ]);
    return {
      greeting: 'Hello from LoopBack',
    };
  }
}
