import {IStreamDefinition} from 'loopback4-kafka-client';

export const KafkaTopics = {
  PageEngagement: 'PageEngagement' as const,
};

export enum Events {
  LANDED = 'LANDED',
  VIEWING = 'VIEWING',
  LINK_CLICK = 'LINK_CLICK',
}

export type LandedEvent = {
  url: string;
  ts: number;
};

export type ViewingEvent = {
  url: string;
  ts: number;
};

export type LinkClickEvent = {
  url: string;
  targetUrl: string;
  ts: number;
};

export class TestStream implements IStreamDefinition {
  topic = KafkaTopics.PageEngagement;
  messages: {
    // [<event type key from enum>] : <event type or interface>
    [Events.LANDED]: LandedEvent;
    [Events.LINK_CLICK]: LinkClickEvent;
    [Events.VIEWING]: ViewingEvent;
  };
}
