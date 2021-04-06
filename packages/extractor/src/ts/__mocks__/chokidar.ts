import {EventType} from '../TsProjectWatcher';

export function watch(...args: []) {
  console.log('args', args);
  if (lastWatcher) throw Error('Watcher already created');
  return (lastWatcher = new FSWatcher());
}

let lastWatcher: FSWatcher | undefined;

export function raise(eventName: EventType, path: string) {
  lastWatcher?.raise(eventName, path);
}

export function clearMock() {
  lastWatcher = undefined;
}

export class FSWatcher {
  private listeners: ((eventName: string, path: string) => void)[] = [];

  raise(eventName: EventType, path: string) {
    this.listeners.forEach(l => l(eventName, path));
    //  console.log('lis', this.listeners.length);
  }

  on(_event: string, listener: () => void) {
    this.listeners.push(listener);
  }

  close() {
    this.listeners = [];
    return Promise.resolve(jest.fn());
  }
}
