import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {
  eventHandlerKey,
  KafkaClientBindings,
  KafkaClientComponent,
  KafkaClientOptions,
} from 'loopback4-kafka-client';
import path from 'path';
import {LandedConsumer} from './kafka-test/landed.consumer';
import {
  Events,
  KafkaTopics,
  LandedEvent,
  TestStream,
} from './kafka-test/test-stream';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class Lb4KafkaTestApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.configure<KafkaClientOptions>(KafkaClientBindings.Component).to({
      initObservers: true, // if you want to init consumer lifeCycleObserver
      topics: [KafkaTopics.PageEngagement], // if you want to use producers for given topics
      connection: {
        // refer https://kafka.js.org/docs/configuration
        ssl: true,
        // clientId: 'kafka-client-test',
        brokers: [''],
        sasl: {
          mechanism: 'plain', // scram-sha-256 or scram-sha-512
          username: '',
          password: '',
        },
      },
    });
    this.bind(KafkaClientBindings.ProducerConfiguration).to({
      // your producer config
      // refer https://kafka.js.org/docs/producing#options
    });
    this.bind(KafkaClientBindings.ConsumerConfiguration).to({
      // refer https://kafka.js.org/docs/consuming#options
      groupId: '',
    });

    this.bind(eventHandlerKey<TestStream, Events.LANDED>(Events.LANDED)).to(
      async (payload: LandedEvent): Promise<void> => {
        console.log('consumer', payload);
      },
    );

    this.component(KafkaClientComponent);

    // Set up the custom sequence
    this.sequence(MySequence);
    this.service(LandedConsumer);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
