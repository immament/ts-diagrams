import {EventType} from '../TsProjectWatcher';

export function watch() {
  if (lastWatcher) throw Error('Watcher already created');
  return (lastWatcher = new FSWatcher());
}

export class FSWatcher {
  private listeners: ((eventName: string, path: string) => void)[] = [];

  on(_event: string, listener: () => void) {
    this.listeners.push(listener);
  }

  close() {
    this.listeners = [];
    return Promise.resolve(jest.fn());
  }

  // mock helper
  raise(eventName: EventType, path: string) {
    this.listeners.forEach(l => l(eventName, path));
  }
}

// helpers

let lastWatcher: FSWatcher | undefined;

export function raise(eventName: EventType, path: string) {
  lastWatcher?.raise(eventName, path);
}

export function clearMock() {
  lastWatcher = undefined;
}
