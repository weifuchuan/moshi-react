import EventEmitter from 'wolfy87-eventemitter';

declare global {
  declare var __DEV__: boolean;

  declare var bus: EventEmitter;
}
